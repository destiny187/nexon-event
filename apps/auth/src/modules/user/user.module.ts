import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {UserService} from "./user.service";
import {Invitation, InvitationSchema, User, UserSchema} from "./user.schema";
import {UserController} from "./user.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Invitation.name, schema: InvitationSchema },
        ]),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}