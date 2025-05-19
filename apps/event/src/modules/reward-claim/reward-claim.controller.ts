import {Controller, Get, Param, Post} from "@nestjs/common";
import {RewardClaimService} from "./reward-claim.service";
import {User} from "../../../../../libs/shared/user.decorator";

@Controller()
export class RewardClaimController {
    constructor(private readonly service: RewardClaimService) {
    }

    @Post('api/v1/events/:eventId/milestones/:milestoneId/claim')
    async claim(
        @Param('eventId') eventId: string,
        @Param('milestoneId') milestoneId: string,
        @User('userId') userId: string,
    ) {
        return this.service.claim(eventId, milestoneId, userId);
    }
    @Get('api/v1/events/reward-claims/me')
    async getMyClaims(
        @User('userId') userId: string,
    ) {
        return this.service.findUserClaims(userId);
    }


    @Get('api/v1/events/reward-claims/')
    async getAllClaims(
    ) {
        return this.service.findAllClaims();
    }
}