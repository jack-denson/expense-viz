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
          :id="'vl'+$props.idNum"
        >
        </v-sheet>
      </v-col>
      <v-spacer v-if="left" />

    </v-row>
  </v-container>

 </template>

<script>

import embed from 'vega-embed';
import preprocess from '../preprocess'
export default {
  name: 'Viz',
  components: {
  },
  props: ['left', 'spec', 'data', 'preprocessor', 'idNum'],

  methods: {

    async genViz() {
      let spec = this.$props.spec
      const preprocessor = preprocess[this.$props.preprocessor]
      spec.data.values = preprocessor(this.$props.data)
      await embed('#vl'+this.$props.idNum, spec, {actions: true});
    }
  },

  mounted() {
    this.genViz()
  }

}
</script>

<style>

</style>
