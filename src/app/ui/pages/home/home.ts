import { Component, inject, OnInit } from "@angular/core";
import { AuthService } from "../../../core/auth/auth.service";
import { Router } from "@angular/router";
import { Header } from "../../../shared/components/header/header";
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from "@angular/material/sidenav";
import { Drawer } from "../../../shared/components/drawer/drawer";
// import { TasksPage } from "../../tasks/tasks";

@Component({
  selector: "app-home",
  imports: [Header, MatDrawerContainer, Drawer, MatDrawer, MatDrawerContent],
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
