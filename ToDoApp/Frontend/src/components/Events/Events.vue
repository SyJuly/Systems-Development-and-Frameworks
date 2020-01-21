<template>
  <div class="events">
    <h3>Events</h3>
    <b-list-group>
      <b-list-group-item v-for="event in events" :key="event.id">
        <span >{{event.motto}}</span>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
  import { GET_ALL_EVENTS } from '../../graphql/queries'
  import { BListGroupItem, BListGroup } from 'bootstrap-vue'

  //inital setup
  let events = []

  export default {
    components: {
      'b-list-group' : BListGroup,
      'b-list-group-item' : BListGroupItem
    },
    data() {
      this.getEvents();
      return {
        events,
      }
    },
    methods: {
      getEvents(){
        this.$apollo
          .query({
            query: GET_ALL_EVENTS,
            variables: {}
          })
          .then((data) => {
            console.log(data)
            this.events = data.data.allEvents;
          })
      }
    }
  }
</script>

<style>
  .events{
    position: fixed;
    right:0;
    width: 100px;
    border: 2px solid #2c3e50;
    margin-top: 0%;
    margin-right: 5%;
    margin-left: 5%;
    padding: 6px;
  }
</style>
n
