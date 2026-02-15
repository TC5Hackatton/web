import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../models/user.model";
import { AuthRepository } from "../repositories/auth.repository";

@Injectable({
  providedIn: "root"
})
export class SignInUseCase {
  private authRepository = inject(AuthRepository);

  execute(email: string, password: string): Observable<User> {
    return this.authRepository.signIn(email, password);
  }
}
