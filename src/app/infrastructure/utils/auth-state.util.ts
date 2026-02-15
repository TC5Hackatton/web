import { Injectable, signal } from "@angular/core";
import {
  signInWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../../../api/firebase";
import { catchError, from, map, Observable, tap, throwError } from "rxjs";
import { FirebaseError } from "firebase/app";
import { User } from "../../domain/models/user.model";

@Injectable({
  providedIn: "root"
})
export class AuthStateUtil {
  private readonly isLoggedIn = signal(false);
  private _user: FirebaseUser | null = null;

  isAuthenticated() {
    return this.isLoggedIn();
  }

  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(auth, email, password)).pipe(
      map((result) => ({
        id: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      })),
      tap((user) => {
        console.log(user);
        if (user) {
          this.isLoggedIn.set(true);
        }
      }),
      catchError((error: FirebaseError) => {
        return throwError(() => console.log(error.code));
      })
    );
  }

  createUser(email: string, password: string): Observable<User> {
    return from(createUserWithEmailAndPassword(auth, email, password)).pipe(
      map((result) => ({
        id: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      })),
      catchError((error: FirebaseError) => {
        return throwError(() => console.log(error.code));
      })
    );
  }

  updateUserProfile(displayName: string) {
    const user = this.user;

    if (!user) return;
    return from(updateProfile(this?.user, { displayName: displayName, photoURL: null }));
  }

  logout() {
    this.isLoggedIn.set(false);
  }

  get user(): FirebaseUser | null {
    return this._user;
  }
}
