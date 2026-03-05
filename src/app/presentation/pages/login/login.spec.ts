import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginPage } from "./login";
import { AuthStateUtil } from "../../../infrastructure/utils/auth-state.util";
import { provideRouter } from "@angular/router";
import { computed, NO_ERRORS_SCHEMA, signal } from "@angular/core";
import { SignInUseCase } from "../../../domain/usecases/sign-in.usecase";
import { of } from "rxjs";
import { AppSettingsService } from "../../services/app-settings.service";

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
  let signInUseCaseSpy: { execute: jest.Mock };
  let settingsServiceSpy: {
    settings: ReturnType<typeof signal<unknown>>;
    focusSettings: ReturnType<typeof computed>;
    updateAppearance: jest.Mock;
    updateTimer: jest.Mock;
    updateNotifications: jest.Mock;
    updateAccessibility: jest.Mock;
    updateFocus: jest.Mock;
  };

  beforeEach(async () => {
    authStateUtilSpy = { login: jest.fn() };
    signInUseCaseSpy = { execute: jest.fn().mockReturnValue(of({})) };

    const settingsSignal = signal({
      appearance: { dark_mode: false, high_contrast: false, font_size: "M" },
      timer: { amount_default: 25, pause_reminder: false },
      notifications: { sound_on: true },
      focus: { hide_done: false, only_current: false },
      accessibility: { animations_decreased: false, simplified_mode: false }
    });

    settingsServiceSpy = {
      settings: settingsSignal,
      focusSettings: computed(() => settingsSignal().focus),
      updateAppearance: jest.fn(),
      updateTimer: jest.fn(),
      updateNotifications: jest.fn(),
      updateAccessibility: jest.fn(),
      updateFocus: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        { provide: AppSettingsService, useValue: settingsServiceSpy },
        { provide: AuthStateUtil, useValue: authStateUtilSpy },
        { provide: SignInUseCase, useValue: signInUseCaseSpy },
        provideRouter([])
      ],
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
