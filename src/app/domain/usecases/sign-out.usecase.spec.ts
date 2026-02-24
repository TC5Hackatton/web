import { TestBed } from "@angular/core/testing";
import { SignOutUseCase } from "./sign-out.usecase";
import { AuthRepository } from "../repositories/auth.repository";
import { of } from "rxjs";

describe("SignOutUseCase", () => {
  let useCase: SignOutUseCase;
  let authRepositorySpy: { logout: jest.Mock };

  beforeEach(() => {
    authRepositorySpy = { logout: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        SignOutUseCase,
        { provide: AuthRepository, useValue: authRepositorySpy }
      ]
    });

    useCase = TestBed.inject(SignOutUseCase);
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  it("should call repository.logout", (done) => {
    authRepositorySpy.logout.mockReturnValue(of(undefined));

    useCase.execute().subscribe(() => {
      expect(authRepositorySpy.logout).toHaveBeenCalled();
      done();
    });
  });
});
