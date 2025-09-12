<template>
  <section class="container d-flex min-vh-100 align-items-center justify-content-center py-4">
    <div class="text-center w-100 cq-view-max">
      <!-- Use imported logo from src/assets; fallback to inline SVG if it fails to load -->
      <img
        v-if="!logoFailed"
        :src="logoUrl"
        alt="CherishQR logo"
        class="img-fluid mx-auto d-block mb-3 cq-logo-size"
        @error="onLogoError"
      />

      <!-- Fallback inline SVG logo (vector) -->
      <div v-else class="mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 700 180"
          role="img"
          aria-label="CherishQR logo"
          class="img-fluid cq-logo-size"
        >
          
        </svg>
      </div>

      <button
        type="button"
        class="btn cq-btn-primary d-inline-flex align-items-center justify-content-center gap-1 px-3 py-2"
        @click="handleGoRegister"
        :disabled="isNavigating"
        :aria-busy="isNavigating ? 'true' : 'false'"
        aria-live="polite"
      >
        <template v-if="!isNavigating">
          <span class="fw-semibold small letter-spacing-08">Click Here to Sign Up / Sign In</span>
          <i class="bi bi-chevron-right fs-6 d-inline-flex align-items-center lh-1"></i>
        </template>
        <LogoLoader v-else label="Opening" :size="18" orientation="horizontal" textSize="0.9rem" />
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useCherishQrScan } from './useCherishQrScanView'
import './CherishQrScanView.css'
import LoadingDots from '../../components/LoadingDots/LoadingDots.vue'
import LogoLoader from '../../components/LogoLoader/LogoLoader.vue'

const { logoUrl, logoFailed, onLogoError, goRegister } = useCherishQrScan()

const isNavigating = ref(false)
function handleGoRegister() {
  if (isNavigating.value) return
  isNavigating.value = true
  // Give time for the loader to render so user can see feedback
  setTimeout(() => {
    goRegister()
  }, 500)
}
</script>

<style scoped>
/* Remove local scoped styles now that we use external CSS */
</style>