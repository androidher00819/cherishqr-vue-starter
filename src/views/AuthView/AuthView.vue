<template>
  <section class="container d-flex min-vh-100 align-items-center justify-content-center py-4">
    <div class="w-100" style="max-width: 560px;">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <ul class="nav nav-pills nav-justified mb-3">
            <li class="nav-item">
              <button
                type="button"
                class="nav-link"
                :class="{ active: mode === 'login' }"
                @click="mode = 'login'"
              >
                Login
              </button>
            </li>
            <li class="nav-item">
              <button
                type="button"
                class="nav-link"
                :class="{ active: mode === 'register' }"
                @click="mode = 'register'"
              >
                Register
              </button>
            </li>
          </ul>

          <form v-if="mode === 'login'" @submit.prevent="onLoginSubmit" class="needs-validation" novalidate>
            <div class="text-center mb-3">
              <img :src="logo" alt="CherishQR logo" class="auth-logo mx-auto d-block" />
            </div>
            <div class="mb-3">
              <label class="form-label" for="loginEmail">Email</label>
              <input id="loginEmail" v-model="loginEmail" type="email" class="form-control" :class="{ 'is-invalid': errors.loginEmail }" placeholder="name@example.com" :disabled="isLoggingIn" required />
              <div class="invalid-feedback">{{ errors.loginEmail }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="loginPassword">Password</label>
              <div class="position-relative">
                <input
                  id="loginPassword"
                  v-model="loginPassword"
                  :type="showLoginPassword ? 'text' : 'password'"
                  class="form-control pe-5"
                  :class="{ 'is-invalid': errors.loginPassword }"
                  placeholder="••••••••"
                  :disabled="isLoggingIn"
                  required
                />
                <button v-if="!errors.loginPassword" type="button" class="btn btn-sm btn-link toggle-password position-absolute top-50 end-0 translate-middle-y me-2 p-0" @click="showLoginPassword = !showLoginPassword" aria-label="Toggle password visibility">
                  <i v-if="showLoginPassword" class="bi bi-eye-slash" aria-hidden="true"></i>
                  <i v-else class="bi bi-eye" aria-hidden="true"></i>
                </button>
                <div class="invalid-feedback">{{ errors.loginPassword }}</div>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="rememberMe" />
                <label class="form-check-label" for="rememberMe"> Remember me </label>
              </div>
              <a href="#" class="small text-decoration-none">Forgot password?</a>
            </div>
            <button
              type="submit"
              class="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center gap-2"
              style="background-color:#4b225a; border-color:#4b225a;"
              :disabled="!isLoginFormValid || isLoggingIn"
              :aria-busy="isLoggingIn ? 'true' : 'false'"
              aria-live="polite"
            >
              <span v-if="!isLoggingIn">Login</span>
              <LoadingDots v-else label="Logging in" />
              <span class="visually-hidden" v-if="isLoggingIn">Logging in</span>
            </button>
          </form>

          <form v-else @submit.prevent="onRegisterSubmit" class="needs-validation" novalidate>
            <h2 class="h5 mb-3 text-center">Create your account</h2>
            <div class="mb-3">
              <label class="form-label" for="regName">Full Name</label>
              <input id="regName" v-model="regName" type="text" class="form-control" :class="{ 'is-invalid': errors.regName }" placeholder="Juan Dela Cruz" :disabled="isRegistering" required />
              <div class="invalid-feedback">{{ errors.regName }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="regEmail">Email</label>
              <input id="regEmail" v-model="regEmail" type="email" class="form-control" :class="{ 'is-invalid': errors.regEmail }" placeholder="name@example.com" :disabled="isRegistering" required />
              <div class="invalid-feedback">{{ errors.regEmail }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="regPassword">Password</label>
              <div class="position-relative">
                <input
                  id="regPassword"
                  v-model="regPassword"
                  :type="showRegPassword ? 'text' : 'password'"
                  class="form-control pe-5"
                  :class="{ 'is-invalid': errors.regPassword }"
                  placeholder="Create a password"
                  :disabled="isRegistering"
                  required
                />
                <button v-if="!errors.regPassword" type="button" class="btn btn-sm btn-link toggle-password position-absolute top-50 end-0 translate-middle-y me-2 p-0" @click="showRegPassword = !showRegPassword" aria-label="Toggle password visibility">
                  <i v-if="showRegPassword" class="bi bi-eye-slash" aria-hidden="true"></i>
                  <i v-else class="bi bi-eye" aria-hidden="true"></i>
                </button>
                <div class="invalid-feedback">{{ errors.regPassword }}</div>
              </div>
              <!-- Strength meter -->
              <div class="mt-2">
                <div class="d-flex justify-content-between align-items-center mb-1 small text-muted">
                  <span>Password strength: <strong class="text-capitalize">{{ passwordStrengthLabel }}</strong></span>
                  <span>{{ passwordStrengthPercent }}%</span>
                </div>
                <div class="progress" style="height: 6px; border-radius: 0;">
                  <div class="progress-bar" :class="passwordStrengthClass" role="progressbar" :style="{ width: passwordStrengthPercent + '%' }" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="passwordStrengthPercent"></div>
                </div>
                <ul v-if="passwordHints.length" class="mt-2 mb-0 small text-muted ps-3">
                  <li v-for="(hint, idx) in passwordHints" :key="idx">{{ hint }}</li>
                </ul>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="regConfirm">Confirm Password</label>
              <div class="position-relative">
                <input
                  id="regConfirm"
                  v-model="regConfirm"
                  :type="showRegConfirm ? 'text' : 'password'"
                  class="form-control pe-5"
                  :class="{ 'is-invalid': errors.regConfirm }"
                  placeholder="Re-enter password"
                  :disabled="isRegistering"
                  required
                />
                <button v-if="!errors.regConfirm" type="button" class="btn btn-sm btn-link toggle-password position-absolute top-50 end-0 translate-middle-y me-2 p-0" @click="showRegConfirm = !showRegConfirm" aria-label="Toggle password visibility">
                  <i v-if="showRegConfirm" class="bi bi-eye-slash" aria-hidden="true"></i>
                  <i v-else class="bi bi-eye" aria-hidden="true"></i>
                </button>
                <div class="invalid-feedback">{{ errors.regConfirm }}</div>
              </div>
            </div>
            <button
              type="submit"
              class="btn btn-primary w-100 d-inline-flex align-items-center justify-content-center gap-2"
              style="background-color:#4b225a; border-color:#4b225a;"
              :disabled="!isRegisterFormValid || isRegistering"
              :aria-busy="isRegistering ? 'true' : 'false'"
              aria-live="polite"
            >
              <span v-if="!isRegistering">Register</span>
              <LoadingDots v-else label="Creating account" />
              <span class="visually-hidden" v-if="isRegistering">Creating account</span>
            </button>
          </form>

          <p class="text-center text-muted small mb-0 mt-3">
            <span v-if="mode === 'login'">Don't have an account? <a href="#" @click.prevent="mode='register'">Create one</a></span>
            <span v-else>Already have an account? <a href="#" @click.prevent="mode='login'">Sign in</a></span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAuthView } from './AuthView.js'
import LoadingDots from '../../components/LoadingDots/LoadingDots.vue'

const {
  mode,
  logo,
  // Login state
  loginEmail,
  loginPassword,
  // Register state
  regName,
  regEmail,
  regPassword,
  regConfirm,
  // Show/Hide password
  showLoginPassword,
  showRegPassword,
  showRegConfirm,
  // Loading
  isLoggingIn,
  isRegistering,
  // Validity flags
  isLoginFormValid,
  isRegisterFormValid,
  // Strength meter
  passwordStrengthPercent,
  passwordStrengthLabel,
  passwordStrengthClass,
  passwordHints,
  // Validation
  errors,
  onLoginSubmit,
  onRegisterSubmit
} = useAuthView()
</script>

<style src="./AuthView.css" scoped></style>