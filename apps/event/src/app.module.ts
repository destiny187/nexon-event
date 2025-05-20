import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import * as path from "path";
import {EventModule} from "./modules/event/event.module";
import {MilestoneRewardModule} from "./modules/milestone-reward/milestone-reward.module";
import {RewardClaimModule} from "./modules/reward-claim/reward-claim.module";
import {CheckerModule} from "./modules/reward-claim/condition/checker.module";
import {APP_FILTER} from "@nestjs/core";
import {AllExceptionsFilter} from "../../../libs/common/filters/exception.filter";
import {JwtModule} from "../../../libs/common/jwt/jwt.module";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: path.resolve(process.cwd(), 'apps/event/.env')}),
        MongooseModule.forRoot(process.env.MONGO_URI, { connectionName: 'eventdb' }),
        JwtModule,
        MilestoneRewardModule,
        CheckerModule,
        RewardClaimModule,
        EventModule,
    ],
    providers: [
        {provide: APP_FILTER, useClass: AllExceptionsFilter},
    ]
})
export class AppModule {
}