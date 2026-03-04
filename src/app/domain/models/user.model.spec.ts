import { User } from "./user.model";

describe("User Model", () => {
  it("should create a user instance", () => {
    const user = User.create("1", "test@example.com", "Test User");
    expect(user.id).toBe("1");
    expect(user.email).toBe("test@example.com");
    expect(user.name).toBe("Test User");
  });

  it("should create a user instance without name", () => {
    const user = User.create("1", "test@example.com");
    expect(user.id).toBe("1");
    expect(user.email).toBe("test@example.com");
    expect(user.name).toBeUndefined();
  });
});
