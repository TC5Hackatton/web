export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name?: string
  ) {}

  static create(id: string, email: string, name?: string): User {
    return new User(id, email, name);
  }
}
