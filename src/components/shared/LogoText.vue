<script>
export default {
  name: 'LogoTitle',
  props: {
    text: {
      type: String,
      default: 'Agriconnect',
    },
  },
};
</script>

<template>
  <div class="tw-flex tw-justify-center md:tw-justify-start tw-flex-row tw-cursor-pointer" @click="()=>this.$router.push({path: '/'})">
    <img
        src="@/assets/images/logo.png"
        alt="Company Logo"
        class="tw-border tw-rounded-lg tw-mx-5"
        width="50px"
        height="40px"
        loading="lazy"
    />
    <v-divider vertical/>
    <div class="tw-flex tw-justify-center tw-items-center tw-flex-col tw-px-4">
      <h2 class="tw-text-md c-green-text tw-font-bold">
        {{text}}
      </h2>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>
