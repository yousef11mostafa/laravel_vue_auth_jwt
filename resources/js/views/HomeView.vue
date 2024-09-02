<script setup>


import layout from '../components/layouts/layout.vue'
import { useStore } from 'vuex'
import { computed, } from 'vue';


 const store=useStore();


const user = computed({
  get: () => store.state.auth.user,
  set: (value) => {
    store.commit('auth/setuser', value);
  },
});










</script>

<template>
       
       <layout>
                 
                  <p class="text-danger mt-5">hello from home page</p>

                  <p> {{ user }} </p>
                  



           
       </layout>

</template>
