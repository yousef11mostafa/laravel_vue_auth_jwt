
<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router"
import { useStore } from "vuex"

const store=useStore();


const router=useRouter();
const logout=()=>{
     store.dispatch("auth/logout",router);
}

const isAuthenticated=store.getters["auth/isAuthenticated"];
const user=computed(()=>store.state.auth.user);


</script>

<template>
  <nav class="navbar navbar-expand-lg bg-primary">
    <div class="container">
      <router-link v-if="!isAuthenticated" to="/" class="navbar-brand text-white" >Navbar</router-link>
      <router-link v-if="isAuthenticated" to="/" class="navbar-brand text-white" >{{user.name}}</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <!-- <li class="nav-item">
            <router-link to="/login"  class="nav-link text-white active" aria-current="page" >login</router-link>
          </li>
          <li class="nav-item" >
            <router-link to="/register" class="nav-link text-white active" aria-current="page">register</router-link>
          </li>
          <li class="nav-item" >
            <a  href="#" @click.prevent="logout()" class="nav-link text-white active" aria-current="page">logout</a>
          </li> -->
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link to="/login"  class="nav-link text-white active" aria-current="page" >login</router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link to="/register" class="nav-link text-white active" aria-current="page">register</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <a  href="#" @click.prevent="logout()" class="nav-link text-white active" aria-current="page">logout</a>
          </li>
          <li class="nav-item">
            <router-link to="/posts" class="nav-link text-white active" aria-current="page">posts</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

