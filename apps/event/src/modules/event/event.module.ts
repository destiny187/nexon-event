import {Module} from '@nestjs/common';
import {EventController} from './event.controller';
import {EventService} from './event.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Event, EventSchema} from "./event.schema";

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: Event.name, schema: EventSchema },
      ], 'eventdb'),
    ],
    controllers: [EventController],
    providers: [EventService],
    exports: [MongooseModule, EventService],
})
export class EventModule {
}
