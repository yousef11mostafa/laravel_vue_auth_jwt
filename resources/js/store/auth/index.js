// import getters  from "./getters";
// import mutations  from "./mutations";
// import actions  from "./actions";

import axios from "axios";
import axiosInstance from "../../axios";

export default {
    namespaced: true,
    state: {
        user: null,
        status: "",
        error: null,
        refreshTimeout: null, // To store the timeout ID for auto-refresh
    },
    mutations: {
        AUTH_REQUEST(state) {
            state.status = "loading";
            state.error = null;
        },
        AUTH_SUCCESS(state, user) {
            state.status = "success";
            state.user = user;
            state.error = null;
        },
        AUTH_ERROR(state, error) {
            state.status = "error";
            state.error = error;
        },
        LOGOUT(state) {
            state.status = "";
            state.user = null;
            state.error = null;
        },
        SET_REFRESH_TIMEOUT(state, timeoutId) {
            state.refreshTimeout = timeoutId;
        },
    },
    actions: {
        async register({ commit }, { router, user }) {
            console.log(router);
            commit("AUTH_REQUEST");
            try {
                await axiosInstance.post("register", user);
                await router.push({ name: "login" });
            } catch (error) {
                commit("AUTH_ERROR", error.response.data.errors);
            }
        },
        async login({ commit, dispatch }, { router, credentials }) {
            commit("AUTH_REQUEST");
            try {
                // console.log(credentials)
                await axiosInstance.post("login", credentials);
                // Fetch user info after login (optional)
                const { data } = await axiosInstance.get("profile");
                commit("AUTH_SUCCESS", data);
                ///////////////////////////////////////////////////////////////////////////////////////////////
                // dispatch('scheduleTokenRefresh');
                router.push("/");
            } catch (error) {
                commit("AUTH_ERROR", error.response.data.error);
            }
        },
        async logout({ commit }, router) {
            try {
                await axiosInstance.post("logout");
                commit("LOGOUT");
                router.push("/");
            } catch (error) {
                console.error("Logout failed:", error.response.data.error);
            }
        },
        async fetchProfile({ commit }) {
            try {
                const { data } = await axiosInstance.get("profile");
                commit("AUTH_SUCCESS", data);
            } catch (error) {
                commit("AUTH_ERROR", error.response.data.error);
            }
        },
        async autoLogin({ dispatch, commit, getters }, {router,route}) {
            commit("AUTH_REQUEST");
            try {
                await dispatch("fetchProfile");
                router.push({
                    name: route.name,
                    params: route.params,
                    query: { ...route.query, reload: new Date().getTime() }
                  });
                console.log("autologin");
            } catch (error) {
                commit("LOGOUT");
            }
        },
        async sendPasswordResetLink({ commit }, email) {
            commit("AUTH_REQUEST");
            try {
                await axiosInstance.post("forgot-password", email);
                commit("AUTH_ERROR", { message: "Password reset link sent" });
            } catch (error) {
                console.log(error);
                commit("AUTH_ERROR", error.response.data);
            }
        },
        async resetPassword({ commit }, { router, data }) {
            commit("AUTH_REQUEST");
            try {
                const response = await axiosInstance.post(
                    "reset-password",
                    data
                );
                commit("LOGOUT");
                router.push("/login");
            } catch (error) {
                commit("AUTH_ERROR", error.response.data);
            }
        },
        // -----------------------------------------------------------testcode
        // async refreshToken({ commit, dispatch }) {
        //   try {
        //     const response = await axiosInstance.post('user/refresh-token');
        //     const { expires_in } = response.data;

        //     console.log(expires_in)

        //     const { data } = await axiosInstance.get('user/profile');
        //     commit('AUTH_SUCCESS', data);

        //     dispatch('scheduleTokenRefresh', expires_in * 1000);
        //   } catch (error) {
        //     commit('LOGOUT');
        //     console.error('Token refresh failed:', error);
        //   }
        // },

        // scheduleTokenRefresh({ dispatch, state, commit }, timeout) {
        //   clearTimeout(state.refreshTimeout);

        //   const expirationTime = timeout || 15 * 60 * 1000;
        //   const refreshTime = expirationTime - 60 * 1000;

        //   console.log(refreshTime)

        //   const timeoutId = setTimeout(() => {
        //     dispatch('refreshToken');
        //   }, refreshTime);

        //   commit('SET_REFRESH_TIMEOUT', timeoutId);
        // },
        // -------------------------------------------------------------end testcode
    },
    getters: {
        isAuthenticated(state) {
            return !!state.user;
        },
        getUser(state) {
            return state.user;
        },
        getAuthStatus(state) {
            return state.status;
        },
        getAuthError(state) {
            return state.error;
        },
    },
};
