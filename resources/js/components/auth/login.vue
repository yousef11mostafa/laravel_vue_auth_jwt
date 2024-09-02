<script setup>
import { computed, reactive,ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import layout from "../layouts/layout.vue";

const store=useStore();

 const form=reactive({
    email:'',
    password:'',
 });


const errors=computed(()=>store.state.auth.error);

const router=useRouter();

 const login =()=>{
    store.dispatch("auth/login",{router,credentials:form});

 }


</script>

<template>
  <layout>
    <div class="row justify-content-center" style="margin-top:100px;">
      <div class="col-md-6 col-lg-4">
        <div class="card">
          <div class="card-body">
             <p v-if="errors" class="text-danger text-center">{{errors}}</p>
            <h5 class="card-title text-center mb-4">Login</h5>
            <form @submit.prevent="login()">
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  placeholder="Enter your email"
                  v-model="form.email"
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="Enter your password"
                  v-model="form.password"
                />
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Login</button>
              </div>
            </form>
            <div class="mt-3 text-center">
             <router-link :to="{name:'passwordLink'}">Forgot your password?</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
