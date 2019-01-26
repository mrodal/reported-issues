<template>
    <div class="hello">
        <h1>Extended component</h1>
    </div>
</template>

<script>
  import Base from './Base'

  export default {
    name: 'Extended',
    extends: Base,
    props: {
      msg: String
    },
    mounted() {
      console.log('extendedo')
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
