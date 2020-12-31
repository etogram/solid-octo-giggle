import Vue from 'vue'
import App from './App.vue'
//import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { ButtonPlugin } from 'bootstrap-vue'
Vue.use(ButtonPlugin)
import { FormSpinbuttonPlugin } from 'bootstrap-vue'
Vue.use(FormSpinbuttonPlugin)
import { ListGroupPlugin } from 'bootstrap-vue'
Vue.use(ListGroupPlugin)
import { InputGroupPlugin } from 'bootstrap-vue'
Vue.use(InputGroupPlugin)
import { DropdownPlugin } from 'bootstrap-vue'
Vue.use(DropdownPlugin)
import { FormInputPlugin } from 'bootstrap-vue'
Vue.use(FormInputPlugin)
import { IconsPlugin } from 'bootstrap-vue'
Vue.use(IconsPlugin)
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueResource from 'vue-resource';

Vue.config.productionTip = false
Vue.use(VueResource);

//Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.prototype.$io = io//euh si c'est pas mal finalement pas bo il faut Vue.use

if (process.env.NODE_ENV=='production'){
    console.log('------------ production mode --------------')
    console.log = function(){} //override the log function
}else{
    console.log('------------ development mode --------------')
}

new Vue({
    render: h => h(App),
}).$mount('#app')
