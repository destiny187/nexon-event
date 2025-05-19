import {IsDateString, IsEnum, IsOptional, IsString, MaxLength} from 'class-validator';
import {PartialType} from '@nestjs/mapped-types';

export class CreateEventDto {
    @IsString() @MaxLength(100)
    title: string;

    @IsOptional() @IsString() @MaxLength(255)
    description?: string;

    @IsDateString()
    startAt: string;

    @IsDateString()
    endAt: string;

    @IsOptional() @IsEnum(['ACTIVE', 'INACTIVE'])
    status?: 'ACTIVE' | 'INACTIVE';
}

export class UpdateEventDto extends PartialType(CreateEventDto) {
}