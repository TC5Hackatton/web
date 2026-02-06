import { TestBed } from "@angular/core/testing";
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { authGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

describe("authGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let authServiceSpy: { isAuthenticated: jest.Mock };
  let routerSpy: { navigate: jest.Mock };

  beforeEach(() => {
    authServiceSpy = { isAuthenticated: jest.fn() };
    routerSpy = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });

  it("should allow access if authenticated", () => {
    authServiceSpy.isAuthenticated.mockReturnValue(true);
    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toBe(true);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it("should redirect to login if not authenticated", () => {
    authServiceSpy.isAuthenticated.mockReturnValue(false);
    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/login"]);
  });
});
