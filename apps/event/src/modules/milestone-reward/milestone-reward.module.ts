import {Module} from '@nestjs/common';
import {MilestoneRewardService} from "./milestone-reward.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Reward, MilestoneRewardSchema, MilestoneSchema, Milestone} from "./milestone-reward.schema";
import {MilestoneRewardController} from "./milestone-reward.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Milestone.name, schema: MilestoneSchema},
            {name: Reward.name, schema: MilestoneRewardSchema},
        ], 'eventdb'),
    ],
    controllers: [MilestoneRewardController],
    providers: [MilestoneRewardService],
    exports: [MongooseModule, MilestoneRewardService],
})

export class MilestoneRewardModule {}
