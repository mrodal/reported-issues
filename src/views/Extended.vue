<template extends="@/views/BaseWidget.vue">
    <extensions>
        <extension>
            <select v-model="country">
                <option v-for="country in countries" :value="country">
                    {{ country }}
                </option>
            </select>
            <br>
            [Here goes the mapa of {{country}}]
        </extension>
        <extension point="footer">
            Map widget footer
        </extension>
    </extensions>
</template>

<script>
  import BaseWidget from '@/views/BaseWidget.vue'

  export default {
    extends: BaseWidget,
    name: 'MapWidget',
    data: function () {
      return {
        country: '',
        countries: [
          'Uruguay',
          'Italy',
          'Argentina',
        ]
      }
    },
    watch: {
      country: function(){
        this.title = 'Map of ' + this.country;
      }
    },
    mounted(){
      console.log('mapwidget')
      this.country = this.countries[0];
    }
  }
</script>