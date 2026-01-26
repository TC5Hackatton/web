import { Component, inject, OnInit } from "@angular/core";
import { AuthService } from "../../../core/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  imports: [],
  templateUrl: "./signup.html",
  styleUrl: "./signup.scss"
})
export class SignupPage implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    console.log("cadastro");
  }
}
