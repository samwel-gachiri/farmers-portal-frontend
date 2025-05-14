/* eslint-disable sonarjs/no-duplicate-string */
/* eslint no-shadow:0 */
// import Auth from '@aws-amplify/auth';
// import Amplify from '@aws-amplify/core';
import cookie from 'vue-cookies';
import axios from 'axios';
/* eslint import/named:0 */
import {
  ACCESS_TOKEN, APP_CODE, CR_KEY, ROLE, USER, USER_EMAIL, USER_OTP,
} from '@/utils/const.js';

// await context.dispatch('auth/generateOtp', { email: params.attributes.email, mobile: params.attributes.phone_number }, { root: true });
// keep user cred
import CryptoJS from 'crypto-js';
// eslint-disable-next-line import/extensions
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase.js';

// const { Logger } = Amplify;
// Logger.LOG_LEVEL = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test' ? 'ERROR' : 'DEBUG'; // to show detailed logs from Amplify library
// const logger = new Logger('store:auth');

const data = {
  user: cookie.get(USER) || null,
  token: cookie.get(ACCESS_TOKEN) || '',
  role: cookie.get(ROLE) || '',
  authenticationStatus: null,
  userConfirmed: false,
};

const getters = {
  authenticatedUser: (state) => state.user,
  isConfirmed: (state) => state.userConfirmed,
  isAuthenticated: (state) => !!state.token,
  accessToken: (state) => state.token,
  role: (state) => state.role,
  authenticationStatus: (state) => (state.authenticationStatus
    ? state.authenticationStatus
    : { variant: 'secondary' }),
  hasAuthenticationStatus: (state) => !!state.authenticationStatus,
};

const mutations = {
  setUserRole(state, text) {
    state.role = text;
  },
  setAuthenticationError(state, err) {
    // logger.debug('auth error: {}', err);
    state.authenticationStatus = {
      state: 'failed',
      message: err.message,
      variant: 'error',
    };
  },
  setAuthenticationSuccess(state, text) {
    state.authenticationStatus = {
      state: 'success',
      message: text,
      variant: 'success',
    };
  },
  clearAuthenticationStatus: (state) => {
    state.authenticationStatus = null;
  },
  setUserAuthenticated(state, user) {
    // const token = user.signInUserSession.idToken.jwtToken;
    const token = user.accessToken;
    cookie.set(USER, user);
    cookie.set(ROLE, state.role);
    cookie.set(ACCESS_TOKEN, token);
    state.user = user;
    state.token = token;
  },
  setUserToken(state, token) {
    cookie.set(ACCESS_TOKEN, token);
    state.token = token;
  },
  setUserConfirmed(state, status) {
    cookie.remove(USER_EMAIL);
    state.userConfirmed = status;
  },
  clearAuthentication(state) {
    cookie.remove(USER);
    cookie.remove(ACCESS_TOKEN);
    state.token = '';
    state.user = null;
  },
};

