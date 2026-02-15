import { Injectable, signal } from "@angular/core";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase.config";

@Injectable({
  providedIn: "root"
})
export class AuthStateUtil {
  private readonly isLoggedIn = signal(!!auth.currentUser);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.isLoggedIn.set(!!user);
    });
  }

  isAuthenticated() {
    return this.isLoggedIn() || !!auth.currentUser;
  }
}
