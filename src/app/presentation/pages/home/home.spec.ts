import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HomePage } from "./home";
import { AuthService } from "../../../core/auth/auth.service";
import { provideRouter } from "@angular/router";

// Mock Firebase
jest.mock("firebase/auth", () => ({ getAuth: jest.fn() }));
jest.mock("firebase/firestore", () => ({ getFirestore: jest.fn() }));
jest.mock("../../../../api/firebase", () => ({ auth: {}, db: {} }));

describe("HomePage", () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let authServiceSpy: { isAuthenticated: jest.Mock };

  beforeEach(async () => {
    authServiceSpy = { isAuthenticated: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [{ provide: AuthService, useValue: authServiceSpy }, provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(HomePage, {
        set: { imports: [] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
