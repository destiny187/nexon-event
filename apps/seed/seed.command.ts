import {Command, CommandRunner} from 'nest-commander';
import {Injectable, Logger} from '@nestjs/common';
import {UserService} from "../auth/src/modules/user/user.service";
import {UserRole} from "../../libs/shared/enums/user-enum";
import {ApiPermissionService} from "../auth/src/modules/api-permission/api-permission.service";

@Injectable()
@Command({ name: 'seed', description: 'Populate initial data' })
export class SeedCommand extends CommandRunner {
    private readonly logger = new Logger(SeedCommand.name);

    constructor(
        private readonly userService: UserService,
        private readonly permService: ApiPermissionService,
    ) {
        super();
    }

    async run(): Promise<void> {
        await this.userService.signup({
            nickname: 'jinseong',
            email: 'jskim@nexon.com',
            password: '1111',
        });
        await this.userService.signup({
            nickname: 'test',
            email: 'test@nexon.com',
            password: '2222',
            roles: [UserRole.ADMIN],
        });


        await this.permService.createMany([
            { method: 'GET', path: '/api/v1/users', roles: [UserRole.ADMIN] },
            { method: 'GET', path: '/api/v1/users/:id', roles: [UserRole.ADMIN, UserRole.USER] },

            { method: 'POST', path: '/api/v1/auth/api-permissions', roles: [UserRole.ADMIN] },
            { method: 'POST', path: '/api/v1/auth/api-permissions/bulk', roles: [UserRole.ADMIN] },
            { method: 'GET', path: '/api/v1/auth/api-permissions', roles: [UserRole.ADMIN] },
            { method: 'GET', path: '/api/v1/auth/api-permissions/:id', roles: [UserRole.ADMIN] },
            { method: 'PATCH', path: '/api/v1/auth/api-permissions/:id', roles: [UserRole.ADMIN] },
            { method: 'DELETE', path: '/api/v1/auth/api-permissions/:id', roles: [UserRole.ADMIN] },
        ]);

        this.logger.log('Seed completed');
    }
}