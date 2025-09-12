import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logoUrl from '../../assets/image/logo.png'

export function useCherishQrScan() {
  const router = useRouter()
  const logoFailed = ref(false)

  function onLogoError() {
    logoFailed.value = true
  }

  function goRegister() {
    router.push('/auth')
  }

  return {
    logoUrl,
    logoFailed,
    onLogoError,
    goRegister
  }
}