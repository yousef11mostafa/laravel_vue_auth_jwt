<script setup>
import { computed, reactive,ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import layout from "../layouts/layout.vue";

const store=useStore();

 const form=reactive({
    email:'',
 });



const errors=computed(()=>store.state.auth.error);
const router=useRouter();

 const sendlink=()=>{
        store.dispatch("auth/sendPasswordResetLink",form);

 }



</script>

<template>
  <layout>
    <div class="row justify-content-center" style="margin-top:100px;">
      <div class="col-md-6 col-lg-4">
        <div class="card">



          <div class="card-body">
           
              <p class="text-center text-success" v-if=" errors && errors.message" >{{errors.message}}</p>
              <p class="text-center text-success" v-if=" errors && errors.error" >{{errors.error}}</p>
               <!-- <div class="mt-3 text-center">
             <router-link :to="{name:'passwordReset', query: { token: 'f96f9ad384724cc7cc0dde72946451c93fa7a344f86a508b8fd8e53e04d416f9', email: 'yousefmostafanawar%40gmail.com' } }">Reset password after send link</router-link>
            </div> -->


            <h5 class="card-title text-center mb-4">Login</h5>
            <form @submit.prevent="sendlink()">
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

              <div class="d-grid">
                <button type="submit" class="btn btn-primary">send link</button>
              </div>
            </form>
            <div class="mt-3 text-center">
              <!-- <router-link href="#">Forgot your password?</router-link> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
