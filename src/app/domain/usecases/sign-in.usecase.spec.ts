import { TestBed } from "@angular/core/testing";
import { SignInUseCase } from "./sign-in.usecase";
import { AuthRepository } from "../repositories/auth.repository";
import { of } from "rxjs";

describe("SignInUseCase", () => {
  let useCase: SignInUseCase;
  let authRepositorySpy: { signIn: jest.Mock };

  beforeEach(() => {
    authRepositorySpy = { signIn: jest.fn() };

    TestBed.configureTestingModule({
      providers: [SignInUseCase, { provide: AuthRepository, useValue: authRepositorySpy }]
    });

    useCase = TestBed.inject(SignInUseCase);
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  it("should call repository.signIn with correct credentials", (done) => {
    const mockUser = { id: "123", email: "test@test.com" };
    authRepositorySpy.signIn.mockReturnValue(of(mockUser));

    useCase.execute("test@test.com", "password").subscribe((user) => {
      expect(authRepositorySpy.signIn).toHaveBeenCalledWith("test@test.com", "password");
      expect(user).toEqual(mockUser);
      done();
    });
  });
});
