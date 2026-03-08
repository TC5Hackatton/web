import { TestBed } from "@angular/core/testing";
import { FirebaseTaskRepository } from "./firebase-task.repository";
import { TaskRepository } from "../../domain/repositories/task.repository";
import { Task } from "../../domain/models/task.model";

jest.mock("firebase/app", () => ({ initializeApp: jest.fn() }));
jest.mock("firebase/auth", () => ({ getAuth: jest.fn() }));
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn()
}));
jest.mock("../../infrastructure/config/firebase.config", () => ({
  auth: { currentUser: null },
  db: {}
}));

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { auth, db } from "../../infrastructure/config/firebase.config";

const makeTaskDTO = (overrides = {}) => ({
  id: "task-id-1",
  uid: "user-123",
  title: "Tarefa de teste",
  description: "Descrição",
  timeType: "cronometro" as const,
  timeValue: 1500,
  timeSpend: 0,
  status: "todo" as const,
  createdAt: new Date("2024-01-01"),
  statusChangedAt: null,
  ...overrides
});

const makeDomainTask = (overrides = {}): Task =>
  Task.create({
    id: "task-id-1",
    uid: "user-123",
    title: "Tarefa de teste",
    description: "Descrição",
    timeType: "cronometro",
    timeValue: 1500,
    timeSpend: 0,
    status: "todo",
    createdAt: new Date("2024-01-01"),
    ...overrides
  });

const makeSnapshot = (docs: object[]) => ({
  docs: docs.map((data) => ({
    id: (data as { id?: string }).id ?? "task-id-1",
    data: () => data
  })),
  empty: docs.length === 0
});

