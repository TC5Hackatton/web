import { Component, inject, OnInit } from "@angular/core";
import { AuthStateUtil } from "../../../infrastructure/utils/auth-state.util";
import { Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { VerticalLogoComponent } from "../../../presentation/components/vertical-logo/vertical-logo";
import { Card } from "../../../presentation/components/card/card";
import { MatButtonModule } from "@angular/material/button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../infrastructure/config/firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { User } from "../../../core/interfaces/user";

@Component({
  selector: "app-login",
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    VerticalLogoComponent,
    MatButtonModule,
    Card
  ],
  templateUrl: "./login.html",
  styleUrl: "./login.scss"
})
export class LoginPage implements OnInit {
  formBuilder = inject(FormBuilder);
  _authService = inject(AuthStateUtil);
  router = inject(Router);

  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["teste@teste.com", [Validators.required, Validators.email]],
      password: ["senha123", Validators.required]
    });
  }

  entrar() {
    if (this.loginForm.invalid) return;

    this._authService.login(this.email?.value, this.password?.value).subscribe({
      next: (user: User) => {
        console.log(user, "login");
        this.router.navigate(["/home"]);
      },
      error: (e) => {
        console.log(e.code);
      }
    });
  }

  forgotPassword() {
    console.log("implentar futuramente");
  }

  goToSignup() {
    this.router.navigate(["/signup"]);
  }

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }
}
