import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Task } from "../../../domain/models/task.model";

@Component({
  selector: "app-running-timer",
  standalone: true,
  imports: [CommonModule],
  template: `<span class="timer-text">{{ minutes }}m {{ secondsStr }}s</span>`,
  styles: [
    `
      .timer-text {
        font-size: 11px;
        font-weight: bold;
        color: var(--settings-text-subtitle);
      }
    `
  ]
})
export class RunningTimerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) task!: Task;

  minutes = 0;
  secondsStr = "00";

  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    if (this.task.status !== "doing" || !this.task.statusChangedAt) return;

    this.updateElapsed();

    this.intervalId = setInterval(() => {
      this.updateElapsed();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateElapsed(): void {
    if (!this.task.statusChangedAt) return;

    const now = new Date();
    const diffMs = now.getTime() - this.task.statusChangedAt.getTime();
    const totalMinutes = diffMs / (1000 * 60);
    //const currentSessionMinutes = diffMs / (1000 * 60); Se for para calcular o tempo total ao reiniciar a sessão
    //const totalMinutes = (this.task.timeSpend || 0) + currentSessionMinutes;

    this.minutes = Math.floor(totalMinutes);
    const secs = Math.floor((totalMinutes - this.minutes) * 60);
    this.secondsStr = secs.toString().padStart(2, "0");
  }
}
