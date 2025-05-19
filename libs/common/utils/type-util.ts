import {Types} from "mongoose";
import {BadRequestException} from "@nestjs/common";


export function toObjectId(value: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
        throw new BadRequestException(`Invalid ObjectId: ${value}`);
    }
    return new Types.ObjectId(value);
}