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
import { GetTasksUseCase } from "../../../domain/usecases/tasks/get-tasks.usecase";
import { UpdateTaskStatusUseCase } from "../../../domain/usecases/tasks/update-task-status.usecase";

import { Card } from "../../components/card/card";
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb";
import { Task } from "../../../domain/models/task.model";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { AddTaskDialogComponent } from "../../components/add-task-dialog/add-task-dialog.component";

@Component({
  selector: "app-tasks",
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    Card,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    BreadcrumbComponent
  ],
  templateUrl: "./tasks.html",
  styleUrl: "./tasks.scss"
})
export class TasksPage implements OnInit {
  private getTasksUseCase = inject(GetTasksUseCase);
  private updateTaskStatusUseCase = inject(UpdateTaskStatusUseCase);

  private dialog = inject(MatDialog);

  todo = signal<Task[]>([]);
  doing = signal<Task[]>([]);
  done = signal<Task[]>([]);
  tasks: Task[] = [];
  newTaskTitle = "";

  ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    const tasks = await this.getTasksUseCase.execute();
    this.todo.set(tasks.filter((t) => t.status === "todo"));
    this.doing.set(tasks.filter((t) => t.status === "doing"));
    this.done.set(tasks.filter((t) => t.status === "done"));
  }

  openAddTaskDialog() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: "400px"
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.loadTasks();
      }
    });
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
        this.updateTaskStatusUseCase.execute(task.id, newStatus);
      }
    }
  }
}
