import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStateUtil } from "../utils/auth-state.util";

import { map, tap } from "rxjs/operators";

export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthStateUtil);
  const router = inject(Router);

  return authState.getAuthState().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) router.navigate(["/login"]);
    }),
    map((isAuthenticated) => isAuthenticated)
  );
};
