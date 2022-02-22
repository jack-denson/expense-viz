<template>
  <div>
    <v-dialog
      v-model="open"
      max-width="500px"
      persistent
    >
      <v-card>
        <v-card-title>
          <div class="text-h5" style="width:100%; text-align: center"> Add Expense</div>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >
                <v-text-field
                  outlined
                  v-model="editedItem.Name"
                  label="Name"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
              >
                <v-text-field
                  outlined
                  v-model="editedItem.Cost"
                  type="number"
                  prefix="$"
                  label="Cost"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
              >
                <v-select
                  :items="categories"
                  v-model="editedItem.Category"
                  outlined
                  label="Category"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            @click="editedItem={  Cost: 0, Category:'', Name:''}; $emit('close')"
          >
            Cancel
          </v-btn>
          <v-btn
            outlined
            @click="addExpense"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
</template>

<script>

export default {
  name: 'AddExpense',

  props: [ 'adding' ],

  data: function () {
    return {
      open: this.$props.adding,
      editedItem: {
        Cost: 0,
        Category: "",
        Name: ""
      },
      categories: [
        'Misc',
        'Transportation',
        'Entertainment',
        'Extras',
        'School',
        'Eating Out',
        'Groceries',
        'Alcohol',
        'Coffee',
        'Unknown'
      ]
    }
  },

  methods: {
    async addExpense() {
      if( this.editedItem.Category && this.editedItem.Name ) {

       const res = await fetch('api/add-expense', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify( this.editedItem )
        });
        const addedDoc = await res.json()
        if( res.status === 200 ){
          console.log("Successful add")
          this.$emit('addedDoc', addedDoc);
          this.$emit('close');
        }
        else {
          console.log("Unsuccessful add")
        }
      }


    }
  },

  watch: {
    adding: function ( newVal ) {
      this.open = newVal
    }
  },

  computed: {
  },


};
</script>
<style>
</style>