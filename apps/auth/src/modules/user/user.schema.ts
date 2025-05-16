import {Document} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {UserStatus} from "../../common/enums/user-enum";
import * as bcrypt from 'bcrypt';

@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
    @Prop({ required: true, maxlength: 50})
    nickname: string;

    @Prop({ required: true, select: false })
    password: string;

    @Prop({ required: true, unique: true })
    email: string

    @Prop({
        type: String,
        enum: UserStatus,
        default: UserStatus.Active,
    })
    status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});