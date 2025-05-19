
export interface ConditionChecker {
    getProgress(userId: string, rangeStart: string, rangeEnd: string): Promise<number>;
}