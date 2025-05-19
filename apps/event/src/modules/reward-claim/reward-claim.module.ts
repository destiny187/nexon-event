import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {RewardClaim, RewardClaimSchema} from "./reward-claim.schema";
import {MilestoneRewardModule} from "../milestone-reward/milestone-reward.module";
import {CheckerModule} from "./condition/checker.module";
import {RewardClaimService} from "./reward-claim.service";
import {RewardDispatcher} from "./reward-dispatcher";
import {RewardClaimController} from "./reward-claim.controller";
import {EventModule} from "../event/event.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: RewardClaim.name, schema: RewardClaimSchema},
        ], 'eventdb'),
        MilestoneRewardModule,
        CheckerModule,
        EventModule,
    ],
    controllers: [RewardClaimController],
    providers: [RewardClaimService, RewardDispatcher],
    exports: [MongooseModule]
})
export class RewardClaimModule {
}