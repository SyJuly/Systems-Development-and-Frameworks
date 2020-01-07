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
  import ToDoItem from "../ToDoItem/ToDoItem.vue";
  import  * as utils from "../../utils/utils.js"
  import { GET_ALL_TODOS } from '../../graphql/queries'

  //inital setup
  let todos = []

  export default {
    components: {
      ToDoItem,
      'b-button' : BButton,
      'b-list-group' : BListGroup
    },
    data() {
      this.getTodos();
      return {
        todoTextInput: "",
        todos,
      }
    },
    methods: {
      getTodos(){
        this.$apollo
          .query({
            query: GET_ALL_TODOS,
            variables: {}
          })
          .then((data) => {
            this.todos = data.data.allTodos;
          })
      },
      addTodo() {
        const newTodo = {
          id: utils.generateID(),
          message: this.todoTextInput
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
