import {Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Types, Document, Schema as MgSchema} from 'mongoose';
import {ConditionType, RewardType} from "../../../../../libs/shared/enums/event-enum";

@Schema({collection: 'milestones', timestamps: true})
export class Milestone {
    @Prop({type: Types.ObjectId, ref: 'Event', required: true, index: true})
    eventId: Types.ObjectId;

    @Prop({required: true, min: 1})
    seq: number;

    @Prop({ required: true, enum: ConditionType, type: String })
    conditionType: ConditionType;

    @Prop({required: true})
    value: number;
}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);

@Schema({collection: 'rewards', timestamps: true})
export class Reward extends Document {
    @Prop({type: Types.ObjectId, ref: 'Milestone', required: true, index: true})
    milestoneId: Types.ObjectId;

    @Prop({ required: true, enum: RewardType, type: String })
    rewardType: RewardType;

    @Prop({required: true, min: 1})
    amount: number;

    @Prop({ type: MgSchema.Types.Mixed })
    meta: Record<string, string>;
}

export const MilestoneRewardSchema = SchemaFactory.createForClass(Reward);