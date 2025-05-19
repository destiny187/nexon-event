import {Module} from "@nestjs/common";
import {FriendInviteChecker} from "./friend-invite.checker";
import {CheckerRegistry} from "./checker.registry";
import {ConditionChecker} from "../condition.checker.type";
import {AttendanceChecker} from "./attendance.checker";

@Module({
    imports:    [],
    providers:  [
        FriendInviteChecker,
        AttendanceChecker,
        {
            provide:  CheckerRegistry,
            useFactory: (...checkers: ConditionChecker[]) => new CheckerRegistry(checkers),
            inject:   [FriendInviteChecker, AttendanceChecker],
        },
    ],
    exports: [CheckerRegistry],
})
export class CheckerModule {}