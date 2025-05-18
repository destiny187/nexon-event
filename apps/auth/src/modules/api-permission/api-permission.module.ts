import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {ApiPermission, ApiPermissionSchema} from "../../../../../libs/database/schemas/api-permission.schema";
import {ApiPermissionManagerController} from "./api-permission.controller";
import {ApiPermissionService} from "./api-permission.service";
import {RedisCacheModule} from "../../../../../libs/redis/redis-cache-module";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ApiPermission.name, schema: ApiPermissionSchema },
        ]),
        RedisCacheModule,
    ],
    controllers: [ApiPermissionManagerController],
    providers: [ApiPermissionService],
    exports: [ApiPermissionService],
})
export class ApiPermissionModule {}