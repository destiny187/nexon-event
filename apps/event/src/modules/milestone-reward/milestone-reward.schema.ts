import {Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Types, Document, Schema as MgSchema} from 'mongoose';


@Schema({collection: 'rewards', timestamps: true})
export class Reward extends Document {
    @Prop({type: Types.ObjectId, ref: 'Milestone', required: true, index: true})
    milestoneId: Types.ObjectId;

    @Prop({required: true})
    rewardType: string;

    @Prop({required: true, min: 1})
    amount: number;

    @Prop({ type: MgSchema.Types.Mixed })
    meta?: Record<string, string>;
}

export const MilestoneRewardSchema = SchemaFactory.createForClass(Reward);