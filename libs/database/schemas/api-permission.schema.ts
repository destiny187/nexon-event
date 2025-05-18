import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {UserRole} from "../../shared/enums/user-enum";

@Schema({ collection: 'api_permissions', timestamps: true })
export class ApiPermission extends Document {
    @Prop({ required: true, enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] })
    method: string;

    /**
     * example
     *   /api/v1/users/:id
     *   /api/v1/events
     */
    @Prop({ required: true })
    path: string;

    @Prop({ type: [String], enum: Object.values(UserRole), default: [UserRole.USER] })
    roles: UserRole[];
}

export const ApiPermissionSchema = SchemaFactory.createForClass(ApiPermission);