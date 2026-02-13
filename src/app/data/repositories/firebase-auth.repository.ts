import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { User } from "../../domain/models/user.model";
import { auth } from "../../infrastructure/config/firebase.config";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

@Injectable({ providedIn: "root" })
export class FirebaseAuthRepository implements AuthRepository {
  signIn(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(auth, email, password)).pipe(
      map((userCredential) => ({
        id: userCredential.user.uid,
        email: userCredential.user.email!
      }))
    );
  }

  signUp(name: string, email: string, password: string): Observable<void> {
    console.log(name, email, password);
    return from(Promise.resolve());
  }

  logout(): Observable<void> {
    return from(signOut(auth));
  }
}
