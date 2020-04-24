<template>
  <canvas ref="canvas" />
</template>

<script>
//Imports
import qrcode from 'qrcode';

export default {
  props: {
    text: {
      required: true,
      type: String
    }
  },
  watch: {
    text: {
      deep: true,
      immediate: true,
      handler: function ()
      {
        this.$nextTick(() =>
        {
          qrcode.toCanvas(this.$refs.canvas, this.text);
        });
      }
    }
  }
};
</script>

<style>
</style>