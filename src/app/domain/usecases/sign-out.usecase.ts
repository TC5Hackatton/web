import { Observable } from "rxjs";
import { AuthRepository } from "../repositories/auth.repository";

export class SignOutUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Observable<void> {
    return this.authRepository.logout();
  }
}
