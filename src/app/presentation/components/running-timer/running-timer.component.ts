import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from "@angular/core";
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
        font-size: 0.75rem;
        font-weight: bold;
        color: var(--settings-text-subtitle);
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      }
    `
  ]
})
export class RunningTimerComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ required: true }) task!: Task;

  minutes = 0;
  secondsStr = "00";

  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["task"] && !changes["task"].firstChange) {
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer(): void {
    this.stopTimer();

    if (this.task.status !== "doing" || !this.task.statusChangedAt) return;

    this.updateElapsed();

    this.intervalId = setInterval(() => {
      this.updateElapsed();
    }, 1000);
  }

  private stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
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
