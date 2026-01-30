import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly isLoggedIn = signal(false);

  isAuthenticated() {
    return this.isLoggedIn();
  }

  login() {
    this.isLoggedIn.set(true);
  }

  logout() {
    this.isLoggedIn.set(false);
  }
}
