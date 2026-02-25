import { TestBed } from "@angular/core/testing";
import { AuthStateUtil } from "./auth-state.util";

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(() => {
    return jest.fn();
  })
}));

jest.mock("../config/firebase.config", () => ({
  auth: {
    currentUser: null
  }
}));

describe("AuthStateUtil", () => {
  let service: AuthStateUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthStateUtil);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should have initial login state as false (when currentUser is null)", () => {
    expect(service.isAuthenticated()).toBe(false);
  });
});
