import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {UserModule} from "./modules/user/user.module";
import {APP_FILTER} from "@nestjs/core";
import {AllExceptionsFilter} from "../../../libs/common/filters/exception.filter";
import * as path from "path";
import {AuthModule} from "./modules/auth/auth.module";
import {ApiPermissionModule} from "./modules/api-permission/api-permission.module";
import {RedisCacheModule} from "../../../libs/redis/redis-cache-module";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: path.resolve(process.cwd(), 'apps/auth/.env')}),
        MongooseModule.forRoot(process.env.MONGO_URI),
        RedisCacheModule.forRoot({
            url: process.env.REDIS_URL,
            ttl: 0,
        }),
        UserModule,
        AuthModule,
        ApiPermissionModule,
    ],
    providers: [
        // {provide: APP_INTERCEPTOR, useClass: TransformInterceptor},
        {provide: APP_FILTER, useClass: AllExceptionsFilter},
    ]
})
export class AppModule {
}