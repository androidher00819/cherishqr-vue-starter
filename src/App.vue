<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Navbar -->
    <header>
      <nav class="navbar bg-white border-bottom py-1 px-0 fixed-top">
        <div class="container-fluid d-flex align-items-center justify-content-between px-0">
          <!-- Brand: Logo image only -->
          <router-link to="/" class="navbar-brand">
            <img :src="logo" alt="CherishQR" height="50" class="brand-logo brand-logo-left" />
          </router-link>

          <!-- Right side: Manage Pages + notification dot + cart icon -->
          <div class="d-flex align-items-center gap-3">
            <a href="#" class="text-secondary text-decoration-none small">Manage Pages</a>
            <!-- Bell icon removed; notification dot moved to cart icon -->
            <router-link to="/payment" class="text-dark text-decoration-none cart-link position-relative">
              <i class="bi bi-cart fs-5"></i>
              <span v-if="cartCount === 0" class="position-absolute top-0 start-100 translate-middle notification-dot"></span>
              <span v-else class="position-absolute top-0 start-100 translate-middle cart-badge bg-danger text-white">{{ cartCount }}</span>
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main content -->
    <main class="flex-grow-1 app-main">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="py-3 fixed-bottom" style="background-color: #4b225a;">
      <div class="container text-white d-flex justify-content-center align-items-center">
        <small class="footer-copy">© 2025 <img :src="logo" alt="CherishQR logo" class="footer-logo" /> All rights reserved.</small>
      </div>
    </footer>

    <!-- Global route loader overlay -->
    <div v-if="isRouteLoading" class="route-loader-overlay" aria-live="polite" aria-busy="true">
      <LogoLoader label="Loading" :size="100" textSize="1.2rem" speed="1s" />
    </div>
  </div>
</template>

<script setup>
import logo from './assets/image/logo.png'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LogoLoader from './components/LogoLoader/LogoLoader.vue'

// Dynamic cart counter (0 shows a red dot; >0 shows the number)
const cartCount = ref(1)

// Global route loading state
const isRouteLoading = ref(false)
const loaderStartedAt = ref(0)
const MIN_LOADER_MS = 3000
const router = useRouter()

function showLoader() {
  isRouteLoading.value = true
  loaderStartedAt.value = Date.now()
}
function hideLoaderWithMinDuration() {
  const elapsed = Date.now() - loaderStartedAt.value
  const remaining = Math.max(0, MIN_LOADER_MS - elapsed)
  setTimeout(() => { isRouteLoading.value = false }, remaining)
}

onMounted(() => {
  router.beforeEach((to, from, next) => {
    if (to.fullPath !== from.fullPath) {
      showLoader()
    }
    next()
  })
  router.afterEach(() => {
    hideLoaderWithMinDuration()
  })
  router.onError(() => {
    hideLoaderWithMinDuration()
  })
})
</script>

<style scoped>
.brand-logo {
  transition: opacity 0.2s ease;
}
.brand-logo:hover {
  opacity: 0.8;
}
.brand-logo-left { margin-left: 30px; }
.cart-link { margin-right: 30px; }
.cart-badge {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.65rem;
  line-height: 1;
  padding: 0;
  border: 2px solid #fff;
}
.notification-dot { width: 12px; height: 12px; background: #dc3545; border: 2px solid #fff; border-radius: 50%; display: inline-block; }
.footer-logo {
  height: 50px;
  width: auto;
  vertical-align: middle;
  margin: 0 4px;
  display: inline-block;
}
.footer-copy {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Overlay styles */
.route-loader-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.75);
  z-index: 2000; /* above navbar/footer */
  display: grid;
  place-items: center;
}
</style>

<style>
:root {
  --app-navbar-offset: 56px;
  --app-footer-offset: 60px;
}
.app-main {
  padding-top: var(--app-navbar-offset);
  padding-bottom: var(--app-footer-offset);
}
/* Global: remove rounded corners on buttons */
button, .btn { border-radius: 0 !important; }
/* Global font for all h2 */
h2 { font-family: 'Poppins', sans-serif !important; }
</style>
