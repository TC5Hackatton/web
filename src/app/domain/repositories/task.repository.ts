import { Task, TaskStatus } from "../models/task.model";

export abstract class TaskRepository {
  abstract getTasks(): Promise<Task[]>;
  abstract addTask(
    title: string,
    description: string,
    timeType: "cronometro" | "tempo_fixo",
    timeValue: number,
    timeSpent: number,
    status?: TaskStatus,
    statusChangedAt?: Date
  ): Promise<void>;
  abstract updateTask(task: Task): Promise<void>;
  abstract getOldestTodoTask(): Promise<Task | null>;
}
