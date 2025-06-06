export const EScheduleType = {
    ONCE: "ONCE",
    RECURRING: "RECURRING"
} as const;

export type EScheduleType = typeof EScheduleType[keyof typeof EScheduleType];
export interface ISchedule {
    id: string;
    testPlanId: string;
    testPlanTitle?: string;
    name: string;
    type: EScheduleType;
    executionTime?: string;
    cronExpression?: string;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
    lastRunTime?: string;
    nextRunTime?: string;
    description?: string;
}

export interface IRequestCreateSchedule {
    testPlanId: string;
    name: string;
    type: EScheduleType;
    executionTime?: string;
    cronExpression?: string;
    description?: string;
}

export interface IResponseSchedule {
    meta: IMeta;
    result: ISchedule[];
}
export interface IRequestEditSchedule {
    id: string;
    testPlanId: string;
    name: string;
    type: EScheduleType;
    executionTime?: string;
    cronExpression?: string;
    description?: string;
}