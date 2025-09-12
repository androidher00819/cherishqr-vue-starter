import { ref, computed, watch } from 'vue'
import logo from '../../assets/image/logo.png'

export function useAuthView() {
  const mode = ref('login')

  // Login form state
  const loginEmail = ref('')
  const loginPassword = ref('')

  // Register form state
  const regName = ref('')
  const regEmail = ref('')
  const regPassword = ref('')
  const regConfirm = ref('')

  // Show/Hide password toggles
  const showLoginPassword = ref(false)
  const showRegPassword = ref(false)
  const showRegConfirm = ref(false)

  // Loading states
  const isLoggingIn = ref(false)
  const isRegistering = ref(false)

  // Errors container (Bootstrap uses .is-invalid + .invalid-feedback)
  const errors = ref({
    loginEmail: '',
    loginPassword: '',
    regName: '',
    regEmail: '',
    regPassword: '',
    regConfirm: ''
  })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Live validity (for disabling submit button when inputs are invalid)
  const isLoginFormValid = computed(() => {
    return emailRegex.test(loginEmail.value) && loginPassword.value.length >= 8
  })
  const isRegisterFormValid = computed(() => {
    return (
      regName.value.trim().length > 0 &&
      emailRegex.test(regEmail.value) &&
      regPassword.value.length >= 8 &&
      regConfirm.value === regPassword.value
    )
  })

  // Live auto-validation for Register password + confirm password
  watch([regPassword, regConfirm], ([p, c]) => {
    // Password field message (prefer length rule, then mismatch)
    if (p.length > 0 && p.length < 8) {
      errors.value.regPassword = 'Password must be at least 8 characters'
    } else if (c.length > 0 && p !== c) {
      errors.value.regPassword = 'Passwords do not match'
    } else {
      errors.value.regPassword = ''
    }

    // Confirm field message (only when user started typing confirm)
    if (c.length === 0) {
      errors.value.regConfirm = ''
    } else if (p !== c) {
      errors.value.regConfirm = 'Passwords do not match'
    } else {
      errors.value.regConfirm = ''
    }
  }, { immediate: true })

  // Live auto-validation for email fields (login & register)
  watch(loginEmail, (val) => {
    if (!val) {
      // no error while empty; required will be handled on submit
      errors.value.loginEmail = ''
    } else if (!emailRegex.test(val)) {
      errors.value.loginEmail = 'Enter a valid email address'
    } else {
      errors.value.loginEmail = ''
    }
  })
  watch(regEmail, (val) => {
    if (!val) {
      errors.value.regEmail = ''
    } else if (!emailRegex.test(val)) {
      errors.value.regEmail = 'Enter a valid email address'
    } else {
      errors.value.regEmail = ''
    }
  })

  // Password strength meter (register password)
  const passwordStrengthScore = computed(() => {
    const p = regPassword.value || ''
    let score = 0
    if (p.length >= 8) score++
    if (/[a-z]/.test(p)) score++
    if (/[A-Z]/.test(p)) score++
    if (/\d/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score // 0..5
  })
  const passwordStrengthPercent = computed(() => Math.max(10, Math.round((passwordStrengthScore.value / 5) * 100)))
  const passwordStrengthLabel = computed(() => {
    const s = passwordStrengthScore.value
    if (s <= 2) return 'weak'
    if (s === 3) return 'fair'
    return 'strong'
  })
  const passwordStrengthClass = computed(() => {
    const label = passwordStrengthLabel.value
    if (label === 'weak') return 'bg-danger'
    if (label === 'fair') return 'bg-warning'
    return 'bg-success'
  })
  const passwordHints = computed(() => {
    const p = regPassword.value || ''
    const hints = []
    if (p.length < 8) hints.push('Use at least 8 characters')
    if (!/[a-z]/.test(p)) hints.push('Add a lowercase letter')
    if (!/[A-Z]/.test(p)) hints.push('Add an uppercase letter')
    if (!/\d/.test(p)) hints.push('Add a number')
    if (!/[^A-Za-z0-9]/.test(p)) hints.push('Add a symbol (e.g., !@#)')
    return hints
  })

  function resetErrors() {
    Object.keys(errors.value).forEach(k => (errors.value[k] = ''))
  }

  function validateLogin() {
    resetErrors()
    let ok = true

    if (!loginEmail.value) {
      errors.value.loginEmail = 'Email is required'
      ok = false
    } else if (!emailRegex.test(loginEmail.value)) {
      errors.value.loginEmail = 'Enter a valid email address'
      ok = false
    }

    if (!loginPassword.value) {
      errors.value.loginPassword = 'Password is required'
      ok = false
    } else if (loginPassword.value.length < 8) {
      errors.value.loginPassword = 'Password must be at least 8 characters'
      ok = false
    }

    return ok
  }

  function validateRegister() {
    resetErrors()
    let ok = true

    if (!regName.value) {
      errors.value.regName = 'Full name is required'
      ok = false
    }

    if (!regEmail.value) {
      errors.value.regEmail = 'Email is required'
      ok = false
    } else if (!emailRegex.test(regEmail.value)) {
      errors.value.regEmail = 'Enter a valid email address'
      ok = false
    }

    if (!regPassword.value) {
      errors.value.regPassword = 'Password is required'
      ok = false
    } else if (regPassword.value.length < 8) {
      errors.value.regPassword = 'Password must be at least 8 characters'
      ok = false
    }

    if (!regConfirm.value) {
      errors.value.regConfirm = 'Please confirm your password'
      ok = false
    } else if (regConfirm.value !== regPassword.value) {
      errors.value.regConfirm = 'Passwords do not match'
      ok = false
    }

    return ok
  }

  async function onLoginSubmit() {
    // Show loader immediately so user gets feedback on click
    isLoggingIn.value = true
    try {
      const ok = validateLogin()
      if (!ok) {
        // Keep loader briefly so it’s visible then turn it off
        await new Promise(r => setTimeout(r, 500))
        return
      }
      // Simulate API delay to demonstrate loader
      await new Promise(r => setTimeout(r, 3000))
      console.log('Login form valid')
    } finally {
      isLoggingIn.value = false
    }
  }

  async function onRegisterSubmit() {
    // Show loader immediately so user gets feedback on click
    isRegistering.value = true
    try {
      const ok = validateRegister()
      if (!ok) {
        await new Promise(r => setTimeout(r, 500))
        return
      }
      // Simulate API delay to demonstrate loader
      await new Promise(r => setTimeout(r, 3000))
      console.log('Register form valid')
    } finally {
      isRegistering.value = false
    }
  }

  return {
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
    // Live validity
    isLoginFormValid,
    isRegisterFormValid,
    // Strength meter
    passwordStrengthScore,
    passwordStrengthPercent,
    passwordStrengthLabel,
    passwordStrengthClass,
    passwordHints,
    // Validation
    errors,
    onLoginSubmit,
    onRegisterSubmit
  }
}