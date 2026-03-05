import { TestBed } from "@angular/core/testing";
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { authGuard } from "./auth.guard";
import { AuthStateUtil } from "../utils/auth-state.util";
import { of } from "rxjs";
import { Observable } from "rxjs";

describe("authGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let authStateUtilSpy: { getAuthState: jest.Mock };
  let routerSpy: { navigate: jest.Mock };

  beforeEach(() => {
    authStateUtilSpy = { getAuthState: jest.fn() };
    routerSpy = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStateUtil, useValue: authStateUtilSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });

  it("should allow access if authenticated", (done) => {
    authStateUtilSpy.getAuthState.mockReturnValue(of(true));
    const result = executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    ) as Observable<boolean>;

    result.subscribe((val) => {
      expect(val).toBe(true);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it("should redirect to login if not authenticated", (done) => {
    authStateUtilSpy.getAuthState.mockReturnValue(of(false));
    const result = executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    ) as Observable<boolean>;

    result.subscribe((val) => {
      expect(val).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(["/login"]);
      done();
    });
  });
});
