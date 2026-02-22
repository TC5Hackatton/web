import { Component, inject } from "@angular/core";
import { MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { AddTaskUseCase } from "../../../domain/usecases/tasks/add-task.usecase";

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
  styleUrl: "./add-task-dialog.component.scss" // Optional, can be empty
})
export class AddTaskDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);
  private addTaskUseCase = inject(AddTaskUseCase);

  taskTitle = "";
  taskDescription = "";
  timeType: "cronometro" | "tempo_fixo" = "cronometro";
  timeSpent = 0;

  async onAdd(): Promise<void> {
    if (!this.taskTitle.trim()) return;

    try {
      await this.addTaskUseCase.execute(
        this.taskTitle,
        this.taskDescription,
        this.timeType,
        this.timeSpent,
        "todo"
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
