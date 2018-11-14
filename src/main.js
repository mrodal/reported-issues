import Vue from 'vue'
import App from './App.vue'
import { library } from "@fortawesome/fontawesome-svg-core";

// Bundles all
let iconName = 'Ambulance';
let i = import(`@fortawesome/free-solid-svg-icons/fa${iconName}.js`);

// Doesnt bundle the imported module
// let i = import(`@fortawesome/free-solid-svg-icons/faAmbulance`);

library.add(i);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
