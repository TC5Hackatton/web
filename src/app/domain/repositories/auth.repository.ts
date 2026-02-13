import { Observable } from "rxjs";
import { User } from "../models/user.model";

export abstract class AuthRepository {
  abstract signIn(email: string, password: string): Observable<User>;
  abstract signUp(name: string, email: string, password: string): Observable<void>;
  abstract logout(): Observable<void>;
}
