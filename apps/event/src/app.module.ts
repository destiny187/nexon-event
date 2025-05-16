import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from "path";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: path.resolve(process.cwd(), 'apps/event/.env')}),
        MongooseModule.forRoot(process.env.MONGO_URI),
    ],
})
export class AppModule {}