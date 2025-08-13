import { identifierName } from '@angular/compiler';
import { Component, OnInit,HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; // Common Angular directives (e.g., ngIf/ngFor).
import { TaskTileComponent } from '../task-tile.component/task-tile.component';
import { Task } from '../models/task.model';
import { TaskDataService } from '../services/task-data.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

/**
 * Main task list component — handles loading, adding, deleting,
 * and reordering tasks.
 */
@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    TaskTileComponent,
     DragDropModule,  // Angular CDK drag & drop
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
   /** Page title */
  title : string = "My Task List";
  /** Whether the completed section is expanded. */
  showCompleted = true;
  /** Tasks currently displayed in the list. */
  tasks: Task[]=[];

  contextMenuVisible = false;
  menuX = 0;
  menuY = 0;
  contextMenuTask?: Task;
  addTypingClass: any;

  // Delete-confirmation modal state
  confirmVisible = false;
  pendingDeleteTask: Task | null = null;
  
  // Open the confirm modal
  requestDelete(task: Task) {
    this.pendingDeleteTask = task;
    this.confirmVisible = true;
    this.hideContextMenu(); // close menu if it’s open
  }

    // User clicked "Delete"
  confirmDelete() {
     const t = this.pendingDeleteTask;
    if (!t) return;
    // close modal first, then delete
    this.confirmVisible = false;
    this.pendingDeleteTask = null;
    this.deleteTask(t); 

}

// User clicked "Cancel" or backdrop
cancelDelete() {
  this.confirmVisible = false;
  this.pendingDeleteTask = null;
}



  constructor(private taskDataService: TaskDataService){  }

  /**
  * Lifecycle hook — loads tasks when the component initializes.
  */
  ngOnInit(): void{
    this.taskDataService.getTasks().subscribe({
      next: (tasks) =>{
        console.log('tasks loaded from API:',tasks)
        this.tasks=tasks;        
      },
      error:(err) => {
        alert("Error loading items");
      }
      }
    );
  }

  /**
   * Add a new task to the list.
   * @param taskDescription Text for the new task.
   */
  addTask(taskDescription:string): void
  {
    const trimmed=taskDescription.trim();
    if (!trimmed) return;

    const newItem: Task = {
      id: 0, // ID will be assigned by the backend
      task: trimmed,
      checked: false
    };
    this.taskDataService.addTask(newItem).subscribe({
      next: task => {
        this.tasks.push(task);        
      },
      error: err => alert("Error adding item")
    });


  }
 /**
   * Delete a task after user confirmation via modal.
   * @param task Task to be deleted.
   */
  deleteTask(task: Task): void {
    this.taskDataService.deleteTask(task.id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(i => i.id !== task.id);
      },
      error: err => alert("Error deleting item")
    });
  }




  /**
   * Handles drag-and-drop reordering of tasks.
   * @param event DragDrop event containing the previous and new positions.
   */
  drop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }

  /**
   * TrackBy function for better rendering performance with *ngFor.
   * @param index Index of the task in the array.
   * @param task The task object.
   * @returns The unique task ID.
   */
  trackById(index: number, task: Task): number {
  return task.id;
}
  

/** Opens the context menu at the cursor for the given task. */
showContextMenu(data: { event: MouseEvent; task: Task }) {
  this.contextMenuVisible = true;
  this.menuX = data.event.clientX;
  this.menuY = data.event.clientY;
  this.contextMenuTask = data.task;
}

@HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // only left-click closes
  if (event.button !== 0) return;
    // Check if the click target is outside the context menu
    const menu = document.getElementById('context-menu');
  if (this.contextMenuVisible && menu && !menu.contains(event.target as Node)) {
    this.contextMenuVisible = false;
  }
  }

/** Hides the context menu if open. */
hideContextMenu() {
  this.contextMenuVisible = false;
}

toggleChecked(task: Task) {
  task.checked = !task.checked;

  // Call update API to save change
  this.taskDataService.updateTask(task).subscribe({
    next: updatedTask => {
      // Replace the task in the local array with the updated task from API
      // Using immutable assignment to trigger Angular change detection
      this.tasks = this.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    },
    error: err => {
      alert('Failed to update task status');
      // Optionally revert toggle if update fails
      task.checked = !task.checked;
    }
  });
}

/** Number of tasks marked as completed. */
get completedCount(): number {
  return this.tasks.reduce((n, t) => n + (t.checked ? 1 : 0), 0);
}
}
