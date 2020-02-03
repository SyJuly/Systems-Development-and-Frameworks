<template>
  <div> <--has to return exactly one element-->
    <span v-if="interactive">
      <p>Original message: "{{ message }}"</p>
      <p>Computed reversed message: "{{ reversedMessage }}"</p>
      <li v-for="a in array">
        {{ a }}
      </li>
      <input v-model="message" @keydown.enter="save">
    </span>
    <span v-else>
      <MyComponent title="StaticProp"></MyComponent>
      <MyComponent v-bind:title="props.title"></MyComponent><--dynamic prop-->
    </span>
    <button @click="$emit('OnMessageConfirmed', message)">Confirm</button> <--event-->
  </div>
</template>

<script>
  export default {
    components: {}, // i.e. TodoItem
    props:{ // prop validation
      title: String,
      OnMessageConfirmed: Function,
    },
    data() { //own state
      return {
        message: "Hello",
        array: [1, 2, 3],
        interactive: true,
        //reversedMessage: ""
      }
    },
    mounted: function(){}, //LC
    computed: {
      //better than in methods because computed properties
      //are cached based on their reactive dependencies
      reversedMessage: function () {
        return this.message.split('').reverse().join('')
      } // reversedMessage: {get: ()=>{}, set: ()=>}
    },
    watch:{
      // reversedMessage: function(msg){...}
      // --> imperative and repetitive in comparison to computed props
      // --> use when performing async or expensive operations to change data
    },
    methods: {
      // reversedMessage: function(msg){...} --> would be called on each re-render
      save(){}
    }
  }
</script>
