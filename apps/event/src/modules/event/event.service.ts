import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CreateEventDto, UpdateEventDto} from './event.dto';
import {EventDocument} from "./event.schema";

@Injectable()
export class EventService {
    constructor(
        @InjectModel(Event.name, 'eventdb') private readonly eventModel: Model<EventDocument>,
    ) {
    }

    async create(dto: CreateEventDto): Promise<EventDocument> {
        return (await this.eventModel.create(dto)).toObject();
    }

    async findAll(): Promise<EventDocument[]> {
        return this.eventModel.find();
    }

    async findOne(id: string): Promise<EventDocument> {
        const doc = await this.eventModel.findById(id);
        if (!doc) throw new NotFoundException();
        return doc;
    }

    async update(id: string, dto: UpdateEventDto): Promise<EventDocument> {
        const updated = await this.eventModel.findByIdAndUpdate(id, dto, {new: true});
        if (!updated) throw new NotFoundException();
        return updated;
    }

    async remove(id: string): Promise<void> {
        const res = await this.eventModel.findByIdAndDelete(id);
        if (!res) throw new NotFoundException();
    }
}