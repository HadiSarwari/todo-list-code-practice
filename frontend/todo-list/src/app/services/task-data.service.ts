import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Handles all CRUD operations for tasks by communicating with the backend API.
 */

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {  
 /** Base URL of the backend API */
  private baseUrl = 'https://localhost:7181';
  constructor(private http: HttpClient){}

 /**
   * Fetch all tasks from the backend.
   * @returns Observable that emits an array of Task objects.
   */
 getTasks(): Observable<Task[]>{
    return this.http.get<Task[]>(`${this.baseUrl}/items`);
  }
  
  /**
   * Add a new task to the backend.
   * @param task Task object to be created.
   * @returns Observable that emits the created Task object.
   */
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/items`, task);
  }

/**
   * Delete a task by ID from the backend.
   * @param id The ID of the task to delete.
   * @returns Observable that completes when deletion is successful.
   */
    deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items/${id}`);
  }

// Sends a PUT request to update an existing task on the backend
  updateTask(task: Task): Observable<Task> {
  // API URL with item ID
  return this.http.put<Task>(`${this.baseUrl}/items/${task.id}`, task);
}
}

