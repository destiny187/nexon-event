import {ConditionChecker} from "../condition.checker.type";
import {Injectable} from "@nestjs/common";
import {ConditionType} from "../../../../../../libs/shared/enums/event-enum";
import {ConfigService} from "@nestjs/config";
import axios from "axios";

@Injectable()
export class FriendInviteChecker implements ConditionChecker {
    readonly condition = ConditionType.INVITE_FRIEND;

    constructor(
        private readonly configService: ConfigService,
    ) {}

    async getProgress(userId: string, rangeStart: string, rangeEnd: string) {
        const result = await axios.get(
            `${this.configService.get('AUTH_URL')}/api/v1/users/${userId}/invitations/invite-count?rangeStart=${rangeStart}&rangeEnd=${rangeEnd}`,
            {
                headers: {
                    'x-internal': 'true',
                }
            }
        ).then(response => {
            return response.data;
        });

        return result.count;
    }
}