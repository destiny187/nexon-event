import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import {Milestone, Reward} from "./milestone-reward.schema";
import { MongoTransaction } from "../../../../../libs/database/mongo.transaction";
import { CreateMilestoneRewardDto, UpdateMilestoneRewardDto } from "./milestone-reward.dto";
import {toObjectId} from "../../../../../libs/common/utils/type-util";

@Injectable()
export class MilestoneRewardService {
    constructor(
        @InjectConnection('eventdb') private readonly connection: Connection,
        @InjectModel(Milestone.name, 'eventdb') private readonly milestoneModel: Model<Milestone>,
        @InjectModel(Reward.name, 'eventdb') private readonly rewardModel: Model<Reward>,
    ) {
    }

    async create(
        eventId: string,
        dto: CreateMilestoneRewardDto,
    ): Promise<{ milestone: Milestone; rewards: Reward[] }> {
        const eventObjectId = toObjectId(eventId);

        return await MongoTransaction(this.connection, async (session) => {
            const seq = await this.milestoneModel
                .countDocuments({eventId: eventObjectId})
                .session(session)
                .then((n) => n + 1);

            const milestone = await this.milestoneModel.create(
                [
                    {
                        eventId: eventObjectId,
                        seq,
                        conditionType: dto.conditionType,
                        value: dto.value,
                    },
                ],
                {session},
            ).then(([doc]) => doc);

            const rewards = await this.rewardModel.insertMany(
                dto.rewards.map((r) => ({
                    milestoneId: milestone._id,
                    rewardType: r.rewardType,
                    amount: r.amount,
                    meta: r.meta,
                })),
                {session},
            );

            return {milestone: milestone.toObject(), rewards: rewards.map((r) => r.toObject())};
        });
    }

    async findAll(eventId: string) {
        const eventObjectId = toObjectId(eventId);

        const milestones = await this.milestoneModel
            .find({ eventId: eventObjectId })
            .lean()
            .exec();

        const milestoneIds = milestones.map((m) => m._id);
        const rewards = await this.rewardModel
            .find({ milestoneId: { $in: milestoneIds } })
            .lean()
            .exec();

        const rewardsByMilestone = new Map<string, Reward[]>();
        for (const reward of rewards) {
            const key = reward.milestoneId.toString();
            if (!rewardsByMilestone.has(key)) rewardsByMilestone.set(key, []);
            rewardsByMilestone.get(key)!.push(reward);
        }

        return milestones.map((m) => ({
            ...m,
            rewards: rewardsByMilestone.get(m._id.toString()) ?? [],
        }));
    }

    async findOne(eventId: string, milestoneId: string) {
        const eventObjectId = toObjectId(eventId);
        const milestoneObjectId = toObjectId(milestoneId);

        const milestone = await this.milestoneModel
            .findOne({_id: milestoneObjectId, eventId: eventObjectId})
            .lean()
            .exec();

        if (!milestone) throw new NotFoundException('milestone not found');

        const rewards = await this.rewardModel
            .find({milestoneId: milestoneObjectId})
            .lean()
            .exec();

        return {...milestone, rewards};
    }

    async update(
        eventId: string,
        milestoneId: string,
        dto: UpdateMilestoneRewardDto,
    ) {
        const eventObjectId = toObjectId(eventId);
        const milestoneObjectId = toObjectId(milestoneId);

        return await MongoTransaction(this.connection, async (session) => {
            const milestone = await this.milestoneModel
                .findOneAndUpdate(
                    {_id: milestoneObjectId, eventId: eventObjectId},
                    {
                        $set: {
                            conditionType: dto.conditionType,
                            value: dto.value,
                        },
                    },
                    {new: true, session},
                )
                .lean();
            if (!milestone) throw new NotFoundException('milestone not found');

            if (dto.rewards) {
                await this.rewardModel.deleteMany(
                    {milestoneId: milestoneObjectId},
                    {session},
                );
                await this.rewardModel.insertMany(
                    dto.rewards.map((r) => ({
                        milestoneId: milestoneObjectId,
                        rewardType: r.rewardType,
                        amount: r.amount,
                        meta: r.meta,
                    })),
                    {session},
                );
            }

            const rewards = await this.rewardModel
                .find({milestoneId: milestoneObjectId})
                .lean()
                .exec();

            return {...milestone, rewards};
        });
    }

    async remove(eventId: string, milestoneId: string) {
        const eventObjectId = toObjectId(eventId);
        const milestoneObjectId = toObjectId(milestoneId);

        return await MongoTransaction(this.connection, async (session) => {
            const ms = await this.milestoneModel
                .findOneAndDelete({_id: milestoneObjectId, eventId: eventObjectId}, {session})
                .lean();

            if (!ms) throw new NotFoundException('milestone not found');

            await this.rewardModel.deleteMany({milestoneId: milestoneObjectId}, {session});

            return ms;
        });
    }
}