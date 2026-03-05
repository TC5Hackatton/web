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
import { AppSettingsService } from "../../services/app-settings.service";

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
  private settingsService = inject(AppSettingsService);

  loginForm!: FormGroup;
  focusMode = this.settingsService.focusSettings;

  // ngOnInit() {
  //   this.loginForm = this.formBuilder.group({
  //     email: ["k@teste.com", [Validators.required, Validators.email]],
  //     password: ["kaue123", Validators.required]
  //   });
  // }

  // ngAfterViewInit(): void {
  //   this.entrar();
  // }
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

        if (this.focusMode().only_current) {
          this.router.navigate(["/focus-mode"]);
          return;
        }
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
