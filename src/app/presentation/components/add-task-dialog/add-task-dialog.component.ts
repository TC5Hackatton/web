import { Component, inject, computed } from "@angular/core";
import { MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { AddTaskUseCase } from "../../../domain/usecases/tasks/add-task.usecase";
import { AppSettingsService } from "../../services/app-settings.service";

@Component({
  selector: "app-add-task-dialog",
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: "./add-task-dialog.component.html",
  styleUrl: "./add-task-dialog.component.scss"
})
export class AddTaskDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);
  private addTaskUseCase = inject(AddTaskUseCase);
  public settingsService = inject(AppSettingsService);

  readonly pomodoroOptions = [15, 25, 35, 45];

  taskTitle = "";
  taskDescription = "";
  timeType: "cronometro" | "tempo_fixo" = "cronometro";

  defaultPomodoroTime = computed(() => this.settingsService.settings().timer.amount_default ?? 25);

  timeValue = this.defaultPomodoroTime();

  async onAdd(): Promise<void> {
    if (!this.taskTitle.trim()) return;

    try {
      // Se definido como true, toda nova tarefa iniciará como 'A Fazer' (status 'todo')
      const alwaysStartAsTodo = false;

      const status = this.timeType === "cronometro" && !alwaysStartAsTodo ? "doing" : "todo";
      const statusChangedAt = status === "doing" ? new Date() : undefined;

      await this.addTaskUseCase.execute(
        this.taskTitle,
        this.taskDescription,
        this.timeType,
        this.timeType === "tempo_fixo" ? this.timeValue : 0,
        0,
        status,
        statusChangedAt
      );
      this.dialogRef.close(true);
    } catch (error) {
      console.error("Error adding task", error);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
