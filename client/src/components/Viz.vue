<template>
  <v-container>
    <v-row>
      <v-spacer v-if="!left" />
      <v-col
        cols="12"
        sm=10
        md="8"
      >
        <v-sheet
          rounded="lg"
          min-height="100"
          outlined
          min-width="100%"
          id="vl"
        >
        </v-sheet>
        <v-spacer v-if="left" />
      </v-col>

      <v-spacer />
    </v-row>
  </v-container>

 </template>

<script>

import embed from 'vega-embed';
export default {
  name: 'Viz',
  components: {
  },
  props: ['left'],

  methods: {

    async genViz() {
      const spec = {
        "data":
          {"values":
            [{"created_time":"2021-12-08T23:58:00.000Z",    "Category":"Groceries","Cost":18,"Name":"Extra chicken"},  {"created_time":"2021-12-08T03:03:00.000Z","Category":"Fun","Cost":11,"Name":"Movie Popcorn"},{"created_time":"2021-12-08T03:02:00.000Z","Category":"Misc","Cost":5.18,"Name":"Gatorade"},{"created_time":"2021-12-07T22:58:00.000Z","Category":"Eating Out","Cost":17.01,"Name":"Chipotle"},{"created_time":"2021-12-05T17:45:00.000Z","Category":"Groceries","Cost":32,"Name":"Sunday groceries"}]
          },
          "transform": [
             {"calculate": "datum.Name", "as": "Item"}
          ],
          "width": "container",
          "height": 110,
          "mark": {"type": "bar",
             "cornerRadius": 4,
             "height": 50},
          "encoding":{
             "x":{"aggregate":"sum",
             "field":"Cost",
              "axis": null
              },
          "color":{"field":"Item"}
          }
        }
      await embed('#vl', spec, {actions: false});
    }
  },

  beforeMount() {
    this.genViz();
  }

}
</script>

<style>

</style>
