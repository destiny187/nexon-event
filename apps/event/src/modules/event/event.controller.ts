import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {EventService} from './event.service';
import {CreateEventDto, UpdateEventDto} from "./event.dto";
import {success} from "../../../../../libs/common/utils/response.util";

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post('api/v1/events')
  async create(@Body() dto: CreateEventDto) {
    return success(await this.eventService.create(dto));
  }

  @Get('api/v1/events')
  async findAll() {
    return success(await this.eventService.findAll());
  }

  @Get('api/v1/events/:id')
  async findOne(@Param('id') id: string) {
    return success(await this.eventService.findOne(id));
  }

  @Patch('api/v1/events/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return success(await this.eventService.update(id, dto));
  }

  @Delete('api/v1/events/:id')
  async remove(@Param('id') id: string) {
    await this.eventService.remove(id);
    return success({ success: true });
  }
}
