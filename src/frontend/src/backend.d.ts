import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SubjectInput {
    difficulty: bigint;
    name: string;
    examDate: string;
}
export interface ScheduleItem {
    subject: string;
    hours: number;
    priority: string;
}
export interface backendInterface {
    generateSchedule(subjects: Array<SubjectInput>, hoursPerDay: number): Promise<Array<ScheduleItem>>;
}
