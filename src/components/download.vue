<template>
  <a class="download" :download="filename" :href="`data:text/plain;charset=utf-8,${encodeURIComponent(this.data)}`" ref="link">
    <slot/>
  </a>
</template>

<script>
export default {
  props: {
    data: String,
    filename: String
  }
};
</script>

<style scoped>
.download {
  text-decoration: none;
}
</style>