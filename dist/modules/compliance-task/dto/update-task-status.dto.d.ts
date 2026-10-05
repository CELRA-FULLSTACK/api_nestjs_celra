import { TaskStatus } from '../../../configs/constants.js';
export declare class UpdateTaskStatusDto {
    status: TaskStatus;
    completion_note?: string;
}
