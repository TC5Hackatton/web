import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = () => {
  const isAuthenticated = inject(AuthService).isAuthenticated();
  const router = inject(Router);

  if (isAuthenticated) return true;

  router.navigate(["/login"]);
  return false;
};