describe("FirebaseTaskRepository", () => {
  let repository: FirebaseTaskRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FirebaseTaskRepository,
        { provide: TaskRepository, useClass: FirebaseTaskRepository }
      ]
    });
    repository = TestBed.inject(FirebaseTaskRepository);
    jest.clearAllMocks();
  });

  it("should be created", () => {
    expect(repository).toBeTruthy();
  });

  describe("getTasks", () => {
    it("should return an empty array when there is no authenticated user", async () => {
      (auth as unknown as { currentUser: null }).currentUser = null;

      const result = await repository.getTasks();

      expect(result).toEqual([]);
      expect(getDocs).not.toHaveBeenCalled();
    });

    it("should return a list of tasks for the authenticated user", async () => {
      (auth as unknown as { currentUser: object }).currentUser = { uid: "user-123" };

      const dto = makeTaskDTO();
      const snapshot = makeSnapshot([dto]);

      (collection as jest.Mock).mockReturnValue("tasksRef");
      (query as jest.Mock).mockReturnValue("queryRef");
      (where as jest.Mock).mockReturnValue("whereClause");
      (orderBy as jest.Mock).mockReturnValue("orderByClause");
      (getDocs as jest.Mock).mockResolvedValue(snapshot);

      const result = await repository.getTasks();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Task);
      expect(result[0].title).toBe("Tarefa de teste");
      expect(result[0].uid).toBe("user-123");
      expect(collection).toHaveBeenCalledWith(db, "tasks");
      expect(getDocs).toHaveBeenCalledWith("queryRef");
    });

    it("should return an empty array when the user has no tasks", async () => {
      (auth as unknown as { currentUser: object }).currentUser = { uid: "user-123" };

      (collection as jest.Mock).mockReturnValue("tasksRef");
      (query as jest.Mock).mockReturnValue("queryRef");
      (where as jest.Mock).mockReturnValue("whereClause");
      (orderBy as jest.Mock).mockReturnValue("orderByClause");
      (getDocs as jest.Mock).mockResolvedValue(makeSnapshot([]));

      const result = await repository.getTasks();

      expect(result).toEqual([]);
    });
  });

  describe("addTask", () => {
    it("should throw an error when there is no authenticated user", async () => {
      (auth as unknown as { currentUser: null }).currentUser = null;

      await expect(repository.addTask("Título", "Desc", "cronometro", 1500, 0)).rejects.toThrow(
        "Usuário não autenticado"
      );

      expect(addDoc).not.toHaveBeenCalled();
    });

    it("should call addDoc with the correct DTO when the user is authenticated", async () => {
      (auth as unknown as { currentUser: object }).currentUser = { uid: "user-123" };

      (collection as jest.Mock).mockReturnValue("tasksRef");
      (addDoc as jest.Mock).mockResolvedValue({ id: "new-task-id" });

      await repository.addTask("Nova Tarefa", "Descrição", "tempo_fixo", 3000, 0, "doing");

      expect(addDoc).toHaveBeenCalledTimes(1);

      const [collectionRef, dto] = (addDoc as jest.Mock).mock.calls[0];
      expect(collectionRef).toBe("tasksRef");
      expect(dto.uid).toBe("user-123");
      expect(dto.title).toBe("Nova Tarefa");
      expect(dto.description).toBe("Descrição");
      expect(dto.timeType).toBe("tempo_fixo");
      expect(dto.timeValue).toBe(3000);
      expect(dto.timeSpend).toBe(0);
      expect(dto.status).toBe("doing");
    });

    it("should use 'todo' as default status when not provided", async () => {
      (auth as unknown as { currentUser: object }).currentUser = { uid: "user-123" };

      (collection as jest.Mock).mockReturnValue("tasksRef");
      (addDoc as jest.Mock).mockResolvedValue({ id: "new-task-id" });

      await repository.addTask("Tarefa", "Desc", "cronometro", 900, 0);

      const [, dto] = (addDoc as jest.Mock).mock.calls[0];
      expect(dto.status).toBe("todo");
    });

    it("should set statusChangedAt to null when not provided", async () => {
      (auth as unknown as { currentUser: object }).currentUser = { uid: "user-123" };

      (collection as jest.Mock).mockReturnValue("tasksRef");
      (addDoc as jest.Mock).mockResolvedValue({ id: "new-task-id" });

      await repository.addTask("Tarefa", "Desc", "cronometro", 900, 0);

      const [, dto] = (addDoc as jest.Mock).mock.calls[0];
      expect(dto.statusChangedAt).toBeNull();
    });

    it("should set statusChangedAt when provided", async () => {
      (auth as unknown as { currentUser: object }).currentUser = { uid: "user-123" };

      (collection as jest.Mock).mockReturnValue("tasksRef");
      (addDoc as jest.Mock).mockResolvedValue({ id: "new-task-id" });

      const changedAt = new Date("2024-06-01");
      await repository.addTask("Tarefa", "Desc", "cronometro", 900, 0, "done", changedAt);

      const [, dto] = (addDoc as jest.Mock).mock.calls[0];
      expect(dto.statusChangedAt).toEqual(changedAt);
    });
  });

  describe("updateTask", () => {
    it("should throw an error when the task has no ID", async () => {
      const task = makeDomainTask({ id: undefined });

      await expect(repository.updateTask(task)).rejects.toThrow("Task ID is required for update");

      expect(updateDoc).not.toHaveBeenCalled();
    });

    it("should call updateDoc with the correct fields", async () => {
      const task = makeDomainTask({ id: "task-id-1", status: "doing", timeSpend: 120 });

      (doc as jest.Mock).mockReturnValue("taskDocRef");
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      await repository.updateTask(task);

      expect(doc).toHaveBeenCalledWith(db, "tasks", "task-id-1");
      expect(updateDoc).toHaveBeenCalledWith("taskDocRef", {
        status: "doing",
        timeSpend: 120,
        statusChangedAt: null
      });
    });

    it("should pass statusChangedAt correctly when the task has one", async () => {
      const changedAt = new Date("2024-05-01");
      const task = makeDomainTask({
        id: "task-id-1",
        status: "done",
        statusChangedAt: changedAt
      });

      (doc as jest.Mock).mockReturnValue("taskDocRef");
      (updateDoc as jest.Mock).mockResolvedValue(undefined);

      await repository.updateTask(task);

      expect(updateDoc).toHaveBeenCalledWith("taskDocRef", {
        status: "done",
        timeSpend: 0,
        statusChangedAt: changedAt
      });
    });
  });

  describe("getOldestTodoTask", () => {
    it("should return null when there is no authenticated user", async () => {
      (auth as unknown as { currentUser: null }).currentUser = null;

      const result = await repository.getOldestTodoTask();

      expect(result).toBeNull();
      expect(getDocs).not.toHaveBeenCalled();
    });

    it("should return null when there are no 'todo' tasks", async () => {
      (auth as unknown as { currentUser: object }).currentUser = { uid: "user-123" };

      (collection as jest.Mock).mockReturnValue("tasksRef");
      (query as jest.Mock).mockReturnValue("queryRef");
      (where as jest.Mock).mockReturnValue("whereClause");
      (orderBy as jest.Mock).mockReturnValue("orderByClause");
      (limit as jest.Mock).mockReturnValue("limitClause");
      (getDocs as jest.Mock).mockResolvedValue(makeSnapshot([]));

      const result = await repository.getOldestTodoTask();

      expect(result).toBeNull();
    });

    it("should return the oldest 'todo' task", async () => {
      (auth as unknown as { currentUser: object }).currentUser = { uid: "user-123" };

      const dto = makeTaskDTO({ id: "oldest-task" });
      (collection as jest.Mock).mockReturnValue("tasksRef");
      (query as jest.Mock).mockReturnValue("queryRef");
      (where as jest.Mock).mockReturnValue("whereClause");
      (orderBy as jest.Mock).mockReturnValue("orderByClause");
      (limit as jest.Mock).mockReturnValue("limitClause");
      (getDocs as jest.Mock).mockResolvedValue(makeSnapshot([dto]));

      const result = await repository.getOldestTodoTask();

      expect(result).not.toBeNull();
      expect(result).toBeInstanceOf(Task);
      expect(result!.id).toBe("oldest-task");
      expect(result!.status).toBe("todo");
    });

    it("should build the query with the correct Firestore filters", async () => {
      (auth as unknown as { currentUser: object }).currentUser = { uid: "user-123" };

      (collection as jest.Mock).mockReturnValue("tasksRef");
      (query as jest.Mock).mockReturnValue("queryRef");
      (where as jest.Mock).mockReturnValue("whereClause");
      (orderBy as jest.Mock).mockReturnValue("orderByClause");
      (limit as jest.Mock).mockReturnValue("limitClause");
      (getDocs as jest.Mock).mockResolvedValue(makeSnapshot([]));

      await repository.getOldestTodoTask();

      expect(collection).toHaveBeenCalledWith(db, "tasks");
      expect(where).toHaveBeenCalledWith("uid", "==", "user-123");
      expect(where).toHaveBeenCalledWith("status", "==", "todo");
      expect(orderBy).toHaveBeenCalledWith("createdAt", "asc");
      expect(limit).toHaveBeenCalledWith(1);
    });
  });
});
