<template>
  <v-app class="application">
    <Login 
      v-if="!loggedIn"
      @loginSuccess="getData()"/>
    <div v-else>
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
                    <v-col 
                      cols=1>
                      <v-btn
                        v-if="new Date(lastSun).getTime() != earliestWeek.getTime()"
                        small
                        outlined
                        @click="setDay(false)">
                        <v-icon> mdi-arrow-left-thin </v-icon>
                      </v-btn>
                    </v-col>
                    <v-spacer />
                    <v-col 
                      v-if="!mostRecent"
                      cols=1 
                      style="padding-left: 0px">
                      <v-btn
                        small
                        outlined
                        @click="setDay(true)">
                        <v-icon> mdi-arrow-right-thin </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                  <v-spacer />
                  <v-col>
                      <Total 
                      :projection="false" 
                      :spent="Math.round(weekTotal * 100)/100" 
                      :week="lastSun"
                      :key="test"/>
                  </v-col>
                  <v-spacer />
                  <v-col>
                      <Total 
                      v-if="mostRecent"
                      :projection="true" 
                      :spent="Math.round((weekTotal / weekPctg) * 100)/100" 
                      :week="lastSun"/>
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
                    :idNum="index"
                    :day="day"/>


            </v-sheet>
          </v-col>

          <v-spacer />
        </v-row>
      </v-container>
    </v-main>
    </div>
  </v-app>
</template>

<script>
import Viz from './components/Viz.vue'
import Total from './components/Total.vue'
import Login from './Login.vue'
import preprocess from './preprocess'

export default {
  name: 'App',

  components: {
    Viz, Total, Login
  },

  data: () => {
    return {
      loggedIn: false,
      expenses: {},
      specs: {},
      day: new Date(),
      test: 0
    }
  },

  methods: {
    async getExpenses() {
      const raw = await fetch("/api/data")
      this.expenses = await raw.json()
    },
    async getSpecs() {
      const raw = await fetch("/api/specs")
      this.specs = await raw.json()
    },
    setDay(dir) {
      this.day.setDate(this.day.getDate() + 7 * (dir * 2 - 1));
      // 4 reactivity purposes
      this.day = new Date( this.day );
    },
    async getData() {
      this.loggedIn = true;
      await this.getExpenses();
      await this.getSpecs();
    }
  },

  watch: {

  },

  computed: {
    weekPctg: function() {
      return preprocess.howFarInWeek(this.day);
    },

    weekTotal: function() {
      return preprocess.thisWeekTotal(this.expenses, this.day);
    },

    lastSun: function() {
      return preprocess.getLastSunday(this.day).toLocaleDateString();
    },

    mostRecent: function() {
      return new Date() - new Date(this.lastSun) < 1000 * 60 * 60 * 24 * 7
    },

    earliestWeek: function() {
      let earliest = new Date()
      for(const week in this.expenses) {
        if( new Date(week) < earliest) {
          earliest = new Date(week)
        }
      }
      return earliest
    }
  },

  async beforeMount() {
    const res = await fetch('api/user')
    this.loggedIn = res.status === 200
    if( this.loggedIn ) {
      this.getData()
    }
  }

};
</script>
<style>
.application {
  font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
}
</style>