<script setup>
// import useMenu from '../src/stores/menustore'
// const menuStore = useMenu()
// menuStore.addMenu()
</script>

<template>
  <div id="building"><router-view /></div>
</template>

<style>
#app {
  height: 100%;
}
#building {
  background: url('../image/20240518092129_1.jpg');
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}
</style>
