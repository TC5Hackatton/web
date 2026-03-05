import { UserMapper } from "./user-mapper";
import { UserDTO } from "../dtos/user-dto";

describe("UserMapper", () => {
  it("should map UserDTO to User domain model", () => {
    const mockDto: UserDTO = {
      id: "user123",
      email: "test@example.com",
      name: "Test User"
    };

    const result = UserMapper.fromDtoToDomain(mockDto);

    expect(result.id).toBe(mockDto.id);
    expect(result.email).toBe(mockDto.email);
    expect(result.name).toBe(mockDto.name);
  });

  it("should map UserDTO without name", () => {
    const mockDto: UserDTO = {
      id: "user123",
      email: "test@example.com"
    };

    const result = UserMapper.fromDtoToDomain(mockDto);

    expect(result.id).toBe(mockDto.id);
    expect(result.email).toBe(mockDto.email);
    expect(result.name).toBeUndefined();
  });
});
