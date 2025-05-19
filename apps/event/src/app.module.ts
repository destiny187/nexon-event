import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from "path";
import {EventModule} from "./modules/event/event.module";
import {MilestoneRewardModule} from "./modules/milestone-reward/milestone-reward.module";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: path.resolve(process.cwd(), 'apps/event/.env')}),
        MongooseModule.forRoot(process.env.MONGO_URI),
        EventModule,
        MilestoneRewardModule,
    ],
})
export class AppModule {}