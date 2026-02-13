import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStateUtil } from "../utils/auth-state.util";

export const authGuard: CanActivateFn = () => {
  const isAuthenticated = inject(AuthStateUtil).isAuthenticated();
  const router = inject(Router);

  if (isAuthenticated) return true;

  router.navigate(["/login"]);
  return false;
};