const actions = {
  setViewRole: async (context, text) => {
    context.commit('setUserRole', text);
    cookie.set(ROLE, text);
  },
  clearAuthenticationStatus: (context) => {
    context.commit('clearAuthenticationStatus', null);
  },
  signIn: async (context, params) => {
    // logger.debug('signIn for {}', params.username);
    context.commit('auth/clearAuthenticationStatus', null, { root: true });
    try {
      // const user = await Auth.signIn(params.username, params.password);
      context.commit('setUserAuthenticated', params.user);
      context.commit('auth/setAuthenticationSuccess', 'logged in', { root: true });
      // SUSPEND USER LOGIN STATE HERE FOR OTP VERIFICATION
      // return params.user;
    } catch (err) {
      context.commit('auth/setAuthenticationError', err, { root: true });
      throw err;
    }
  },
  signOut: async (context) => {
    try {
      // await Auth.signOut();
      await signOut(auth);
    } catch (err) {
      // logger.debug('error during sign out: {}', err);
    }
    context.commit('auth/clearAuthentication', null, { root: true });
  },
  signUp: async (context, params) => {
    context.commit('auth/clearAuthenticationStatus', null, { root: true });
    try {
      // const {
      //   userConfirmed, userSub, user,
      // } = await Auth.signUp(params);
      context.commit('setAuthenticationSuccess', `${params.attributes.name} signed up successfully!`);
      // context.commit('setUserConfirmed', userConfirmed);
      const creds = CryptoJS.AES.encrypt(JSON.stringify({ username: params.username, password: params.password }), CR_KEY).toString();
      cookie.set(CR_KEY, creds);
      context.commit('auth/clearAuthentication', null, { root: true });
      // return { user, userSub };
    } catch (err) {
      context.commit('auth/setAuthenticationError', err, { root: true });
      throw err;
    }
  },
  refresh: async () => {
  // refresh: async (context) => {
    try {
      // const currentSession = await Auth.currentSession();
      // context.commit('setUserToken', currentSession.idToken.jwtToken);
    } catch (e) {
      throw Error(e);
    }
  },
  passwordReset: async (context) => {
    context.commit('auth/clearAuthenticationStatus', null, { root: true });
    try {
      // await Auth.forgotPassword(params.username);
      context.commit('auth/setAuthenticationSuccess', 'Password reset code sent via email/phone', { root: true });
    } catch (err) {
      context.commit('auth/setAuthenticationError', err, { root: true });
    }
  },
  confirmPasswordReset: async (context) => {
    context.commit('auth/clearAuthenticationStatus', null, { root: true });
    try {
      // await Auth.forgotPasswordSubmit(
      //   params.username,
      //   params.code,
      //   params.password,
      // );
      context.commit('auth/setAuthenticationSuccess', 'Password reset successful, Sign in', { root: true });
    } catch (err) {
      context.commit('auth/setAuthenticationError', err, { root: true });
    }
  },
  passwordChange: async (context) => {
    // logger.debug('password change for {}', context.state.user.name);
    context.commit('auth/clearAuthenticationStatus', null, { root: true });
    try {
      // const user = await Auth.currentAuthenticatedUser();
      // await Auth.changePassword(
      //   user,
      //   params.oldPassword,
      //   params.newPassword,
      // );
      context.commit('auth/setAuthenticationSuccess', 'Password successfully updated', { root: true });
    } catch (err) {
      context.commit('auth/setAuthenticationError', err, { root: true });
    }
  },
  updateUser: async (context) => {
    // logger.debug('update user >> {}', context.state.user.name);
    context.commit('auth/clearAuthenticationStatus', null, { root: true });
    try {
      // const user1 = await Auth.currentAuthenticatedUser();
      // await Auth.updateUserAttributes(user1, params);
      // const user = await Auth.currentAuthenticatedUser();
      // context.commit('setUserAuthenticated', user);
      context.commit('auth/setAuthenticationSuccess', 'Profile successfully updated', { root: true });
    } catch (err) {
      context.commit('auth/setAuthenticationError', err, { root: true });
    }
  },
  generateOtp: async (context, params) => {
    const data = {
      appCode: APP_CODE,
      emailAddress: params.email,
      mobileNumber: params.mobile,
    };
    cookie.set(USER_OTP, data);
    await axios.post('/customer/otp/generate', data)
      .then((response) => {
        if (response.data.data === 'succeeded') {
          context.commit('setUserConfirmed', false);
          context.commit('auth/setAuthenticationSuccess', 'Confirmation sent to Email Address /Phone, enter OTP to proceed', { root: true });
        } else {
          context.commit('auth/setAuthenticationError', { message: 'Error occurred, resend OTP!' }, { root: true });
        }
      }).catch(() => {
        context.commit('auth/setAuthenticationError', { message: 'Error occurred, try resend OTP!' }, { root: true });
      });
  },
  generateLoginOtp: async (context) => {
    // get email and mobile from user in localStorage
    const user = JSON.parse(localStorage.getItem('tempUser'));
    const email = user.attributes.email;
    const phone = user.attributes.phone_number;
    const data = {
      appCode: APP_CODE,
      emailAddress: email,
      mobileNumber: phone,
    };
    cookie.set(USER_OTP, data);
    await axios.post('/customer/otp/generate', data)
      .then((response) => {
        // this.$toast.error({ response });
        if (response.data.data === 'succeeded') {
          context.commit('setUserConfirmed', false);
          context.commit('auth/setAuthenticationSuccess', 'Confirmation sent to Email Address /Phone, enter OTP to proceed', { root: true });
        } else {
          context.commit('auth/setAuthenticationError', { message: 'Error occurred, resend OTP!' }, { root: true });
        }
      }).catch(() => {
        context.commit('auth/setAuthenticationError', { message: 'Error occurred, try resend OTP!' }, { root: true });
      });
  },
  regenerateOtp: async (context) => {
    const postData = cookie.get(USER_OTP);
    await axios.post('/customer/otp/regenerate', postData)
      .then((resp) => {
        if (resp.data.data === 'succeeded') {
          context.commit('setUserConfirmed', false);
          context.commit('setAuthenticationSuccess', 'Confirmation sent to Email/Phone, enter OTP to proceed');
        } else {
          context.commit('setAuthenticationError', { message: 'Error occurred, resend OTP!' });
        }
      }).catch(() => {
        context.commit('setAuthenticationError', { message: 'Error occurred, resend OTP!' });
      });
  },
  validateOtp: async (context, param) => {
    const data = cookie.get(USER_OTP);
    const params = {
      emailAddress: data.emailAddress,
      mobileNumber: data.mobileNumber,
      otp: param,
    };
    await axios.post('/customer/otp/validate', params)
      .then((response) => {
        if (response.data.data) {
          context.commit('setUserConfirmed', true);
          context.commit('auth/setAuthenticationSuccess', 'OTP confirmation successful', { root: true });
          cookie.remove(USER_OTP);
        } else {
          context.commit('auth/setAuthenticationError', { message: 'Wrong OTP entered, try again !' }, { root: true });
        }
      }).catch(() => {
        context.commit('auth/setAuthenticationError', { message: 'Error occurred, resend OTP!' }, { root: true });
      });
  },
  validateLoginOtp: async (context, param) => {
    const data = cookie.get(USER_OTP);
    const params = {
      emailAddress: data.emailAddress,
      mobileNumber: data.mobileNumber,
      otp: param,
    };
    await axios.post('/customer/otp/validate', params)
      .then((response) => {
        // console.log({ response });
        if (response.data.data) {
          const user = JSON.parse(localStorage.getItem('tempUser'));
          context.commit('setUserAuthenticated', user);
          context.commit('auth/setAuthenticationSuccess', 'logged in', { root: true });
          cookie.remove(USER_OTP);
          // localStorage.removeItem('tempUser');
        } else {
          context.commit('auth/setAuthenticationError', { message: 'Wrong OTP entered, try again !' }, { root: true });
        }
      }).catch(() => {
        context.commit('auth/setAuthenticationError', { message: 'Error occurred, resend OTP!' }, { root: true });
      });
  },
  verifyOtp: async (context, email) => {
    context.commit('setUserConfirmed', false);
    await axios.post('/customer/otp/verify', { emailAddress: email })
      .then((response) => {
        if (response.data.verified === true) {
          context.commit('setUserConfirmed', true);
        } else {
          context.commit('setUserConfirmed', false);
        }
      }).catch(() => {
        context.commit('setUserConfirmed', false);
      });
  },
};

export default {
  namespaced: true,
  state: data,
  getters,
  actions,
  mutations,
};
