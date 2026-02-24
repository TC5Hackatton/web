import { TestBed } from "@angular/core/testing";
import { GetCurrentUserUseCase } from "./get-current-user.usecase";
import { AuthRepository } from "../repositories/auth.repository";

describe("GetCurrentUserUseCase", () => {
  let useCase: GetCurrentUserUseCase;
  let authRepositorySpy: { getCurrentUser: jest.Mock };

  beforeEach(() => {
    authRepositorySpy = { getCurrentUser: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        GetCurrentUserUseCase,
        { provide: AuthRepository, useValue: authRepositorySpy }
      ]
    });

    useCase = TestBed.inject(GetCurrentUserUseCase);
  });

  it("should be created", () => {
    expect(useCase).toBeTruthy();
  });

  it("should return the current user from the repository", () => {
    const mockUser = { id: "123", email: "test@test.com", name: "Test User" };
    authRepositorySpy.getCurrentUser.mockReturnValue(mockUser);

    const result = useCase.execute();

    expect(authRepositorySpy.getCurrentUser).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it("should return null if there is no current user", () => {
    authRepositorySpy.getCurrentUser.mockReturnValue(null);

    const result = useCase.execute();

    expect(authRepositorySpy.getCurrentUser).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
