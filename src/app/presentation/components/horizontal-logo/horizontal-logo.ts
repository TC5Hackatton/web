import { Component, Input, inject, computed } from "@angular/core";
import { AppSettingsService } from "../../services/app-settings.service";

@Component({
  selector: "app-horizontal-logo",
  standalone: true,
  templateUrl: "./horizontal-logo.html"
})
export class HorizontalLogoComponent {
  @Input() width = "auto";

  private settingsService = inject(AppSettingsService);

  logoSrc = computed(() => {
    const isDark = this.settingsService.settings().appearance.dark_mode;
    return isDark ? "MindEase_horizontal_modoEscuro.svg" : "MindEase_horizontal.svg";
  });
}
