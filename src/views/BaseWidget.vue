<template extendable>
    <div>
        <h2>{{title}}</h2>
        <extension-point>This widget has nothing to show</extension-point>
        <div>
            <extension-point name="footer">Default footer</extension-point>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'BaseWidget',
    data: function () {
      return {
        title: 'Empty widget'
      }
    },
    mounted(){
      console.log('basewidget2')
    }
  }
</script>