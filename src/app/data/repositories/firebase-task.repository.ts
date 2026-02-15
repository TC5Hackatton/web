import { Injectable } from "@angular/core";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../../infrastructure/config/firebase.config";
import { Task, TaskStatus } from "../../domain/models/task.model";
import { TaskRepository } from "../../domain/repositories/task.repository";

@Injectable({
  providedIn: "root"
})
export class FirebaseTaskRepository implements TaskRepository {
  async getTasks(): Promise<Task[]> {
    const user = auth.currentUser;
    if (!user) return [];

    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("uid", "==", user.uid));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data["uid"],
        title: data["title"],
        description: data["description"],
        timeType: data["time_type"],
        timeSpend: data["time_spend"],
        status: data["status"],
        createdAt: data["createdAt"]?.toDate ? data["createdAt"].toDate() : data["createdAt"]
      } as Task;
    });
  }

  async addTask(
    title: string,
    description: string,
    timeType: "minutes" | "tempo_fixo",
    timeSpent: number,
    status: TaskStatus = "todo"
  ) {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    await addDoc(collection(db, "tasks"), {
      uid: user.uid,
      title,
      description,
      time_spend: timeSpent,
      time_type: timeType,
      status,
      createdAt: new Date()
    });
  }

  async updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status: newStatus });
  }
}
