import {Document, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {UserRole, UserStatus} from "../../../../../libs/shared/enums/user-enum";
import * as bcrypt from 'bcrypt';
import {nanoid} from 'nanoid';

@Schema({collection: 'users', timestamps: true})
export class User extends Document {
    @Prop({required: true, maxlength: 50})
    nickname: string;

    @Prop({required: true, select: false})
    password: string;

    @Prop({required: true, unique: true})
    email: string

    @Prop({required: true, unique: true})
    referralCode: string;

    @Prop({type: String, enum: UserStatus, default: UserStatus.Active})
    status: UserStatus;

    @Prop({type: [String], enum: UserRole, default: [UserRole.USER]})
    roles: UserRole[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('validate', async function (next) {
    this.referralCode = nanoid(12);
    next();
});

UserSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);

    next();
});

@Schema({collection: 'invitations', timestamps: true})
export class Invitation extends Document {
    @Prop({type: Types.ObjectId, ref: 'User', required: true, index: true})
    inviterId: Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'User', required: true, index: true})
    inviteeId: Types.ObjectId;

    //If there is an invitation condition, change it.
    @Prop({enum: ['PENDING', 'ACCEPTED'], default: 'ACCEPTED'})
    status: 'PENDING' | 'ACCEPTED';

    @Prop() acceptedAt?: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
InvitationSchema.index({inviterId: 1, status: 1, createdAt: 1});