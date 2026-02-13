import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { FirebaseAuthRepository } from "./data/repositories/firebase-auth.repository";
import { FirebaseTaskRepository } from "./data/repositories/firebase-task.repository";
import { AuthRepository } from "./domain/repositories/auth.repository";
import { TaskRepository } from "./domain/repositories/task.repository";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: AuthRepository, useClass: FirebaseAuthRepository },
    { provide: TaskRepository, useClass: FirebaseTaskRepository }
  ]
};
