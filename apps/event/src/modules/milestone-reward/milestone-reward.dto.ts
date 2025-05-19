import {IsInt, IsPositive, Min, IsString, IsObject, IsArray, ValidateNested} from 'class-validator';
import {PartialType} from "@nestjs/mapped-types";
import { Type } from 'class-transformer';

export class RewardItemDto {
    @IsString()
    rewardType: string;

    @IsInt()
    @IsPositive()
    amount: number;

    @IsObject()
    meta?: Record<string, string>;
}

export class CreateMilestoneRewardDto {
    @IsString()
    conditionType: string;

    @IsInt()
    @Min(1)
    value: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RewardItemDto)
    rewards: RewardItemDto[];
}

export class UpdateMilestoneRewardDto extends PartialType(CreateMilestoneRewardDto) {}