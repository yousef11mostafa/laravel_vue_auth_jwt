<script setup>
import { computed, reactive,ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import layout from "../layouts/layout.vue";

const store=useStore();

 const data=reactive({
    name:'',
    email:'',
    password:'',
    password_confirmation:'',
 });


const errors=computed(()=>store.state.auth.error);

const router=useRouter();

 const register =()=>{
    store.dispatch("auth/register",{router,user:data});

 }







</script>

<template>
  <layout>
    <div class="row justify-content-center" style="margin-top:100px;">
  <div class="col-md-8 col-lg-5">
        <div class="card">
          <div class="card-body">
            <!-- {{ errors }} -->
            <h5 class="card-title text-center mb-4">Register</h5>
            <form @submit.prevent="register()">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" placeholder="Enter your name" v-model="data.name">
                <p v-if="errors && errors.name" class="text-danger">{{errors.name[0]}}</p>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" placeholder="Enter your email"  v-model="data.email">
                  <p v-if="errors && errors.email" class="text-danger">{{errors.email[0]}}</p>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Enter your password"  v-model="data.password">
                <p v-if="errors && errors.password[0]" class="text-danger">{{errors.password[0]}}</p>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm your password"  v-model="data.password_confirmation">

              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Register</button>
              </div>
            </form>
            <div class="mt-3 text-center">
              <p>Already have an account? <router-link to="/login">Login here</router-link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
