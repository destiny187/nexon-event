import {Module} from '@nestjs/common';
import {MilestoneRewardService} from "./milestone-reward.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Milestone, MilestoneSchema} from "../event/event.schema";
import {Reward, MilestoneRewardSchema} from "./milestone-reward.schema";
import {MilestoneRewardController} from "./milestone-reward.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Milestone.name, schema: MilestoneSchema},
            {name: Reward.name, schema: MilestoneRewardSchema},
        ]),
    ],
    controllers: [MilestoneRewardController],
    providers: [MilestoneRewardService],
})

export class MilestoneRewardModule {}
