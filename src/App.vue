<template>
  <div id="app">
    <Pomodoro/>
  </div>
</template>

<script>
import Pomodoro from './components/Pomodoro.vue';

export default {
  name: 'app',
  components: {
    Pomodoro,
  },
};
</script>

<style lang="scss">
@import './sass/style.scss';
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 3em;
}
</style>
