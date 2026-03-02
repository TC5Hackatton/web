import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AddTaskDialogComponent } from "../../components/add-task-dialog/add-task-dialog.component";
import { GetCurrentUserUseCase } from "../../../domain/usecases/get-current-user.usecase";
import { GetStatisticsUseCase } from "../../../domain/usecases/tasks/get-statistics.usecase";
import { UserTaskStatistics } from "../../../domain/models/user-task-statistics.model";

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
  private getStatisticsUseCase = inject(GetStatisticsUseCase);
  private getCurrentUserUseCase = inject(GetCurrentUserUseCase);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  statistics: UserTaskStatistics = {
    oldestTask: null,
    progress: { completed: 0, total: 0 },
    totalFocusTime: "0 min",
    taskCounts: { todo: 0, doing: 0, done: 0, total: 0 }
  };
  userName = "Usuário01";

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    const user = this.getCurrentUserUseCase.execute();
    if (user?.email) {
      this.userName = user.name || user.email.split("@")[0];
    }

    this.statistics = await this.getStatisticsUseCase.execute();
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
