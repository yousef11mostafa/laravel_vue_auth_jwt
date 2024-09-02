



const  actions = {
    
      async register(context,{router,data}){
         try{
          console.log(data);
          let response= await axiosInstance.post('user/register',data);
          // let response= await axios.post('user/register',data);
          context.commit("seterrors",'');
           router.push("/login");
         }catch(e){
          if(e.response.status===422){
              // errors.value=e.response.data.errors;
              
              context.commit("seterrors",e.response.data.errors);
          }
      }
     },


     async login(context ,{router,data}){
      try{
        let response= await axiosInstance.post('user/login',data);
        // let response= await axios.post('user/login',data);
        // console.log(response.data);
        localStorage.setItem("token",response.data.access_token);
        context.commit("authsuccess",response.data.access_token);
        context.commit("setuser",response.data.user);
        context.commit("seterrors",'');
        router.push('/');
      }catch(e){
          // errors.value=e.response.data.errors;
          localStorage.removeItem("token");
          context.commit("seterrors",e);
      }         

     },



     async autoLogin(context,router) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axiosInstance.post('user/me'); // Replace with your endpoint to fetch user data
          console.log(response.data);
          context.commit('authsuccess', token);
          context.commit('setuser', {
            "id": response.data.id,
            "name": response.data.name,
            "email": response.data.email,
            "email_verified_at":response.data.email_verified_at,
            "created_at": response.created_at,
            "updated_at": response.data.updated_at,
        });
          router.push("/");
        } 
        catch (error) {
          localStorage.removeItem("token");
          context.commit('autherror');
          router.push("/");
          console.error('Auto-login failed:', error);
        }
      }
    },



     async logout(context,router){
        await  axiosInstance.post("user/logout");
        localStorage.removeItem("token");
        context.commit("autherror");
        context.commit("setuser",'');
        router.push("login");
     }


  



   }


  export default actions;