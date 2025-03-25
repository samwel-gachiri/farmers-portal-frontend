<template>
  <div>
    <ForgotPassword v-if="!codeSent" @codeSent="handleCodeSent" />
    <ResetPassword v-if="codeSent" :phone-number="email" />
  </div>
</template>

<script>
import ForgotPassword from '@/components/auth/ForgotPassword.vue';
import ResetPassword from '@/components/auth/ResetPassword.vue';

export default {
  components: { ForgotPassword, ResetPassword },
  data() {
    return {
      codeSent: false,
      email: '',
    };
  },
  methods: {
    handleCodeSent(email) {
      this.email = email;
      this.codeSent = true;
    },
  },
};
</script>
