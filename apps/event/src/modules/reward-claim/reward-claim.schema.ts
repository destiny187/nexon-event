import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Schema as MgSchema, Types} from "mongoose";
import {ClaimStatus} from "./reward-cliam.enum";

@Schema({ collection: 'reward_claims', timestamps: true })
export class RewardClaim extends Document{
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
    eventId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Milestone', required: true })
    milestoneId: Types.ObjectId;

    @Prop({ type: String, enum: ClaimStatus})
    status: ClaimStatus;

    @Prop() failReason?: string;

    @Prop({ type: MgSchema.Types.Mixed })
    meta: Record<string, string>;
}
export const RewardClaimSchema = SchemaFactory.createForClass(RewardClaim);

RewardClaimSchema.index({ userId: 1, milestoneId: 1 }, { unique: true });