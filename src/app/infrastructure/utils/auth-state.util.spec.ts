import { TestBed } from "@angular/core/testing";
import { AuthStateUtil } from "./auth-state.util";

describe("AuthStateUtil", () => {
  let service: AuthStateUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthStateUtil);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should have initial login state as false", () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it("should set login state to true on login()", () => {
    service.login();
    expect(service.isAuthenticated()).toBe(true);
  });

  it("should set login state to false on logout()", () => {
    service.login();
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
  });
});
