import { Injectable, inject } from "@angular/core";
import { Task, TaskStatus } from "../../models/task.model";
import { TaskRepository } from "../../repositories/task.repository";

@Injectable({
  providedIn: "root"
})
export class UpdateTaskStatusUseCase {
  private taskRepository = inject(TaskRepository);

  async execute(task: Task, newStatus: TaskStatus): Promise<void> {
    let timeSpend = task.timeSpend;
    let statusChangedAt: Date | undefined = undefined;

    if (task.status === "doing" && task.statusChangedAt) {
      const now = new Date();
      const elapsedMs = now.getTime() - task.statusChangedAt.getTime();
      const elapsedMinutes = elapsedMs / (1000 * 60);
      timeSpend = Number((timeSpend + elapsedMinutes).toFixed(2));
    }

    if (newStatus === "doing") {
      statusChangedAt = new Date();
    }

    const updatedTask = task.copyWith({
      status: newStatus,
      timeSpend,
      statusChangedAt
    });

    return this.taskRepository.updateTask(updatedTask);
  }
}
