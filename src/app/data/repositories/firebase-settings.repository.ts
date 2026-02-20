import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { SettingsRepository } from "../../domain/repositories/settings.repository";
import { UserSettings } from "../../domain/models/user-settings.model";
import { db } from "../../infrastructure/config/firebase.config";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

@Injectable({ providedIn: "root" })
export class FirebaseSettingsRepository implements SettingsRepository {
  getSettings(uid: string): Observable<UserSettings | null> {
    const docRef = doc(db, `settings/${uid}`);
    return new Observable<UserSettings | null>((observer) => {
      const unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            observer.next({ ...snap.data(), id: snap.id } as UserSettings);
          } else {
            observer.next(null);
          }
        },
        (error) => observer.error(error)
      );

      return unsubscribe;
    });
  }

  saveSettings(uid: string, settings: Partial<UserSettings>): Observable<void> {
    const docRef = doc(db, `settings/${uid}`);
    return from(setDoc(docRef, settings, { merge: true }));
  }
}
