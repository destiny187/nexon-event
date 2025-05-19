import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from "path";
import {APP_FILTER} from "@nestjs/core";
import {AllExceptionsFilter} from "../../../libs/common/filters/exception.filter";
import {ProxyModule} from "./modules/proxy/proxy.module";
import {JwtModule} from "../../../libs/common/jwt/jwt.module";
import {RedisCacheModule} from "../../../libs/redis/redis-cache-module";


@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: path.resolve(process.cwd(), 'apps/gateway/.env')}),
        MongooseModule.forRoot(process.env.MONGO_URI),
        RedisCacheModule.forRoot({
            url: process.env.REDIS_URL,
            ttl: 0,
        }),
        JwtModule,
        ProxyModule,
    ],
    providers: [
        {provide: APP_FILTER, useClass: AllExceptionsFilter},
    ]
})
export class AppModule {}