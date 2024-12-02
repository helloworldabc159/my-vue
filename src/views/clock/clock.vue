<template>
  <div>
    <iframe
      src="./index.html"
      frameborder="0"
      width="100%"
      height="600px"
      ref="fIframe"
    >
    </iframe>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const fIframe = ref()
</script>

<style scoped></style>
