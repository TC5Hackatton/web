import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SignupPage } from "./signup";
import { AuthService } from "../../../core/auth/auth.service";
import { provideRouter } from "@angular/router";

describe("SignupPage", () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;
  let authServiceSpy: { isAuthenticated: jest.Mock };

  beforeEach(async () => {
    authServiceSpy = { isAuthenticated: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [SignupPage],
      providers: [{ provide: AuthService, useValue: authServiceSpy }, provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
