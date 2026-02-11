import { Component, inject, OnInit } from "@angular/core";
import { AuthService } from "../../../core/auth/auth.service";
import { Router, RouterOutlet } from "@angular/router";
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from "@angular/material/sidenav";

import { MatButtonModule } from "@angular/material/button";
import { Header } from "../../layouts/header/header";
import { Drawer } from "../../layouts/drawer/drawer";

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
