import { TestBed } from "@angular/core/testing";
import { FirebaseAuthRepository } from "./firebase-auth.repository";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { of } from "rxjs";

jest.mock("firebase/app", () => ({ initializeApp: jest.fn() }));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn()
}));
jest.mock("firebase/firestore", () => ({ getFirestore: jest.fn() }));
jest.mock("../../infrastructure/config/firebase.config", () => ({
  auth: { currentUser: null },
  db: {}
}));

import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth } from "../../infrastructure/config/firebase.config";

describe("FirebaseAuthRepository", () => {
  let repository: FirebaseAuthRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FirebaseAuthRepository,
        { provide: AuthRepository, useClass: FirebaseAuthRepository }
      ]
    });
    repository = TestBed.inject(FirebaseAuthRepository);
    jest.clearAllMocks();
  });

  it("should be created", () => {
    expect(repository).toBeTruthy();
  });

  describe("signIn", () => {
    it("should call signInWithEmailAndPassword and map to User", (done) => {
      const mockCredential = {
        user: { uid: "uid-123", email: "test@test.com" }
      };
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockCredential);

      repository.signIn("test@test.com", "password123").subscribe((user) => {
        expect(user).toEqual({ id: "uid-123", email: "test@test.com" });
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          auth,
          "test@test.com",
          "password123"
        );
        done();
      });
    });
  });

  describe("signUp", () => {
    it("should call createUserWithEmailAndPassword and updateProfile", (done) => {
      const mockUser = { uid: "uid-456", email: "new@test.com" };
      const mockCredential = { user: mockUser };
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockCredential);
      (updateProfile as jest.Mock).mockResolvedValue(undefined);

      repository.signUp("João", "new@test.com", "pass456").subscribe(() => {
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
          auth,
          "new@test.com",
          "pass456"
        );
        expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: "João" });
        done();
      });
    });
  });

  describe("logout", () => {
    it("should call signOut", (done) => {
      (signOut as jest.Mock).mockResolvedValue(undefined);

      repository.logout().subscribe(() => {
        expect(signOut).toHaveBeenCalledWith(auth);
        done();
      });
    });
  });

  describe("getCurrentUser", () => {
    it("should return null when no user is logged in", () => {
      (auth as any).currentUser = null;
      const result = repository.getCurrentUser();
      expect(result).toBeNull();
    });

    it("should return a User object when a user is logged in", () => {
      (auth as any).currentUser = {
        uid: "uid-789",
        email: "logged@test.com",
        displayName: "Logged User"
      };

      const result = repository.getCurrentUser();
      expect(result).toEqual({
        id: "uid-789",
        email: "logged@test.com",
        name: "Logged User"
      });
    });
  });
});
