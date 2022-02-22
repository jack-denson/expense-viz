<template>
  <v-app class="application">
    <div class="text-h2" style="text-align:center">
      Expenses
    </div>
    <Login 
      v-if="!loggedIn"
      @loginSuccess="loggedIn=true"/>
    <Expenses
      v-else
      :loggedIn="loggedIn"/>
  </v-app>
</template>

<script>
import Expenses from './Expenses.vue'
import Login from './Login.vue'


export default {
  name: 'App',

  components: {
    Login, Expenses
  },

  data: () => {
    return {
      loggedIn: false
    }
  },


  async beforeMount() {
    document.title="Expense Tracker"
    const res = await fetch('api/user')
    this.loggedIn = res.status === 200
  }

};
</script>
<style>
.application {
  font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
}
</style>