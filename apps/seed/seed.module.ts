import {Module} from '@nestjs/common';
import {SeedCommand} from './seed.command';
import {UserModule} from "../auth/src/modules/user/user.module";
import {ApiPermissionModule} from "../auth/src/modules/api-permission/api-permission.module";
import {MongooseModule} from "@nestjs/mongoose";
import {RedisCacheModule} from "../../libs/redis/redis-cache-module";
import {EventModule} from "../event/src/modules/event/event.module";
import {MilestoneRewardModule} from "../event/src/modules/milestone-reward/milestone-reward.module";

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_USER_URI),
        MongooseModule.forRoot(process.env.MONGO_EVENT_URI, {
            connectionName: 'eventdb',
        }),
        RedisCacheModule.forRoot({
            url: process.env.REDIS_URL,
            ttl: 0,
            prefix: '',
        }),
        UserModule, ApiPermissionModule, EventModule, MilestoneRewardModule
    ],
    providers: [SeedCommand],
})
export class SeedModule {
}