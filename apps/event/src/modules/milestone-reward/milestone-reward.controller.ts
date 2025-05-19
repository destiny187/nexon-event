import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {success} from "../../../../../libs/common/utils/response.util";
import {MilestoneRewardService} from "./milestone-reward.service";
import {CreateMilestoneRewardDto, UpdateMilestoneRewardDto} from "./milestone-reward.dto";

@Controller()
export class MilestoneRewardController {
    constructor(
        private readonly service: MilestoneRewardService,
    ) {}

    @Post('api/v1/events/:eventId/milestones')
    async create(
        @Param('eventId') eventId: string,
        @Body() dto: CreateMilestoneRewardDto,
    ) {
        return success(await this.service.create(eventId, dto));
    }

    @Get('api/v1/events/:eventId/milestones')
    async findAll(@Param('eventId') eventId: string) {
        return success(await this.service.findAll(eventId));
    }

    @Get('api/v1/events/:eventId/milestones/:milestoneId')
    async findOne(
        @Param('eventId') eventId: string,
        @Param('milestoneId') milestoneId: string,
    ) {
        return success(await this.service.findOne(eventId, milestoneId));
    }

    @Patch('api/v1/events/:eventId/milestones/:milestoneId')
    async update(
        @Param('eventId') eventId: string,
        @Param('milestoneId') milestoneId: string,
        @Body() dto: UpdateMilestoneRewardDto,
    ) {
        return success(await this.service.update(eventId, milestoneId, dto));
    }

    @Delete('api/v1/events/:eventId/milestones/:milestoneId')
    async remove(
        @Param('eventId') eventId: string,
        @Param('milestoneId') milestoneId: string,
    ) {
        return success(await this.service.remove(eventId, milestoneId));
    }
}