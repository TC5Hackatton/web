import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { TaskService } from "../../../core/services/task.service";
import { Card } from "../../../shared/components/card/card";
import { Task } from "../../../core/models/task.model";

@Component({
  selector: "app-tasks",
  standalone: true,
  imports: [CommonModule, DragDropModule, MatButtonModule, MatIconModule, MatCardModule, Card],
  templateUrl: "./tasks.html",
  styleUrl: "./tasks.scss"
})
export class TasksPage implements OnInit {
  private taskService = inject(TaskService);

  todo = signal<Task[]>([]);
  doing = signal<Task[]>([]);
  done = signal<Task[]>([]);

  ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    const tasks = await this.taskService.getTasks();

    this.todo.set(tasks.filter((t) => t.status === "todo"));
    this.doing.set(tasks.filter((t) => t.status === "doing"));
    this.done.set(tasks.filter((t) => t.status === "done"));
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const task = event.container.data[event.currentIndex];
      const newStatus = event.container.id as "todo" | "doing" | "done";

      if (task.id) {
        this.taskService.updateTaskStatus(task.id, newStatus);
      }
    }
  }
}
