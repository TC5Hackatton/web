import { TestBed } from "@angular/core/testing";
import { FirebaseTaskRepository } from "./firebase-task.repository";
import { TaskRepository } from "../../domain/repositories/task.repository";

// Mock Firebase
jest.mock("firebase/auth", () => ({ getAuth: jest.fn() }));
jest.mock("firebase/firestore", () => ({ getFirestore: jest.fn() }));
jest.mock("../../infrastructure/config/firebase.config", () => ({ auth: {}, db: {} }));
jest.mock("firebase/app", () => ({ initializeApp: jest.fn() }));

describe("FirebaseTaskRepository", () => {
  let service: FirebaseTaskRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FirebaseTaskRepository,
        { provide: TaskRepository, useClass: FirebaseTaskRepository }
      ]
    });
    service = TestBed.inject(FirebaseTaskRepository);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
