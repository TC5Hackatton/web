import { Injectable } from "@angular/core";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  orderBy,
  limit
} from "firebase/firestore";
import { db, auth } from "../../infrastructure/config/firebase.config";
import { Task, TaskStatus } from "../../domain/models/task.model";
import { TaskRepository } from "../../domain/repositories/task.repository";
import { TaskMapper } from "../mappers/task-mapper";
import { TaskDTO } from "../dtos/task-dto";

@Injectable({
  providedIn: "root"
})
export class FirebaseTaskRepository implements TaskRepository {
  async getTasks(): Promise<Task[]> {
    const user = auth.currentUser;
    if (!user) return [];

    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("uid", "==", user.uid), orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data() as TaskDTO;
      return TaskMapper.fromDtoToDomain({ ...data, id: doc.id });
    });
  }

  async addTask(
    title: string,
    description: string,
    timeType: "cronometro" | "tempo_fixo",
    timeValue: number,
    timeSpent: number,
    status: TaskStatus = "todo",
    statusChangedAt?: Date
  ) {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const taskDto: TaskDTO = {
      uid: user.uid,
      title,
      description,
      timeType,
      timeValue,
      timeSpend: timeSpent,
      status,
      createdAt: new Date(),
      statusChangedAt: statusChangedAt ?? null
    };

    await addDoc(collection(db, "tasks"), taskDto);
  }

  async updateTask(task: Task): Promise<void> {
    if (!task.id) throw new Error("Task ID is required for update");

    const taskRef = doc(db, "tasks", task.id);
    const taskDto = TaskMapper.fromDomainToDto(task);

    await updateDoc(taskRef, {
      status: taskDto.status,
      timeSpend: taskDto.timeSpend,
      statusChangedAt: taskDto.statusChangedAt ?? null
    });
  }

  async getOldestTodoTask(): Promise<Task | null> {
    const user = auth.currentUser;
    if (!user) return null;

    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("uid", "==", user.uid),
      where("status", "==", "todo"),
      orderBy("createdAt", "asc"),
      limit(1)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    const data = docSnap.data() as TaskDTO;
    return TaskMapper.fromDtoToDomain({ ...data, id: docSnap.id });
  }
}
