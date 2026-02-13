import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TasksPage } from "./tasks";
import { TaskRepository } from "../../../domain/repositories/task.repository";

jest.mock("firebase/auth", () => ({ getAuth: jest.fn() }));
jest.mock("firebase/firestore", () => ({ getFirestore: jest.fn() }));
jest.mock("../../../infrastructure/config/firebase.config", () => ({ auth: {}, db: {} }));

describe("TasksPage", () => {
  let component: TasksPage;
  let fixture: ComponentFixture<TasksPage>;
  let taskRepositorySpy: { getTasks: jest.Mock; updateTaskStatus: jest.Mock; addTask: jest.Mock };

  beforeEach(async () => {
    taskRepositorySpy = {
      getTasks: jest.fn().mockResolvedValue([]),
      updateTaskStatus: jest.fn(),
      addTask: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TasksPage],
      providers: [{ provide: TaskRepository, useValue: taskRepositorySpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
