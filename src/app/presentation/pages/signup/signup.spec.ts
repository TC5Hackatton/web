import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SignupPage } from "./signup";
import { AuthStateUtil } from "../../../infrastructure/utils/auth-state.util";
import { provideRouter, Router } from "@angular/router";
import { SignUpUseCase } from "../../../domain/usecases/sign-up.usecase";
import { of, throwError } from "rxjs";
import { NO_ERRORS_SCHEMA } from "@angular/core";

jest.mock("firebase/auth", () => ({ createUserWithEmailAndPassword: jest.fn() }));
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

describe("SignupPage", () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;
  let signUpUseCaseSpy: { execute: jest.Mock };
  let router: Router;

  const VALID_FORM_DATA = {
    email: "user@test.com",
    password: "password123",
    repeatPassword: "password123"
  };

  beforeEach(async () => {
    signUpUseCaseSpy = { execute: jest.fn().mockReturnValue(of(void 0)) };

    await TestBed.configureTestingModule({
      imports: [SignupPage],
      providers: [
        { provide: AuthStateUtil, useValue: { isAuthenticated: jest.fn() } },
        { provide: SignUpUseCase, useValue: signUpUseCaseSpy },
        provideRouter([])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  describe("Criação", () => {
    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize signupForm with email, password and repeatPassword controls", () => {
      expect(component.signupForm).toBeDefined();
      expect(component.signupForm.contains("email")).toBe(true);
      expect(component.signupForm.contains("password")).toBe(true);
      expect(component.signupForm.contains("repeatPassword")).toBe(true);
    });
  });

  describe("Getters de controle", () => {
    it("should return the email control via getter", () => {
      expect(component.email).toBe(component.signupForm.get("email"));
    });

    it("should return the password control via getter", () => {
      expect(component.password).toBe(component.signupForm.get("password"));
    });

    it("should return the repeatPassword control via getter", () => {
      expect(component.repeatPassword).toBe(component.signupForm.get("repeatPassword"));
    });
  });

  describe("Validação do formulário", () => {
    it("should be invalid when empty", () => {
      expect(component.signupForm.valid).toBeFalsy();
    });

    it("should require email", () => {
      component.signupForm.controls["email"].setValue("");
      expect(component.signupForm.controls["email"].hasError("required")).toBe(true);
    });

    it("should reject invalid email format", () => {
      component.signupForm.controls["email"].setValue("invalid-email");
      expect(component.signupForm.controls["email"].hasError("email")).toBe(true);
    });

    it("should accept a valid email", () => {
      component.signupForm.controls["email"].setValue("valid@email.com");
      expect(component.signupForm.controls["email"].hasError("email")).toBe(false);
    });

    it("should reject password shorter than 6 characters", () => {
      component.signupForm.controls["password"].setValue("12345");
      expect(component.signupForm.controls["password"].hasError("minlength")).toBe(true);
    });

    it("should accept password with at least 6 characters", () => {
      component.signupForm.controls["password"].setValue("123456");
      expect(component.signupForm.controls["password"].hasError("minlength")).toBe(false);
    });

    it("should require repeatPassword", () => {
      component.signupForm.controls["repeatPassword"].setValue("");
      expect(component.signupForm.controls["repeatPassword"].hasError("required")).toBe(true);
    });

    it("should mark repeatPassword as invalid when passwords do not match", () => {
      component.signupForm.controls["password"].setValue("password123");
      component.signupForm.controls["repeatPassword"].setValue("differentPassword");
      expect(component.signupForm.controls["repeatPassword"].hasError("passwordMismatch")).toBe(
        true
      );
    });

    it("should clear passwordMismatch error when passwords match", () => {
      component.signupForm.controls["password"].setValue("password123");
      component.signupForm.controls["repeatPassword"].setValue("password123");
      expect(component.signupForm.controls["repeatPassword"].hasError("passwordMismatch")).toBe(
        false
      );
    });

    it("should be valid when all fields are filled correctly", () => {
      component.signupForm.patchValue(VALID_FORM_DATA);
      expect(component.signupForm.valid).toBe(true);
    });
  });

  describe("signup()", () => {
    it("should NOT call signUpUseCase when form is invalid", () => {
      component.signup();
      expect(signUpUseCaseSpy.execute).not.toHaveBeenCalled();
    });

    it("should call signUpUseCase with correct email and password when form is valid", () => {
      component.signupForm.patchValue(VALID_FORM_DATA);
      component.signup();
      expect(signUpUseCaseSpy.execute).toHaveBeenCalledWith("", "user@test.com", "password123");
    });

    it("should navigate to '/' after successful signup", () => {
      const navigateSpy = jest.spyOn(router, "navigate");
      component.signupForm.patchValue(VALID_FORM_DATA);
      component.signup();
      expect(navigateSpy).toHaveBeenCalledWith(["/"]);
    });

    it("should log error to console when signup fails", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      const error = new Error("Email já em uso");
      signUpUseCaseSpy.execute.mockReturnValue(throwError(() => error));

      component.signupForm.patchValue(VALID_FORM_DATA);
      component.signup();

      expect(consoleSpy).toHaveBeenCalledWith("Erro ao cadastrar usuário:", error);
    });

    it("should NOT navigate when signup fails", () => {
      const navigateSpy = jest.spyOn(router, "navigate");
      signUpUseCaseSpy.execute.mockReturnValue(throwError(() => new Error("Falha")));

      component.signupForm.patchValue(VALID_FORM_DATA);
      component.signup();

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe("cancel()", () => {
    it("should navigate to '/login'", () => {
      const navigateSpy = jest.spyOn(router, "navigate");
      component.cancel();
      expect(navigateSpy).toHaveBeenCalledWith(["/login"]);
    });
  });
});
