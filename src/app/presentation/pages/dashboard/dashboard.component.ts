import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TaskService } from "../../../core/services/task.service";
import { Task } from "../../../core/models/task.model";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss"
})
export class DashboardComponent implements OnInit {
  private taskService = inject(TaskService);

  tasks: Task[] = [];
  userName = "Usuário01"; // Idealmente viria do AuthService

  // Metrics
  todoCount = 0;
  doingCount = 0;
  doneCount = 0;

  async ngOnInit() {
    this.tasks = await this.taskService.getTasks();
    this.calculateMetrics();
  }

  calculateMetrics() {
    this.todoCount = this.tasks.filter((t) => t.status === "todo").length;
    this.doingCount = this.tasks.filter((t) => t.status === "doing").length;
    this.doneCount = this.tasks.filter((t) => t.status === "done").length;
  }
}
