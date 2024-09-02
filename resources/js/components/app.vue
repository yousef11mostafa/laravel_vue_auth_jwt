<template>


   <main>
     <router-view></router-view>
   </main>
</template>

<script setup>

import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
const store=useStore();
const router=useRouter();
const route=useRoute();
console.log(route);
store.dispatch('auth/autoLogin',{router,route});

</script>
