import { Task, TaskStatus } from "../models/task.model";

export abstract class TaskRepository {
  abstract getTasks(): Promise<Task[]>;
  abstract addTask(
    title: string,
    description: string,
    timeType: "cronometro" | "tempo_fixo",
    timeSpent: number,
    status?: TaskStatus
  ): Promise<void>;
  abstract updateTaskStatus(taskId: string, newStatus: TaskStatus): Promise<void>;
}
