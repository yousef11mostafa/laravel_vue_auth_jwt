<script setup>
import { computed, reactive,ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import layout from "../layouts/layout.vue";

const store=useStore();


  const  route = useRoute();

  console.log(route.query.email)


 const data=reactive({
    email:route.query.email || '',
    password:'',
    password_confirmation:'',
    token:route.query.token || '',
 });



const errors=computed(()=>store.state.auth.error);

const router=useRouter();

 const reset =()=>{
    store.dispatch("auth/resetPassword",{router,data:data});

 }







</script>

<template>
  <layout>
    <div class="row justify-content-center" style="margin-top:100px;">
  <div class="col-md-8 col-lg-5">
        <div class="card">
          <div class="card-body">
           
                   <p class="text-center text-success" v-if=" errors && errors.message" >{{errors.message}}</p>
              <p class="text-center text-success" v-if=" errors && errors.error" >{{errors.error}}</p>

            <h5 class="card-title text-center mb-4">password-reset</h5>
            <form @submit.prevent="reset()">
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" placeholder="Enter your email"  v-model="data.email">

              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Enter your password"  v-model="data.password">

              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm your password"  v-model="data.password_confirmation">

              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">reset password</button>
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
