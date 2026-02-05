import { Injectable } from "@angular/core";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../api/firebase";

@Injectable({
  providedIn: "root"
})
export class TaskService {
  fetchTasks() {
    const q = query(collection(db, "tasks"), where("uid", "==", "idUser"));

    getDocs(q).then((tasks) => {
      tasks.docs.map((t) => {
        const data = t.data();
        console.log(data);
      });
    });
  }
}
