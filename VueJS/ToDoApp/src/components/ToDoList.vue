<template>
  <div class="todoList">
    <div class="newTodo">
      <input v-model="todoTextInput" placeholder="Add a To-Do" @keydown.enter="addTodo">
      <b-button variant="success" @click="addTodo" >Add new To-Do</b-button>
    </div>
      <b-list-group>
      <ToDoItem
        v-for="todo in todos" :key="todo.id"
        :todo="todo"
        @editTodo="editTodo"
        @removeTodo="removeTodo"
      />
    </b-list-group>
  </div>
</template>

<script>
  import { BButton, BListGroup } from 'bootstrap-vue'
  import ToDoItem from "./ToDoItem.vue";
  import  * as utils from "./../utils/utils.js"

  //inital setup
  let todos = [...Array(10).keys()].map(id => ({ id, text: "Example of a note" }))

  export default {
    components: {
      ToDoItem,
      'b-button' : BButton,
      'b-list-group' : BListGroup
    },
    data() {
      return {
        todoTextInput: "",
        todos,
      }
    },
    methods: {
      addTodo() {
        const newTodo = {
          id: utils.generateID(),
          text: this.todoTextInput
        }

        this.todos = [newTodo, ...this.todos];
      },
        editTodo(todoUpdate) {
            this.todos=this.todos.map(todo =>{
                return todo.id===todoUpdate.id? todoUpdate:todo;
        })
        },
      removeTodo(todoId) {
        this.todos = this.todos.filter(todo => {
          return todo.id !== todoId
        });
      }
    }
  }
</script>

<style>
  .todoList{
    margin-right: 5%;
    margin-left: 5%
  }

  .newTodo{
    margin-top: 50px;
    margin-bottom: 40px
  }
</style>
