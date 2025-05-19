import {ConditionChecker} from "../condition.checker.type";
import {Injectable} from "@nestjs/common";
import {Types} from "mongoose";
import {ConditionType} from "../../../../../../libs/shared/enums/event-enum";
import {ConfigService} from "@nestjs/config";
import axios from "axios";

@Injectable()
export class AttendanceChecker implements ConditionChecker {
    readonly condition = ConditionType.ATTENDANCE;

    constructor(
        private readonly configService: ConfigService,
    ) {}

    async getProgress(userId: string, rangeStart: string, rangeEnd: string) {
        //Add logic
        return 0;
    }
}