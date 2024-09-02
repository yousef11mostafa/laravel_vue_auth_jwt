
// const  getters = {
//     getuser(state){ 
//         return state.user;
//     },
//   };


//   export default getters;

import axiosInstance from '../../axios';

export default {
  namespaced: true,
  state: {
    user: null,
    status: '',
    error: null,
    refreshTimeout: null, // To store the timeout ID for auto-refresh
  },
  mutations: {
    AUTH_REQUEST(state) {
      state.status = 'loading';
      state.error = null;
    },
    AUTH_SUCCESS(state, user) {
      state.status = 'success';
      state.user = user;
      state.error = null;
    },
    AUTH_ERROR(state, error) {
      state.status = 'error';
      state.error = error;
    },
    LOGOUT(state) {
      state.status = '';
      state.user = null;
      state.error = null;
      clearTimeout(state.refreshTimeout); // Clear any existing refresh timeout
    },
    SET_REFRESH_TIMEOUT(state, timeoutId) {
      state.refreshTimeout = timeoutId;
    },
  },
  actions: {
    async register({ commit }, { router, user }) {
      commit('AUTH_REQUEST');
      try {
        await axiosInstance.post('user/register', user);
        await router.push({ name: "login" });
      } catch (error) {
        if (error.response && error.response.status === 422) {
          commit('AUTH_ERROR', error.response.data);
        }
      }
    },
    async login({ commit, dispatch }, { router, credentials }) {
      commit('AUTH_REQUEST');
      try {
        await axiosInstance.post('user/login', credentials);
        // Fetch user info after login
        const { data } = await axiosInstance.get('user/profile');
        commit('AUTH_SUCCESS', data);

        // Schedule token refresh
        dispatch('scheduleTokenRefresh');

        router.push("/");
      } catch (error) {
        commit('AUTH_ERROR', error.response?.data || error.message);
      }
    },
    async logout({ commit }, router) {
      try {
        await axiosInstance.post('user/logout');
        commit('LOGOUT');
        router.push("/");
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
    async fetchProfile({ commit }) {
      try {
        const { data } = await axiosInstance.get('user/profile');
        commit('AUTH_SUCCESS', data);
      } catch (error) {
        commit('AUTH_ERROR', error.response?.data || error.message);
      }
    },
    async autoLogin({ dispatch, commit, getters }, router) {
      commit('AUTH_REQUEST');
      try {
        await dispatch('fetchProfile');

        const excludedRoutes = ['passwordLink', 'passwordReset'];
        const currentRouteName = router.currentRoute.value.name;

        if (getters.isAuthenticated && !excludedRoutes.includes(currentRouteName)) {
          router.push('/');
        }

        // Schedule token refresh
        dispatch('scheduleTokenRefresh');
      } catch (error) {
        commit('LOGOUT');
      }
    },
    async refreshToken({ commit, dispatch }) {
      try {
        const response = await axiosInstance.post('refresh-token');
        const { token, expires_in } = response.data;

        // Refresh user info with the new token if needed
        const { data } = await axiosInstance.get('user/profile');
        commit('AUTH_SUCCESS', data);

        // Schedule next token refresh
        dispatch('scheduleTokenRefresh', expires_in);
      } catch (error) {
        commit('LOGOUT');
        console.error('Token refresh failed:', error);
      }
    },
    scheduleTokenRefresh({ dispatch, state }) {
      // Cancel any existing token refresh timeout
      clearTimeout(state.refreshTimeout);

      // Assuming the token expiration time is provided in seconds
      const expirationTime = 15 * 60 * 1000; // Adjust based on your token's expiration time
      const refreshTime = expirationTime - 60 * 1000; // Refresh 1 minute before expiration

      const timeoutId = setTimeout(() => {
        dispatch('refreshToken');
      }, refreshTime);

      // Store the timeout ID in the state
      commit('SET_REFRESH_TIMEOUT', timeoutId);
    },
    async sendPasswordResetLink({ commit }, email) {
      commit('AUTH_REQUEST');
      try {
        await axiosInstance.post('user/password/email', email);
        commit('AUTH_ERROR', { message: 'Password reset link sent' });
      } catch (error) {
        commit('AUTH_ERROR', error.response?.data || error.message);
      }
    },
    async resetPassword({ commit }, { router, data }) {
      commit('AUTH_REQUEST');
      try {
        await axiosInstance.post('user/password/reset', data);
        commit('LOGOUT');
        router.push("/login");
      } catch (error) {
        if (error.response.status === 422) {
          commit('AUTH_ERROR', error.response.data.errors);
        }
      }
    },
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
