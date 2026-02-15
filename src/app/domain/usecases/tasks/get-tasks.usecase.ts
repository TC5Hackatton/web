import { Injectable, inject } from "@angular/core";
import { Task } from "../../models/task.model";
import { TaskRepository } from "../../repositories/task.repository";

@Injectable({
  providedIn: "root"
})
export class GetTasksUseCase {
  private taskRepository = inject(TaskRepository);

  execute(): Promise<Task[]> {
    return this.taskRepository.getTasks();
  }
}
