import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginPage } from "./login";
import { AuthStateUtil } from "../../../infrastructure/utils/auth-state.util";
import { provideRouter } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";

// Mock Firebase functions to avoid issues during testing
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn()
}));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn()
}));
jest.mock("../../../infrastructure/config/firebase.config", () => ({
  auth: {},
  db: {}
}));

describe("LoginPage", () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authStateUtilSpy: { login: jest.Mock };

  beforeEach(async () => {
    authStateUtilSpy = { login: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginPage], // Removed NoopAnimationsModule
      providers: [{ provide: AuthStateUtil, useValue: authStateUtilSpy }, provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize loginForm", () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls["email"]).toBeDefined();
    expect(component.loginForm.controls["password"]).toBeDefined();
  });

  it("should be invalid when empty", () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it("should be valid when filled correctly", () => {
    component.loginForm.controls["email"].setValue("test@example.com");
    component.loginForm.controls["password"].setValue("password123");
    expect(component.loginForm.valid).toBe(true);
  });
});
