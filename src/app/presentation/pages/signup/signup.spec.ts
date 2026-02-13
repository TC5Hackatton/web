import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SignupPage } from "./signup";
import { AuthStateUtil } from "../../../infrastructure/utils/auth-state.util";
import { provideRouter } from "@angular/router";

describe("SignupPage", () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;
  let authStateUtilSpy: { isAuthenticated: jest.Mock };

  beforeEach(async () => {
    authStateUtilSpy = { isAuthenticated: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [SignupPage],
      providers: [{ provide: AuthStateUtil, useValue: authStateUtilSpy }, provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
