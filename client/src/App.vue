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

              <v-container>
                <v-row>
                  <v-spacer />
                  <v-col>
                    <Total :projection="false" :spent="weekTotal" :week="lastSun"/>
                  </v-col>
                  <v-spacer />
                  <v-col>
                    <Total :projection="true" :spent="Math.round((weekTotal / weekPctg) * 100)/100" :week="lastSun"/>
                  </v-col>
                  <v-spacer />
                </v-row>
              
              </v-container>

              <viz v-for="spec, index of specs" 
                   :key="JSON.stringify(spec)" 
                   :left="index % 2 == 0"
                   :data="expenses"
                   :preprocessor="spec.preprocessor"
                   :spec="spec.schema"
                   :idNum="index" />


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
import Total from './components/Total.vue'
import preprocess from './preprocess'

export default {
  name: 'App',

  components: {
    Viz, Total
  },

  data: () => {
    return {
      expenses: {},
      specs: {},
    }
  },

  methods: {
    async getExpenses() {
      const raw = await fetch("http://localhost:4000/data")
      this.expenses = await raw.json()
    },
    async getSpecs() {
      const raw = await fetch("http://localhost:4000/specs")
      this.specs = await raw.json()
    }
  },

  computed: {
    weekPctg: () => {
      return preprocess.howFarInWeek();
    },

    weekTotal: function() {
      return preprocess.thisWeekTotal(this.expenses);
    },

    lastSun: () => {
      return preprocess.getLastSunday().toLocaleDateString();
    }
  },

  async beforeMount() {
    await this.getExpenses();
    await this.getSpecs();
  }

};
</script>
<style>
.application {
  font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
}
</style>