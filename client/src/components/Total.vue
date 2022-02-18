<template>
  <v-sheet 
    outlined
    rounded="xl"
    style="min-height:150px">
    <div
        class="text-overline totalNum"
        style="text-align:center; margin-top:17px"
    >
        {{ $props.projection ? "Projected" : "Total Spent" }}
    </div>
    <div
        class="text-h2 totalNum"
        style="text-align:center"
    >
        {{ '$' + $props.spent }}
    </div>
        <div
        class="text-overline totalNum"
        style="text-align:center"
    >
        Week of {{ $props.week }}
    </div>
  </v-sheet>

</template>

<script>

export default {
  name: 'Total',
  components: {
  },
  props: ['spent', 'projection', 'week'],

  methods: {
  },

  mounted() {
  }

}
</script>

<style>
.totalNum{
    color: #0f940f
}
</style>
