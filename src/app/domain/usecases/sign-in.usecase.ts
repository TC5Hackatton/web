import { Observable } from "rxjs";
import { User } from "../models/user.model";
import { AuthRepository } from "../repositories/auth.repository";

export class SignInUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(email: string, password: string): Observable<User> {
    return this.authRepository.signIn(email, password);
  }
}
