import { inject, Injectable } from "@angular/core";
import { TaskRepository } from "../../repositories/task.repository";
import { UserTaskStatistics } from "../../models/user-task-statistics.model";

@Injectable({
  providedIn: "root"
})
export class GetStatisticsUseCase {
  private taskRepository = inject(TaskRepository);

  async execute(): Promise<UserTaskStatistics> {
    const tasks = await this.taskRepository.getTasks();

    // Oldest TODO task
    const todoTasks = tasks
      .filter((t) => t.status === "todo")
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const oldestTask = todoTasks[0] ?? null;

    // Progress & task counts
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const doing = tasks.filter((t) => t.status === "doing").length;
    const todo = todoTasks.length;

    // Focus time
    const totalMinutes = tasks.reduce((acc, task) => acc + (task.timeSpend || 0), 0);
    const roundedMinutes = Math.round(totalMinutes);

    let totalFocusTime: string;
    if (roundedMinutes < 60) {
      totalFocusTime = `${roundedMinutes} min`;
    } else {
      const hours = Math.floor(roundedMinutes / 60);
      const minutes = roundedMinutes % 60;
      totalFocusTime = minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }

    return {
      oldestTask,
      progress: { completed: done, total },
      totalFocusTime,
      taskCounts: { todo, doing, done, total }
    };
  }
}
