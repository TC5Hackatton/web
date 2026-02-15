import { Component, inject, OnInit } from "@angular/core";
import { AuthStateUtil } from "../../../infrastructure/utils/auth-state.util";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Card } from "../../components/card/card";
import { MatButtonModule } from "@angular/material/button";
import { passwordMatchValidator } from "../../validators/password-match.validator";
import { SignUpUseCase } from "../../../domain/usecases/sign-up.usecase";
import { VerticalLogoComponent } from "../../components/vertical-logo/vertical-logo";

@Component({
  selector: "app-signup",
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    Card,
    VerticalLogoComponent
],
  templateUrl: "./signup.html",
  styleUrl: "./signup.scss"
})
export class SignupPage implements OnInit {
  authService = inject(AuthStateUtil);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  signUpUseCase = inject(SignUpUseCase);

  signupForm!: FormGroup;

  ngOnInit() {
    this.signupForm = this.formBuilder.group(
      {
        // name: ["", [Validators.required, Validators.minLength(3)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", Validators.required],
        repeatPassword: ["", Validators.required]
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

    const { email, password } = this.signupForm.getRawValue();
    // const { name, email, password } = this.signupForm.getRawValue();

    this.signUpUseCase.execute("", email, password).subscribe({
      next: () => {
        this.router.navigate(["/"]);
      },
      error: (error: unknown) => {
        console.error("Erro ao cadastrar usuário:", error);
      }
    });
  }

  cancel() {
    this.router.navigate(["/login"]);
  }

  /* get name() {
    return this.signupForm.get("name");
  } */

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
