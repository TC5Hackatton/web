import { Component, inject, OnInit } from "@angular/core";
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
import { SignInUseCase } from "../../../domain/usecases/sign-in.usecase";
import { User } from "../../../domain/models/user.model";

@Component({
  selector: "app-login",
  standalone: true,
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
  private formBuilder = inject(FormBuilder);
  private signInUseCase = inject(SignInUseCase);
  private router = inject(Router);

  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    });
  }

  entrar() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.signInUseCase.execute(email, password).subscribe({
      next: (user: User) => {
        console.log("Login realizado com sucesso", user);
        this.router.navigate(["/"]);
      },
      error: (err: Error) => {
        console.error("Erro ao fazer login:", err);
        alert("Erro ao fazer login: " + err.message);
      }
    });
  }

  goToSignup() {
    this.router.navigate(["/signup"]);
  }
}
