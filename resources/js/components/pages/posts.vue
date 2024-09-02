<script setup>
import layout from "../layouts/layout.vue";
import axiosInstance from '../../axios';
import { onMounted, ref } from "vue";


 let data=ref("");


  const getposts=async()=>{
     try{
    let response= await axiosInstance.get("user/posts");
    data.value=response.data;
    
  }catch(e){
    console.log("failed to fetch posts");
  }

    }

    onMounted(()=>{
      getposts();
    });

</script>

<template>
  <layout>
         <p class="text-primary">this is posts page</p>
         {{ data.data }}
         <ul v-if="data.data">
          <li v-for="post in data.data" :key="post.id" > {{post.name}}</li>
         </ul>
  </layout>
</template>
