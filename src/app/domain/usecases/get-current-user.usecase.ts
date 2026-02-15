import { Injectable, inject } from "@angular/core";
import { User } from "../models/user.model";
import { AuthRepository } from "../repositories/auth.repository";

@Injectable({
  providedIn: "root"
})
export class GetCurrentUserUseCase {
  private authRepository = inject(AuthRepository);

  execute(): User | null {
    return this.authRepository.getCurrentUser();
  }
}
