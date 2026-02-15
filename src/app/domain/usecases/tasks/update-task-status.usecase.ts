import { Injectable, inject } from "@angular/core";
import { TaskStatus } from "../../models/task.model";
import { TaskRepository } from "../../repositories/task.repository";

@Injectable({
  providedIn: "root"
})
export class UpdateTaskStatusUseCase {
  private taskRepository = inject(TaskRepository);

  execute(taskId: string, newStatus: TaskStatus): Promise<void> {
    return this.taskRepository.updateTaskStatus(taskId, newStatus);
  }
}
