import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';


export type EventDocument = Event & Document;

@Schema({collection: 'events', timestamps: true})
export class Event extends Document {
    @Prop({required: true, maxlength: 100})
    title: string;

    @Prop({maxlength: 255})
    description?: string;

    @Prop({required: true, enum: ['ACTIVE', 'INACTIVE'], default: 'INACTIVE'})
    status: 'ACTIVE' | 'INACTIVE';

    @Prop({type: Date, required: true})
    startAt: Date;

    @Prop({type: Date, required: true})
    endAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);