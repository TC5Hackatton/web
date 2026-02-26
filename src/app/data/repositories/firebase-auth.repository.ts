import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { User } from "../../domain/models/user.model";
import { auth } from "../../infrastructure/config/firebase.config";
import { UserMapper } from "../mappers/user-mapper";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";

@Injectable({ providedIn: "root" })
export class FirebaseAuthRepository implements AuthRepository {
  signIn(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(auth, email, password)).pipe(
      map((userCredential) =>
        UserMapper.fromDtoToDomain({
          id: userCredential.user.uid,
          email: userCredential.user.email!
        })
      )
    );
  }

  signUp(name: string, email: string, password: string): Observable<void> {
    return from(
      createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        return updateProfile(userCredential.user, { displayName: name });
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(auth));
  }

  getCurrentUser(): User | null {
    const user = auth.currentUser;
    if (user) {
      return UserMapper.fromDtoToDomain({
        id: user.uid,
        email: user.email!,
        name: user.displayName || undefined
      });
    }
    return null;
  }
}
