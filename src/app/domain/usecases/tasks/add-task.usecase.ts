import { Injectable, inject } from "@angular/core";
import { TaskStatus } from "../../models/task.model";
import { TaskRepository } from "../../repositories/task.repository";

@Injectable({
  providedIn: "root"
})
export class AddTaskUseCase {
  private taskRepository = inject(TaskRepository);

  execute(
    title: string,
    description: string,
    timeType: "cronometro" | "tempo_fixo",
    timeValue: number,
    timeSpent: number,
    status: TaskStatus = "todo"
  ): Promise<void> {
    return this.taskRepository.addTask(title, description, timeType, timeValue, timeSpent, status);
  }
}
