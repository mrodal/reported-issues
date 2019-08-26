<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        wachuweri
        <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
</template>

<script>
  // @ is an alias to /src
  import HelloWorld from '@/components/HelloWorld.vue'
  import Home from './Home'

  export default {
    extends: Home,
    name: 'home',
    components: {
      HelloWorld
    },
    data: function () {
      return {

      }
    },
    mounted(){
      console.log('home22')
    }

  }
</script>
