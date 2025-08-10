/**
 * Represents a single task in the task list.
 */
export interface Task {
    /** Unique ID for the task (set by backend) */
    id:number;
     /** The text/description of the task */
    task: string;
     /** Whether the task is marked as completed */
    checked:boolean;     
}
