import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {ProxyModule} from "./modules/proxy/proxy.module";
import * as path from "path";
import {APP_FILTER, APP_INTERCEPTOR} from "@nestjs/core";
import {TransformInterceptor} from "../../../libs/common/interceptors/transform.interceptor";
import {AllExceptionsFilter} from "../../../libs/common/filters/exception.filter";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: path.resolve(process.cwd(), 'apps/gateway/.env')}),
        MongooseModule.forRoot(process.env.MONGO_URI),
        ProxyModule,
    ],
    providers: [
        {provide: APP_INTERCEPTOR, useClass: TransformInterceptor},
        {provide: APP_FILTER, useClass: AllExceptionsFilter},
    ]
})
export class AppModule {}