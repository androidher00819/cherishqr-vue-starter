import { createRouter, createWebHashHistory } from 'vue-router'

import UploadView from '../views/UploadView/UploadView.vue'
import MusicView from '../views/MusicView/MusicView.vue'
import ThemeView from '../views/ThemeView/ThemeView.vue'
import PaymentView from '../views/PaymentView/PaymentView.vue'
import ProfileOptionsView from '../views/ProfileOptionsView/ProfileOptionsView.vue'
import PaidOptionsView from '../views/PaidOptionsView/PaidOptionsView.vue'
import CherishQrScan from '../views/CherishQrScanView/CherishQrScanView.vue'
import AuthView from '../views/AuthView/AuthView.vue'

const routes = [
  { path: '/', redirect: '/auth' },
  { path: '/upload', component: UploadView },
  { path: '/music', component: MusicView },
  { path: '/theme', component: ThemeView },
  { path: '/payment', component: PaymentView },
  { path: '/profile-options', component: ProfileOptionsView },
  { path: '/paid-options', component: PaidOptionsView },
  { path: '/scan', component: CherishQrScan },
  { path: '/auth', component: AuthView }
]

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})
