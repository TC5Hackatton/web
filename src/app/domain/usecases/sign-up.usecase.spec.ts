import { TestBed } from "@angular/core/testing";
import { SignUpUseCase } from "./sign-up.usecase";
import { AuthRepository } from "../repositories/auth.repository";
import { of } from "rxjs";

describe("SignUpUseCase", () => {
  let useCase: SignUpUseCase;
  let authRepositorySpy: { signUp: jest.Mock };

  beforeEach(() => {
    authRepositorySpy = { signUp: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        SignUpUseCase,
        { provide: AuthRepository, useValue: authRepositorySpy }
      ]
    });

    useCase = TestBed.inject(SignUpUseCase);
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  it("should call repository.signUp with correct data", (done) => {
    authRepositorySpy.signUp.mockReturnValue(of(undefined));

    useCase.execute("New User", "new@test.com", "password").subscribe(() => {
      expect(authRepositorySpy.signUp).toHaveBeenCalledWith("New User", "new@test.com", "password");
      done();
    });
  });
});
