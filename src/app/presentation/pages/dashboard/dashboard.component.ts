import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { GetTasksUseCase } from "../../../domain/usecases/tasks/get-tasks.usecase";
import { Task } from "../../../domain/models/task.model";
import { RouterModule } from "@angular/router";

import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AddTaskDialogComponent } from "../../components/add-task-dialog/add-task-dialog.component";

import { GetCurrentUserUseCase } from "../../../domain/usecases/get-current-user.usecase";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatDialogModule
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss"
})
export class DashboardComponent implements OnInit {
  private getTasksUseCase = inject(GetTasksUseCase);
  private getCurrentUserUseCase = inject(GetCurrentUserUseCase);
  private dialog = inject(MatDialog);

  tasks: Task[] = [];
  userName = "Usuário";

  // Metrics
  todoCount = 0;
  doingCount = 0;
  doneCount = 0;

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    const user = this.getCurrentUserUseCase.execute();
    if (user?.email) {
      this.userName = user.email;
    }

    this.tasks = await this.getTasksUseCase.execute();
    this.calculateMetrics();
  }

  calculateMetrics() {
    this.todoCount = this.tasks.filter((t) => t.status === "todo").length;
    this.doingCount = this.tasks.filter((t) => t.status === "doing").length;
    this.doneCount = this.tasks.filter((t) => t.status === "done").length;
  }

  openAddTaskDialog() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: "400px"
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.loadData();
      }
    });
  }
}
