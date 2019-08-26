<template extends="./Extended.vue">
    <extensions>
        <extension point="map-data">
            Poblacion de {{lugar}} es:  3.00032903
        </extension>
    </extensions>
</template>

<script>
    import Extended from './Extended.vue'
    export default {
        extends:Extended,
        name: 'extended2',
        data: function(){
            return {}
        },
        mounted(){
            // console.log('e2')
        }
    }
</script>