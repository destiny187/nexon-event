import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {UserModule} from "./modules/user/user.module";
import {APP_FILTER, APP_INTERCEPTOR} from "@nestjs/core";
import {TransformInterceptor} from "../../../libs/common/interceptors/transform.interceptor";
import {AllExceptionsFilter} from "../../../libs/common/filters/exception.filter";
import * as path from "path";
import {User, UserSchema} from "./modules/user/user.schema";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: path.resolve(process.cwd(), 'apps/auth/.env')}),
        MongooseModule.forRoot(process.env.MONGO_URI),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        UserModule,
    ],
    providers: [
        {provide: APP_INTERCEPTOR, useClass: TransformInterceptor},
        {provide: APP_FILTER, useClass: AllExceptionsFilter},
    ]
})
export class AppModule {
}