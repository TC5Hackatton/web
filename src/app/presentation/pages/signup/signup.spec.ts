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
});
