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
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    });
  }

  entrar() {
    signInWithEmailAndPassword(auth, "teste@teste.com", "senha123").then((value) => {
      console.log(value);
    });
  }

  fetchTasks() {
    const q = query(collection(db, "tasks"), where("uid", "==", "idUser"));

    getDocs(q).then((tasks) => {
      tasks.docs.map((t) => {
        const data = t.data();
        console.log(data);
      });
    });
  }
}
