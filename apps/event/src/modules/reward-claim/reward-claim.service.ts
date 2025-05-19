import {BadRequestException, ConflictException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Connection, Model} from "mongoose";
import {Milestone, Reward} from "../milestone-reward/milestone-reward.schema";
import {RewardDispatcher} from "./reward-dispatcher";
import {ConditionType} from "../../../../../libs/shared/enums/event-enum";
import {Event} from "../event/event.schema"
import {CheckerRegistry} from "./condition/checker.registry";
import {MilestoneRewardService} from "../milestone-reward/milestone-reward.service";
import {MongoTransaction} from "../../../../../libs/database/mongo.transaction";
import {toObjectId} from "../../../../../libs/common/utils/type-util";
import {ClaimStatus} from "./reward-cliam.enum";
import {RewardClaim} from "./reward-claim.schema";

@Injectable()
export class RewardClaimService {
    constructor(
        @InjectConnection('eventdb') private readonly connection: Connection,
        @InjectModel(Event.name, 'eventdb') private readonly eventModel: Model<Event>,
        @InjectModel(RewardClaim.name, 'eventdb') private readonly claimModel: Model<RewardClaim>,
        private readonly milestoneRewardService: MilestoneRewardService,
        private readonly registry: CheckerRegistry,
        private readonly dispatcher: RewardDispatcher,
    ) {
    }

    async claim(eventId: string, milestoneId: string, userId: string) {
        const eventObjectId = toObjectId(eventId);
        const milestoneObjectId = toObjectId(milestoneId);
        const userObjectId = toObjectId(userId);

        const event = await this.eventModel.findById(eventObjectId).lean();
        if (!event || !event.status) throw new BadRequestException('Event is inactive');

        const milestone = await this.milestoneRewardService.findOne(
            eventId,
            milestoneId,
        );

        //Check the progress of the event
        const checker = this.registry.get(milestone.conditionType as ConditionType);
        const progress = await checker.getProgress(
            userId,
            event.startAt.toISOString(),
            event.endAt.toISOString(),
        );
        if (progress < milestone.value) throw new BadRequestException('Milestone not reached');

        return await MongoTransaction(this.connection, async (session) => {
            try {
                await this.claimModel.create(
                    [{
                        userId: userObjectId,
                        eventId: eventObjectId,
                        milestoneId: milestoneObjectId,
                        meta: milestone.rewards.map(r => r.meta),
                        status: ClaimStatus.SUCCESS,
                    }],
                    {session},
                );

                for (const reward of milestone.rewards) {
                    await this.dispatcher.grant(userId, reward);
                }

                return {status: ClaimStatus.SUCCESS, rewards: milestone.rewards};
            } catch (e: any) {
                if (e.code === 11000) throw new ConflictException('Already claimed');

                await this.claimModel.create(
                    [{
                        userId: userObjectId,
                        eventId: eventObjectId,
                        milestoneId: milestoneObjectId,
                        status: ClaimStatus.FAILED,
                        failReason: e.message,
                    }],
                    {session},
                );
                throw new InternalServerErrorException('Grant failed');
            }
        });
    }
    async findUserClaims(userId: string) {
        const userObjectId = toObjectId(userId);
        return this.claimModel
            .find({ userId: userObjectId })
            .sort({ createdAt: -1 })
            .lean()
            .exec();
    }

    async findAllClaims() {
        return this.claimModel
            .find()
            .sort({ createdAt: -1 })
            .lean()
            .exec();
    }
}