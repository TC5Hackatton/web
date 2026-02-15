import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { AuthRepository } from "../repositories/auth.repository";

@Injectable({
  providedIn: "root"
})
export class SignUpUseCase {
  private authRepository = inject(AuthRepository);

  execute(name: string, email: string, password: string): Observable<void> {
    return this.authRepository.signUp(name, email, password);
  }
}
