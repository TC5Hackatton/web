import { Injectable, inject } from "@angular/core";
import { Task } from "../../models/task.model";
import { TaskRepository } from "../../repositories/task.repository";

@Injectable({
  providedIn: "root"
})
export class GetOldestTodoTaskUseCase {
  private taskRepository = inject(TaskRepository);

  execute(): Promise<Task | null> {
    return this.taskRepository.getOldestTodoTask();
  }
}
