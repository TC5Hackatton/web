import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginPage } from "./login";
import { AuthStateUtil } from "../../../infrastructure/utils/auth-state.util";
import { provideRouter, Router } from "@angular/router";
import { computed, NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { SignInUseCase } from "../../../domain/usecases/sign-in.usecase";
import { of, throwError } from "rxjs";
import { AppSettingsService } from "../../services/app-settings.service";

jest.mock("firebase/auth", () => ({ signInWithEmailAndPassword: jest.fn() }));
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

const makeSettingsSignal = (focusOverrides: object = {}) => {
  const s = signal({
    appearance: { dark_mode: false, high_contrast: false, font_size: "M" },
    timer: { amount_default: 25, pause_reminder: false },
    notifications: { sound_on: true },
    focus: { hide_done: false, only_current: false, ...focusOverrides },
    accessibility: { animations_decreased: false, simplified_mode: false }
  });
  return s;
};

const makeSettingsServiceSpy = (focusOverrides: object = {}) => {
  const settingsSignal = makeSettingsSignal(focusOverrides);
  return {
    settings: settingsSignal,
    focusSettings: computed(() => settingsSignal().focus),
    updateAppearance: jest.fn(),
    updateTimer: jest.fn(),
    updateNotifications: jest.fn(),
    updateAccessibility: jest.fn(),
    updateFocus: jest.fn()
  };
};

describe("LoginPage", () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let signInUseCaseSpy: { execute: jest.Mock };
  let settingsServiceSpy: ReturnType<typeof makeSettingsServiceSpy>;
  let router: Router;

  const setup = async (focusOverrides: object = {}) => {
    signInUseCaseSpy = {
      execute: jest.fn().mockReturnValue(of({ id: "u1", email: "x@x.com" }))
    };
    settingsServiceSpy = makeSettingsServiceSpy(focusOverrides);

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        { provide: AppSettingsService, useValue: settingsServiceSpy },
        { provide: AuthStateUtil, useValue: { login: jest.fn() } },
        { provide: SignInUseCase, useValue: signInUseCaseSpy },
        provideRouter([])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  };

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  describe("Criação", () => {
    beforeEach(async () => setup());

    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize loginForm with email and password controls", () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.controls["email"]).toBeDefined();
      expect(component.loginForm.controls["password"]).toBeDefined();
    });
  });

  describe("Validação do formulário", () => {
    beforeEach(async () => setup());

    it("should be invalid when empty", () => {
      expect(component.loginForm.valid).toBe(false);
    });

    it("should be invalid when email is in wrong format", () => {
      component.loginForm.controls["email"].setValue("not-an-email");
      component.loginForm.controls["password"].setValue("password123");
      expect(component.loginForm.valid).toBe(false);
      expect(component.loginForm.controls["email"].hasError("email")).toBe(true);
    });

    it("should be invalid when email is empty", () => {
      component.loginForm.controls["email"].setValue("");
      component.loginForm.controls["password"].setValue("password123");
      expect(component.loginForm.controls["email"].hasError("required")).toBe(true);
    });

    it("should be invalid when password is empty", () => {
      component.loginForm.controls["email"].setValue("test@example.com");
      component.loginForm.controls["password"].setValue("");
      expect(component.loginForm.controls["password"].hasError("required")).toBe(true);
    });

    it("should be valid when email and password are correctly filled", () => {
      component.loginForm.controls["email"].setValue("test@example.com");
      component.loginForm.controls["password"].setValue("password123");
      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe("entrar()", () => {
    it("should NOT call signInUseCase when form is invalid", async () => {
      await setup();
      component.entrar();
      expect(signInUseCaseSpy.execute).not.toHaveBeenCalled();
    });

    it("should call signInUseCase with correct email and password when form is valid", async () => {
      await setup();
      component.loginForm.controls["email"].setValue("user@test.com");
      component.loginForm.controls["password"].setValue("secret123");
      component.entrar();
      expect(signInUseCaseSpy.execute).toHaveBeenCalledWith("user@test.com", "secret123");
    });

    it("should navigate to '/' after successful login (focus mode OFF)", async () => {
      await setup({ only_current: false });
      const navigateSpy = jest.spyOn(router, "navigate");

      component.loginForm.controls["email"].setValue("user@test.com");
      component.loginForm.controls["password"].setValue("secret123");
      component.entrar();

      expect(navigateSpy).toHaveBeenCalledWith(["/"]);
    });

    it("should navigate to '/focus-mode' after successful login when only_current is ON", async () => {
      await setup({ only_current: true });
      const navigateSpy = jest.spyOn(router, "navigate");

      component.loginForm.controls["email"].setValue("user@test.com");
      component.loginForm.controls["password"].setValue("secret123");
      component.entrar();

      expect(navigateSpy).toHaveBeenCalledWith(["/focus-mode"]);
    });

    it("should call alert on login error", async () => {
      await setup();
      signInUseCaseSpy.execute.mockReturnValue(
        throwError(() => ({ message: "Credenciais inválidas" }))
      );
      const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

      component.loginForm.controls["email"].setValue("user@test.com");
      component.loginForm.controls["password"].setValue("wrongpass");
      component.entrar();

      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Credenciais inválidas"));
    });
  });

  describe("goToSignup()", () => {
    beforeEach(async () => setup());

    it("should navigate to '/signup'", () => {
      const navigateSpy = jest.spyOn(router, "navigate");
      component.goToSignup();
      expect(navigateSpy).toHaveBeenCalledWith(["/signup"]);
    });
  });
});
