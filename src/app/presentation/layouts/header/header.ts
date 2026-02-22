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
  isInputMode = true;

  toggleArrow() {
    this.isInputMode = !this.isInputMode;
  }

  toggleDarkMode() {
    const isDark = this.settingsService.settings().appearance.dark_mode;
    this.settingsService.updateAppearance({ dark_mode: !isDark });
  }
}
