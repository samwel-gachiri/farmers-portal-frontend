<script>
export default {
  name: 'LogoTitle',
  props: {
    text: {
      type: String,
      default: 'Welcome to Agriconnect',
    },
  },
};
</script>

<template>
  <div class="tw-flex tw-justify-center md:tw-justify-start tw-flex-row">
    <div class="tw-flex tw-justify-center tw-items-center tw-flex-col tw-border-b">
      <h2 class="c-title c-green-text tw-text-2xl tw-font-bold tw-mb-4 md:tw-mb-0 md:tw-mr-4">
        {{text}}
      </h2>
      <slot></slot>
    </div>
    <img
        src="@/assets/images/logo.png"
        alt="Company Logo"
        class="tw-border tw-rounded-lg"
        width="100px"
        height="100px"
        loading="lazy"
    />
  </div>
</template>

<style scoped>

</style>
