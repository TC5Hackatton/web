import { Routes } from "@angular/router";
import { SignupPage } from "./ui/pages/signup/signup";
// import { authGuard } from "./core/auth/auth.guard";
import { LoginPage } from "./ui/pages/login/login";
import { HomePage } from "./presentation/pages/home/home";

export const routes: Routes = [
  {
    path: "signup",
    loadComponent: () => SignupPage
  },
  {
    path: "login",
    loadComponent: () => LoginPage
  },
  {
    path: "",
    // canActivate: [authGuard],
    loadComponent: () => HomePage,
    children: [
      {
        path: "dashboard",
        loadComponent: () =>
          import("./presentation/pages/dashboard/dashboard.component").then(
            (m) => m.DashboardComponent
          )
      },
      {
        path: "tasks",
        loadComponent: () => import("./presentation/pages/tasks/tasks").then((m) => m.TasksPage)
      },
      {
        path: "settings",
        loadComponent: () =>
          import("./presentation/pages/settings/settings.component").then(
            (m) => m.SettingsComponent
          )
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      }
    ]
  }
];
