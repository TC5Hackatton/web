import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from "@angular/material/sidenav";

import { MatButtonModule } from "@angular/material/button";
import { Header } from "../../layouts/header/header";
import { Drawer } from "../../layouts/drawer/drawer";
import { AppSettingsService } from "../../services/app-settings.service";

@Component({
  selector: "app-home",
  imports: [
    Header,
    MatDrawerContainer,
    Drawer,
    MatDrawer,
    MatDrawerContent,
    RouterOutlet,
    MatButtonModule
  ],
  templateUrl: "./home.html",
  styleUrls: ["./home.scss"]
})
export class HomePage implements OnInit {
  private settingsService = inject(AppSettingsService);

  focusMode = this.settingsService.focusSettings;

  ngOnInit() {
    console.log("home");
  }
}
