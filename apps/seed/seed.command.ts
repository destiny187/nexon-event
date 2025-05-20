import {Command, CommandRunner} from 'nest-commander';
import {Injectable, Logger} from '@nestjs/common';
import {UserService} from "../auth/src/modules/user/user.service";
import {UserRole} from "../../libs/shared/enums/user-enum";
import {ApiPermissionService} from "../auth/src/modules/api-permission/api-permission.service";
import {EventService} from "../event/src/modules/event/event.service";
import {MilestoneRewardService} from "../event/src/modules/milestone-reward/milestone-reward.service";
import {Types} from "mongoose";

@Injectable()
@Command({name: 'seed', description: 'Populate initial data'})
export class SeedCommand extends CommandRunner {
    private readonly logger = new Logger(SeedCommand.name);

    constructor(
        private readonly userService: UserService,
        private readonly permService: ApiPermissionService,
        private readonly eventService: EventService,
        private readonly milestoneRewardService: MilestoneRewardService,
    ) {
        super();
    }

    async run(): Promise<void> {
        //사용자
        this.logger.log('userdb - Users');
        await this.userService.signup({
            nickname: 'jinseong',
            email: 'user@nexon.com',
            password: '1111',
        });
        await this.userService.signup({
            nickname: 'admin',
            email: 'admin@nexon.com',
            password: '2222',
            roles: [UserRole.ADMIN],
        });
        await this.userService.signup({
            nickname: 'operator',
            email: 'operator@nexon.com',
            password: '3333',
            roles: [UserRole.OPERATOR],
        });
        await this.userService.signup({
            nickname: 'auditor',
            email: 'auditor@nexon.com',
            password: '4444',
            roles: [UserRole.AUDITOR],
        });


        //API 권한 모음
        this.logger.log('userdb - ApiPermissions');
        await this.permService.createManyForInternal([
            {method: 'GET', path: '/api/v1/users', roles: [UserRole.ADMIN]},
            {method: 'GET', path: '/api/v1/users/:id', roles: [UserRole.ADMIN]},
            {
                method: 'POST',
                path: '/api/v1/events/:eventId/milestones/:milestoneId/claim',
                roles: [UserRole.USER, UserRole.ADMIN]
            },
            {method: 'GET', path: '/api/v1/events/reward-claims/me', roles: [UserRole.USER, UserRole.ADMIN]},
            {method: 'GET', path: '/api/v1/events/reward-claims', roles: [UserRole.OPERATOR, UserRole.AUDITOR, UserRole.ADMIN]},

            {method: 'POST', path: '/api/v1/events', roles: [UserRole.OPERATOR, UserRole.ADMIN]},
            {method: 'GET', path: '/api/v1/events', roles: [UserRole.OPERATOR, UserRole.ADMIN]},
            {method: 'GET', path: '/api/v1/events/:id', roles: [UserRole.OPERATOR, UserRole.ADMIN]},
            {method: 'PATCH', path: '/api/v1/events/:id', roles: [UserRole.OPERATOR, UserRole.ADMIN]},
            {method: 'DELETE', path: '/api/v1/events/:id', roles: [UserRole.OPERATOR, UserRole.ADMIN]},

            {method: 'POST', path: '/api/v1/events/:eventId/milestones', roles: [UserRole.OPERATOR, UserRole.ADMIN]},
            {method: 'GET', path: '/api/v1/events/:eventId/milestones', roles: [UserRole.OPERATOR, UserRole.ADMIN]},
            {
                method: 'GET',
                path: '/api/v1/events/:eventId/milestones/:milestoneId',
                roles: [UserRole.OPERATOR, UserRole.ADMIN]
            },
            {
                method: 'PATCH',
                path: '/api/v1/events/:eventId/milestones/:milestoneId',
                roles: [UserRole.OPERATOR, UserRole.ADMIN]
            },
            {
                method: 'DELETE',
                path: '/api/v1/events/:eventId/milestones/:milestoneId',
                roles: [UserRole.OPERATOR, UserRole.ADMIN]
            },

            {method: 'PATCH', path: '/api/v1/users/:id/roles', roles: [UserRole.ADMIN]},
        ]);

        //친구 초대 이벤트
        this.logger.log('eventdb - Events');
        const event = await this.eventService.create({
            title: '친구 초대 이벤트',
            description: 'INVITE_FRIEND',
            startAt: new Date().toISOString(),
            endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: "ACTIVE"
        });
        this.logger.log('res event - ', event);
        const eventId = typeof event._id === 'string'
            ? event._id
            : (event._id as Types.ObjectId).toHexString();

        //위 친구 초대 이벤트에 연결된 마일스톤과 보상
        this.logger.log('eventdb - Milestone reward');
        await this.milestoneRewardService.create(eventId, {
            conditionType: 'INVITE_FRIEND',
            value: 1,
            rewards: [
                {
                    rewardType: 'ITEM',
                    amount: 1,
                    meta: {itemId: 'abc100'},
                },
            ],
        });
        await this.milestoneRewardService.create(eventId, {
            conditionType: 'INVITE_FRIEND',
            value: 3,
            rewards: [
                {
                    rewardType: 'ITEM',
                    amount: 1,
                    meta: {itemId: 'abc123'},
                },
                {
                    rewardType: 'ITEM',
                    amount: 100,
                    meta: {itemId: 'abc124'},
                },
            ],
        });

        this.logger.log('Seed completed');
    }
}