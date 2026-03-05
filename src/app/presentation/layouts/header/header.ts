import { Component, inject, OnInit, signal } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { MatToolbar } from "@angular/material/toolbar";
import { HorizontalLogoComponent } from "../../components/horizontal-logo/horizontal-logo";
import { AppSettingsService } from "../../services/app-settings.service";
import { Router, NavigationEnd } from "@angular/router";
import { Task } from "../../../domain/models/task.model";
import { GetTasksUseCase } from "../../../domain/usecases/tasks/get-tasks.usecase";

@Component({
  selector: "app-header",
  imports: [MatIcon, MatToolbar, HorizontalLogoComponent],
  templateUrl: "./header.html",
  styleUrl: "./header.scss"
})
export class Header implements OnInit {
  private settingsService = inject(AppSettingsService);
  private getTasksUseCase = inject(GetTasksUseCase);
  router = inject(Router);

  doing = signal<Task[]>([]);

  focusMode = this.settingsService.focusSettings;

  ngOnInit(): void {
    // if the user navigates between pages, update icon state based on route
    this.router.events.subscribe((event) => {
      // only care about when navigation finished
      if (event instanceof NavigationEnd) {
        // this.isFocusMode = event.urlAfterRedirects.includes("/focus-mode");
      }
    });

    this.loadTasks().then((value) => {
      console.log(value);
      console.log(this.doing());
    });
  }

  toggleFocus() {
    const isFocus = this.focusMode().only_current;
    this.settingsService.updateFocus({ only_current: !isFocus });

    const currentUrl = this.router.url;
    if (currentUrl.includes("/focus-mode")) {
      this.router.navigate(["/dashboard"]);
    } else {
      this.router.navigate(["/focus-mode"]);
    }
  }

  toggleDarkMode() {
    const isDark = this.settingsService.settings().appearance.dark_mode;
    this.settingsService.updateAppearance({ dark_mode: !isDark });
  }

  async loadTasks() {
    const tasks = await this.getTasksUseCase.execute();
    this.doing.set(tasks.filter((t) => t.status === "doing"));
  }
}
