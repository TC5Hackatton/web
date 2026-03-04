import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SignupPage } from "./signup";
import { AuthStateUtil } from "../../../infrastructure/utils/auth-state.util";
import { provideRouter } from "@angular/router";
import { SignUpUseCase } from "../../../domain/usecases/sign-up.usecase";
import { of } from "rxjs";

describe("SignupPage", () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;
  let authStateUtilSpy: { isAuthenticated: jest.Mock };
  let signUpUseCaseSpy: { execute: jest.Mock };

  beforeEach(async () => {
    authStateUtilSpy = { isAuthenticated: jest.fn() };
    signUpUseCaseSpy = { execute: jest.fn().mockReturnValue(of(void 0)) };

    await TestBed.configureTestingModule({
      imports: [SignupPage],
      providers: [
        { provide: AuthStateUtil, useValue: authStateUtilSpy },
        { provide: SignUpUseCase, useValue: signUpUseCaseSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Validation", () => {
    it("should be invalid when empty", () => {
      expect(component.signupForm.valid).toBeFalsy();
    });

    it("should validate email format", () => {
      const email = component.signupForm.controls["email"];
      email.setValue("invalid-email");
      expect(email.hasError("email")).toBeTruthy();

      email.setValue("valid@email.com");
      expect(email.hasError("email")).toBeFalsy();
    });

    it("should validate password minimum length", () => {
      const password = component.signupForm.controls["password"];
      password.setValue("12345");
      expect(password.hasError("minlength")).toBeTruthy();

      password.setValue("123456");
      expect(password.hasError("minlength")).toBeFalsy();
    });

    it("should validate that passwords match", () => {
      const password = component.signupForm.controls["password"];
      const repeatPassword = component.signupForm.controls["repeatPassword"];

      password.setValue("password123");
      repeatPassword.setValue("differentPassword");

      // Group level validation triggered on form change
      expect(repeatPassword.hasError("passwordMismatch")).toBeTruthy();

      repeatPassword.setValue("password123");
      expect(repeatPassword.hasError("passwordMismatch")).toBeFalsy();
    });

    it("should not call signUpUseCase when form is invalid", () => {
      component.signup();
      expect(signUpUseCaseSpy.execute).not.toHaveBeenCalled();
    });

    it("should call signUpUseCase when form is valid", () => {
      component.signupForm.patchValue({
        email: "test@test.com",
        password: "password123",
        repeatPassword: "password123"
      });

      component.signup();
      expect(signUpUseCaseSpy.execute).toHaveBeenCalled();
    });
  });
});
