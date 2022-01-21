<template>
  <v-app class="application">
    <v-sheet
      height="10vh">
        <div class="text-h2" style="text-align:center">
          Expenses
        </div>

    </v-sheet>

    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-spacer />

          <v-col
            cols="12"
            sm="10"
          >
            <v-sheet
              min-height="70vh"
              rounded="lg"
            >

              <viz :left="true" />


            </v-sheet>
          </v-col>

          <v-spacer />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Viz from './components/Viz.vue'
export default {
  name: 'App',

  components: {
    Viz
  },

  data: () => ({
    //
  }),
};
</script>
<style>
.application {
  font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
}
</style>