import { Observable } from "rxjs";
import { AuthRepository } from "../repositories/auth.repository";

export class SignUpUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(name: string, email: string, password: string): Observable<void> {
    return this.authRepository.signUp(name, email, password);
  }
}
