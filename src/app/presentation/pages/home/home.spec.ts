import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HomePage } from "./home";
import { AuthStateUtil } from "../../../infrastructure/utils/auth-state.util";
import { provideRouter } from "@angular/router";

// Mock Firebase
jest.mock("firebase/auth", () => ({ getAuth: jest.fn() }));
jest.mock("firebase/firestore", () => ({ getFirestore: jest.fn() }));
jest.mock("../../../infrastructure/config/firebase.config", () => ({ auth: {}, db: {} }));

describe("HomePage", () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let authStateUtilSpy: { isAuthenticated: jest.Mock };

  beforeEach(async () => {
    authStateUtilSpy = { isAuthenticated: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [{ provide: AuthStateUtil, useValue: authStateUtilSpy }, provideRouter([])]
    })
      .overrideComponent(HomePage, {
        set: { imports: [], schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA] }
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
