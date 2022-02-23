<template>
  <div>
    <v-main class="grey lighten-3">
      <v-container>

        <v-row>
          <v-spacer />

          <v-col
            cols="12"
            sm="10"
          >
            <v-sheet
              min-height="90vh"
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
                      :week="lastSun"/>
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
                <v-row>
                  <v-btn outlined style="margin-left: 30px" @click="table=!table">
                    <v-icon>{{ !table ? 'mdi-table-large' : 'mdi-chart-areaspline' }} </v-icon>
                  </v-btn>
                 <v-btn outlined style="margin-left: 30px" @click="adding=true">
                    <v-icon> mdi-plus </v-icon>
                  </v-btn>
                </v-row>
              </v-container>
              <div v-if="!table">
                <viz v-for="spec, index of specs" 
                    :key="JSON.stringify(spec)" 
                    :left="index % 2 == 0"
                    :data="expenses"
                    :preprocessor="spec.preprocessor"
                    :spec="spec.schema"
                      :idNum="index"
                      :day="day"/>
              </div>
              <div v-else>
                  <v-data-table
                    :headers="tableHeaders"
                    :items="tableData"
                    :items-per-page="-1"
                    hide-default-footer
                  >
                    <template v-slot:item.Category="{ item }">
                      <v-chip
                        :color="getColor(item.Category)"
                      >
                        {{ item.Category }}
                      </v-chip>
                    </template>
                    <template v-slot:item.actions="{ item }">
                      <v-icon
                        small
                        @click="deleteExpense(item)"
                      >
                        mdi-delete
                      </v-icon>
                    </template>
                  </v-data-table>

              </div>
              <AddExpense 
                :adding="adding"
                @close="adding=false"
                @addedDoc="addDoc"/>
            </v-sheet>
          </v-col>

          <v-spacer />
        </v-row>
      </v-container>
    </v-main>
    </div>
</template>

<script>
import Viz from './components/Viz.vue'
import Total from './components/Total.vue'
import AddExpense from './components/AddExpense.vue'
import preprocess from './preprocess'

export default {
  name: 'Expenses',

  components: {
    Viz, Total, AddExpense
  },

  props: [ 'loggedIn' ],

  data: () => {
    return {
      expenses: {},
      specs: {},
      day: new Date(),
      table: false,
      tableHeaders: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'Name',
        },
        { text: 'Price', value: 'Cost' },
        { text: 'Category', value: 'Category'},
        { text: 'Time', value: 'created_time'},
        { text: 'Delete', value: 'actions', sortable: false }
      ],
      colors: {},
      adding: false
    }
  },

  methods: {
    async getExpenses() {
      const raw = await fetch("/data")
      this.expenses = await raw.json()
    },
    async getSpecs() {
      const raw = await fetch("/specs")
      this.specs = await raw.json()
    },
    setDay(dir) {
      this.day.setDate(this.day.getDate() + 7 * (dir * 2 - 1));
      // 4 reactivity purposes
      this.day = new Date( this.day );
    },
    async getData() {
      await this.getExpenses();
      await this.getSpecs();
    },
    getColor( cat ) {
      if( !this.colors[cat] ) {
        this.colors[cat] = `hsl(${Math.random()*300}, 90%, 75%)`
      }
      return this.colors[cat]
    },
    async deleteExpense( expense ) {
      const res = await fetch('/delete-expense', {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id: expense._id})
      });
      if( res.status === 200 ){
        console.log("Successful delete")

        const week = preprocess.getLastSunday(expense.created_time).toLocaleDateString();

        let index = -1;
        for( const i in this.expenses[ week ]) {
          if(this.expenses[week][i]._id === expense._id) {
            index = i
          }
        }
        if( index != -1 ) {
          this.expenses[ week ].splice(index, 1)
        }
      }
      else {
        console.log("Unsuccessful delete")
      }
    },

    addDoc( doc ) {
      const week = preprocess.getLastSunday(doc.created_time).toLocaleDateString();

      if( !this.expenses[ week ]) {
        this.expenses[ week ] = []
      }
      this.expenses[ week ].push( doc )
    }
  },

  watch: {
    loggedIn: function (newVal) {
      if( newVal ) {
        this.getData();
      }
    }
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
    },

    tableData: function() {
      return (this.expenses[ this.lastSun ] || []).map( exp => {
        return {
          ...exp,
          Cost: '$' + exp.Cost.toFixed(2),
          created_time: new Date(exp.created_time).toLocaleString()
        }
      })
    }
  },

  async beforeMount() {
    if( this.$props.loggedIn ) {
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