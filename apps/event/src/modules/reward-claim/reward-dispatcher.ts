import {Injectable, Logger} from "@nestjs/common";
import {Reward} from "../milestone-reward/milestone-reward.schema";
import {RewardType} from "../../../../../libs/shared/enums/event-enum";

//Assume that a reward-claim has been paid.
@Injectable()
export class RewardDispatcher {
    private readonly logger = new Logger(RewardDispatcher.name);

    async grant(
        userId: string,
        reward: Reward,
    ): Promise<void> {
        switch (reward.rewardType) {
            case RewardType.ITEM:
                this.logger.log(`Item provided complete / userId: ${userId}} / reward: ${JSON.stringify(reward.meta, null, 2)}`);
                break;
            case RewardType.COUPON:
                this.logger.log(`Coupon provided complete / userId: ${userId} / reward: ${JSON.stringify(reward.meta, null, 2)}`);
                break;
            case RewardType.POINT:
                this.logger.log(`Point provided complete / userId: ${userId} / reward: ${JSON.stringify(reward.meta, null, 2)}`);
                break;
            default:
                throw new Error('Unsupported reward');
        }
    }
}