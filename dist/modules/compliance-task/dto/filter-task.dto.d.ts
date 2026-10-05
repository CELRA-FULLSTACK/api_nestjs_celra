import { SeverityLevel, TaskStatus } from '../../../configs/constants.js';
export declare class FilterTaskDto {
    status?: TaskStatus;
    severity?: SeverityLevel;
    assigned_to?: number;
    search?: string;
}
