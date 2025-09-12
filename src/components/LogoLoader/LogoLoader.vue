<template>
  <span
    :class="['loader-logo', orientationClass]"
    :style="{ '--loader-speed': speed, '--loader-text-size': textSize, '--logo-size': sizePx }"
  >
    <img
      :src="logoUrl"
      alt=""
      aria-hidden="true"
      class="logo-img"
      :style="{ width: 'auto', height: sizePx }"
    />
    <span class="loader-text">
      {{ label }}
      <span class="dots" aria-hidden="true">
        <span class="dot">•</span>
        <span class="dot">•</span>
        <span class="dot">•</span>
      </span>
    </span>
  </span>
</template>

<script src="./LogoLoader.js"></script>
<style scoped src="./LogoLoader.css"></style>