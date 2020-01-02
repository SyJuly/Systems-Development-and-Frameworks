<template>
  <div v-show="!isLoggedIn">
    <div class='flex flex-column'>
      <input
        v-show="!canLogin"
        v-model="name"
        type="text"
        placeholder="Your name">
      <input
        v-model="email"
        type="text"
        placeholder="Your email address">
      <input
        v-model="password"
        type="password"
        placeholder="Password">
      <b-button @click="authenticate" >{{canLogin ? 'Login' : 'Sign Up'}}</b-button>
    </div>
    <div class='flex mt3'>
      <div
        class='pointer button'
        @click="canLogin = !canLogin">
        {{canLogin ? 'need to create an account?' : 'already have an account?'}}
      </div>
    </div>
  </div>
</template>

<script>

  import { BButton } from 'bootstrap-vue'
  import { LOGIN } from '../../graphql/queries'

  export default {
    name: 'AppLogin',
    components: {
      'b-button' : BButton,
    },
    data () {
      return {
        email: '',
        canLogin: true,
        isLoggedIn: false,
        name: '',
        password: ''
      }
    },
    methods: {
      authenticate () {
        if(this.isLoggedIn){ return}
        if (this.canLogin){
          this.login();
        } else {
          this.signup();
        }
      },
      login(){
        this.$apollo
          .mutate({
            mutation: LOGIN,
            variables: {
              email: this.email,
              password: this.password
            }
          })
          .then((data) => {
            console.log(data);
            localStorage.setItem("auth-token", data.data.login);
            this.isLoggedIn = true;
          })
      },
      signup(){
        //
      }
    }
  }
</script>
