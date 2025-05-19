import {ConditionType} from "../../../../../../libs/shared/enums/event-enum";
import {Injectable} from "@nestjs/common";
import {ConditionChecker} from "../condition.checker.type";

@Injectable()
export class CheckerRegistry {
    private readonly checker = new Map<ConditionType, ConditionChecker>();

    constructor(checkers: ConditionChecker[]) {
        for (const c of checkers) this.checker.set(c['condition'], c);
    }

    get(type: ConditionType): ConditionChecker {
        const checker = this.checker.get(type);
        if (!checker) throw new Error('Checker not found');
        return checker;
    }
}