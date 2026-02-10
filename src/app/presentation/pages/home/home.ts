import { Component, inject, OnInit } from "@angular/core";
import { AuthService } from "../../../core/auth/auth.service";
import { Router, RouterOutlet } from "@angular/router";
import { Header } from "../../../shared/components/header/header";
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from "@angular/material/sidenav";
import { Drawer } from "../../../shared/components/drawer/drawer";

import { MatButtonModule } from "@angular/material/button";

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
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    console.log("home");
  }
}
