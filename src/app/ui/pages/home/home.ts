import { Component, inject, OnInit } from "@angular/core";
import { AuthService } from "../../../core/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  imports: [],
  templateUrl: "./home.html"
})
export class HomePage implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    console.log("home");
  }
}
