import { identifierName } from '@angular/compiler';
import { Component, OnInit,HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule
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
     DragDropModule,  // this import the drag and drop module
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
   /** Page title */
  title : string = "My Task List";
   /** Array of tasks displayed in the list */
  tasks: Task[]=[];

  contextMenuVisible = false;
  menuX = 0;
  menuY = 0;
  contextMenuTask?: Task;


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
   * Delete a task from the list after user confirmation.
   * @param task Task to be deleted.
   */
  deleteTask(task: Task): void {
    if (!task) return;
    if (!confirm(`Delete "${task.task}"?`)) return;

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
  
showContextMenu(data: { event: MouseEvent; task: Task }) {
  this.contextMenuVisible = true;
  this.menuX = data.event.clientX;
  this.menuY = data.event.clientY;
  this.contextMenuTask = data.task;
}

@HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Check if the click target is outside the context menu
    const target = event.target as HTMLElement;
    const contextMenu = document.querySelector('.context-menu');
    if (this.contextMenuVisible && contextMenu && !contextMenu.contains(target)) {
      this.hideContextMenu();
    }
  }

hideContextMenu() {
  this.contextMenuVisible = false;
}

get sortedTasks() {
  return this.tasks.slice().sort((a, b) => Number(a.checked) - Number(b.checked));
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

}
