import { Routes } from "@angular/router";
import { SignupPage } from "./ui/pages/signup/signup";
import { authGuard } from "./core/auth/auth.guard";
import { HomePage } from "./ui/pages/home/home";

export const routes: Routes = [
  {
    path: "signup",
    loadComponent: () => SignupPage
  },
  {
    path: "",
    canActivate: [authGuard],
    loadComponent: () => HomePage
  }
];
