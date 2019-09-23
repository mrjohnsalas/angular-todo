import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Todo } from '../models/todo';
import { TodoService } from '../services/todo.service';
import { DocumentReference } from '@angular/fire/firestore';
import { TodoViewModel } from '../models/todo-view-model';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public activeModal: NgbActiveModal, private todoService: TodoService) { }

  todoForm: FormGroup;
  createMode: boolean = true;
  todo: TodoViewModel;

  ngOnInit() {
    this.todoForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      done: false
    });

    if(!this.createMode) {
      this.loadTodo(this.todo);
    }
  }

  loadTodo(todo) {
    this.todoForm.patchValue(todo);
  }

  saveTodo(){
    if(this.todoForm.invalid){
      return;
    }

    if(this.createMode) {
      let todo: Todo = this.todoForm.value;
      todo.lastModifiedDate = new Date();
      todo.createDate = todo.lastModifiedDate;
      this.todoService.saveTodo(todo)
      .then(response => this.handleSuccessFullSaveTodo(response, todo))
      .catch(error => console.error(error));
    } else {
      let todo: TodoViewModel = this.todoForm.value;
      todo.id = this.todo.id;
      todo.lastModifiedDate = new Date();
      this.todoService.editTodo(todo)
      .then(() => this.handleSuccessFullEditTodo(todo))
      .catch(error => console.error(error));
    }
  }

  handleSuccessFullSaveTodo(response: DocumentReference, todo: Todo){
    this.activeModal.dismiss({todo: todo, id: response.id, createMode: true});
  }

  handleSuccessFullEditTodo(todo: TodoViewModel) {
    this.activeModal.dismiss({todo: todo, id: todo.id, createMode: false});
  }
}
