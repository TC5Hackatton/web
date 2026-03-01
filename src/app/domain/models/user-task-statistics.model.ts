import { Task } from "./task.model";

export interface UserTaskStatistics {
  oldestTask: Task | null;
  progress: { completed: number; total: number };
  totalFocusTime: string;
  taskCounts: { todo: number; doing: number; done: number; total: number };
}
