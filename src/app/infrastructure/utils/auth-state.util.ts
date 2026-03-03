import { Injectable, signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { onAuthStateChanged } from "firebase/auth";
import { filter, map, take } from "rxjs/operators";
import { auth } from "../config/firebase.config";

@Injectable({
  providedIn: "root"
})
export class AuthStateUtil {
  private readonly isLoggedIn = signal<boolean | null>(null);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.isLoggedIn.set(!!user);
    });
  }

  isAuthenticated() {
    return this.isLoggedIn() === true;
  }

  isInitialized() {
    return this.isLoggedIn() !== null;
  }

  getAuthState(): import("rxjs").Observable<boolean> {
    return toObservable(this.isLoggedIn).pipe(
      filter((state): state is boolean => state !== null),
      map((state) => !!state),
      take(1)
    );
  }
}
