<template>
  <div id="app">
    <AppLogin/>
    <img src="./assets/logo.png">
    <h1>Simple Todo App</h1>
    <ToDoList/>
  </div>
</template>

<script>
  import ToDoList from "./components/ToDoList/ToDoList.vue";
  import AppLogin from "./components/AppLogin/AppLogin.vue";
  export default {
    components: {
      AppLogin,
      ToDoList,
    },
  }
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1{
  font-weight: normal;
}
</style>
