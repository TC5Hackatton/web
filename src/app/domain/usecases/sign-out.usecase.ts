import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { AuthRepository } from "../repositories/auth.repository";

@Injectable({
  providedIn: "root"
})
export class SignOutUseCase {
  private authRepository = inject(AuthRepository);

  execute(): Observable<void> {
    return this.authRepository.logout();
  }
}
