import { Component, inject } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { MatToolbar } from "@angular/material/toolbar";
import { HorizontalLogoComponent } from "../../components/horizontal-logo/horizontal-logo";
import { AppSettingsService } from "../../services/app-settings.service";

@Component({
  selector: "app-header",
  imports: [MatIcon, MatToolbar, HorizontalLogoComponent],
  templateUrl: "./header.html",
  styleUrl: "./header.scss"
})
export class Header {
  private settingsService = inject(AppSettingsService);
  isFocusMode = false;

  toggleFocus() {
    const isFocus = this.settingsService.settings().focus.only_current;
    this.isFocusMode = !isFocus;
    this.settingsService.updateFocus({ only_current: !isFocus });
    console.log("settings", this.settingsService.settings().focus);
    console.log("isFocusMode", this.isFocusMode);
  }

  toggleDarkMode() {
    const isDark = this.settingsService.settings().appearance.dark_mode;
    this.settingsService.updateAppearance({ dark_mode: !isDark });
  }
}
