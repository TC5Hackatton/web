import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleChange, MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatButtonToggleChange, MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatButtonModule } from "@angular/material/button";
import { AppSettingsService } from "../../services/app-settings.service";
import { FontSize } from "../../../domain/models/user-settings.model";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatButtonModule
  ],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.scss"
})
export class SettingsComponent {
  public settingsService = inject(AppSettingsService);

  // Appearance
  toggleDarkMode(event: MatSlideToggleChange) {
    this.settingsService.updateAppearance({ dark_mode: event.checked });
  }

  toggleHighContrast(event: MatSlideToggleChange) {
    this.settingsService.updateAppearance({ high_contrast: event.checked });
  }

  changeFontSize(event: MatButtonToggleChange) {
    this.settingsService.updateAppearance({ font_size: event.value as FontSize });
  }

  // Timer / Productivity
  changePomodoroTime(event: MatButtonToggleChange) {
    this.settingsService.updateTimer({ amount_default: parseInt(event.value, 10) });
  }

  togglePauseReminder(event: MatSlideToggleChange) {
    this.settingsService.updateTimer({ pause_reminder: event.checked });
  }

  // Notifications
  toggleSound(event: MatSlideToggleChange) {
    this.settingsService.updateNotifications({ sound_on: event.checked });
  }

  // Accessibility
  toggleAnimationsDecreased(event: MatSlideToggleChange) {
    this.settingsService.updateAccessibility({ animations_decreased: event.checked });
  }

  toggleSimplifiedMode(event: MatSlideToggleChange) {
    this.settingsService.updateAccessibility({ simplified_mode: event.checked });
  }

  // Focus
  toggleHideDone(event: MatSlideToggleChange) {
    this.settingsService.updateFocus({ hide_done: event.checked });
  }

  toggleOnlyCurrent(event: MatSlideToggleChange) {
    this.settingsService.updateFocus({ only_current: event.checked });
  }
}
