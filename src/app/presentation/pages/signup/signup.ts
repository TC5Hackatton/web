import { Component, inject, OnInit } from "@angular/core";
import { AuthStateUtil } from "../../../infrastructure/utils/auth-state.util";
import { Router } from "@angular/router";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { Card } from "../../components/card/card";
import { MatButtonModule } from "@angular/material/button";
import { VerticalLogoComponent } from "../../components/vertical-logo/vertical-logo";

@Component({
  selector: "app-signup",
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    VerticalLogoComponent,
    MatButtonModule,
    Card
  ],
  templateUrl: "./signup.html",
  styleUrl: "./signup.scss"
})
export class SignupPage implements OnInit {
  authService = inject(AuthStateUtil);
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  ngOnInit() {
    this.signupForm = this.formBuilder.group(
      {
        email: ["teste@teste.com", [Validators.required, Validators.email]],
        password: ["senha123", Validators.required],
        repeatPassword: ["senha123", Validators.required]
      },
      {
        validators: passwordMatchValidator("password", "repeatPassword")
      }
    );
  }

  signup() {
    if (this.signupForm.invalid) {
      console.log(this.signupForm);
      return;
    }

    this.authService.login(this.email?.value, this.password?.value).subscribe({
      next: (user: User) => {
        console.log(user, "login");
        this.router.navigate(["/home"]);
      },
      error: (e) => {
        console.log(e.code);
      }
    });
  }

  cancel() {
    this.router.navigate(["/login"]);
  }

  get email() {
    return this.signupForm.get("email");
  }

  get password() {
    return this.signupForm.get("password");
  }

  get repeatPassword() {
    return this.signupForm.get("repeatPassword");
  }
}
