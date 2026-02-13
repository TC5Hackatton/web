import { Component, inject, OnInit } from "@angular/core";
import { AuthStateUtil } from "../../../infrastructure/utils/auth-state.util";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  imports: [],
  templateUrl: "./signup.html",
  styleUrl: "./signup.scss"
})
export class SignupPage implements OnInit {
  authService = inject(AuthStateUtil);
  router = inject(Router);

  ngOnInit() {
    console.log("cadastro");
  }
}
