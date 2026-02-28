import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
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
import { GetOldestTodoTaskUseCase } from "../../../domain/usecases/tasks/get-oldest-todo-task.usecase";

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
  private getOldestTodoTaskUseCase = inject(GetOldestTodoTaskUseCase);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  tasks: Task[] = [];
  userName = "Usuário01";
  oldestTask: Task | null = null;

  doneTasks = "0/0";
  workedTime = "0 min";
  pomodoroSessions = 0;

  weeklyProgress = 0;
  completedTasksWeekly = 0;
  focusTimeWeekly = "0h 0min";
  activeStreakWeekly = 0;
  growthWeekly = "0%";

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    const user = this.getCurrentUserUseCase.execute();
    if (user?.email) {
      this.userName = user.name || user.email.split("@")[0];
    }

    this.tasks = await this.getTasksUseCase.execute();
    this.oldestTask = await this.getOldestTodoTaskUseCase.execute();
    this.calculateMetrics();
  }

  calculateMetrics() {
    const totalTasks = this.tasks.length;
    const doneCount = this.tasks.filter((t) => t.status === "done").length;
    this.doneTasks = `${doneCount}/${totalTasks}`;

    this.workedTime = "45 min";
    this.pomodoroSessions = 2;
    this.weeklyProgress = 65;
    this.completedTasksWeekly = 15;
    this.focusTimeWeekly = "3h 45min";
    this.activeStreakWeekly = 5;
    this.growthWeekly = "+20%";
  }

  openAddTaskDialog() {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: "400px"
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.loadData();
        this.router.navigate(["/tasks"]);
      }
    });
  }
}
