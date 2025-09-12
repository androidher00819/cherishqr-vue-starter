<template>
  <section class="container py-4 app-free-options">
    <div class="mx-auto" style="max-width: 1100px;">
      <!-- Profile Hero (matches screenshot layout) -->
      <div class="free-hero position-relative mb-5">
        <div class="free-cover rounded-3 overflow-hidden position-relative shadow-sm">
          <img :src="coverUrl" alt="Cover" class="w-100 h-100 object-cover" />
          <button
            type="button"
            class="btn btn-light btn-sm position-absolute bottom-0 end-0 m-2 shadow-sm d-inline-flex align-items-center"
            @click="pickCoverFile"
            style="border-radius: 5px !important;"
          >
            <i class="bi bi-camera me-1"></i>
            Edit Photo Cover
          </button>
          <input ref="coverFileInput" type="file" accept="image/*" class="d-none" @change="onCoverFileChange" />
        </div>
        <div class="avatar-wrap">
          <img :src="avatarUrl" alt="Profile" class="free-avatar" />
          <button type="button" class="avatar-camera-btn" aria-label="Change Profile Photo" @click="pickAvatarFile">
            <i class="bi bi-camera-fill"></i>
          </button>
          <input ref="avatarFileInput" type="file" accept="image/*" class="d-none" @change="onAvatarFileChange" />
        </div>
      </div>

      <!-- Tabs -->
      <ul class="nav free-tabs mb-4" style="--tabs-offset: 8px">
        <li v-for="tab in topTabs" :key="tab" class="nav-item flex-fill">
          <button type="button"
                  class="nav-link w-100"
                  :class="[
                    activeTopTab === tab ? 'active' : '',
                    tab === 'Memory Lane' ? 'text-start pe-3' : '',
                    tab === 'Heritage' ? 'text-end ps-3' : ''
                  ]"
                  @click="onTabClick(tab)">
             {{ tab }}
           </button>
        </li>
      </ul>

      <!-- Profile meta -->
      <div class="text-center position-relative mb-4">
        <h1 class="h1 text-muted  mb-1">{{ profile.name }}</h1>
        <div class="text-muted mb-2">{{ dateRange }}</div>
      <div class="d-flex justify-content-center">
        <button type="button" class="btn btn-link play-chip text-decoration-none" @click="showCreateVideo = true">
          <span class="play-dot me-2"></span>
          Create Video
        </button>
      </div>
        <button v-if="activeTopTab === 'Life Journey'" type="button" class="btn btn-outline-secondary btn-sm position-absolute end-0 d-inline-flex" style="top: -40px; border-radius: 5px !important;" @click="showEdit = true">
          <i class="bi bi-pencil me-1"></i> Edit Biography
        </button>
      </div>

      <!-- Life Journey Content -->
      <div v-if="activeTopTab === 'Life Journey'">
        <h2 class="h4 text-brand mb-2">{{ biographyTitle || 'A Life of Faith, Sacrifice, and Unconditional Love' }}</h2>
        <p class="text-muted mb-4" v-if="biography && biography.length">
          {{ biography }}
        </p>
        <p class="text-muted mb-4" v-else>
          Corie “Nanay Cory” Aquino was more than a mother—she was a guiding light, a quiet force of strength, and a living example of grace and godliness. Raised in humble beginnings, she chose service over self, family over comfort, and faith over fear. This is placeholder text to demonstrate how a biography will appear on this page and can be replaced dynamically later on.
        </p>
      </div>

      <!-- Memory Lane Content -->
      <div v-if="activeTopTab === 'Memory Lane'">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h5 mb-0">Memory Lane</h2>
          <button type="button" class="btn btn-sm" @click="showUpload = true" style="background-color: #4b225a; color: #fff;">
            <i class="bi bi-plus-lg me-1"></i> Add Photos/Videos
          </button>
        </div>
        <div class="memory-grid">
            <div v-for="(item, idx) in pagedItems" :key="idx" class="memory-cell">
            <img v-if="item.type === 'image'" :src="item.url" alt="Memory" />
            <video v-else controls :src="item.url"></video>
            <div v-if="item.title" class="memory-title" :title="item.title">{{ item.title }}</div>
          </div>
          <div v-if="!memoryItems.length" class="memory-empty">
            <div class="text-center text-muted py-5">No memories yet. Click "Add Photos/Videos" to upload.</div>
          </div>
        </div>
            <div v-if="totalPages > 1" class="memory-pagination d-flex justify-content-center align-items-center mt-3 gap-2">
            <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="currentPage === 1" @click="prevPage">Prev</button>
            <span class="small text-muted">Page {{ currentPage }} of {{ totalPages }}</span>
            <button type="button" class="btn btn-outline-secondary btn-sm" :disabled="currentPage === totalPages" @click="nextPage">Next</button>
            </div>
      </div>

      <!-- Heritage Content -->
      <div v-if="activeTopTab === 'Heritage'">
        <div class="d-flex justify-content-end align-items-center mb-3">
          <button type="button" class="btn btn-sm" style="background-color: #4b225a; color: #fff;" @click="showAddFamily = true">
            <i class="bi bi-plus-lg me-1"></i> Add Family Members
          </button>
        </div>
        <div class="row">
          <div class="col-6">
            <h3 class="h6 fw-bold mb-2 text-center">PARENTS</h3>
            <hr class="mb-2" style="border-color: #caa84c;"/>
            <ul class="list-unstyled">
              <li v-for="(parent, index) in heritageData.parents" :key="index" :class="{'text-brand': index === 0, 'text-muted': index !== 0}" class="text-start">{{ parent }}</li>
            </ul>
          </div>
          <div class="col-6">
            <h3 class="h6 fw-bold mb-2 text-center">CHILDREN</h3>
            <hr class="mb-2" style="border-color: #caa84c;"/>
            <ul class="list-unstyled">
              <li v-for="(child, index) in heritageData.children" :key="index" class="text-muted text-start">{{ child }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Cherish Board Content -->
      <div v-if="activeTopTab === 'Cherish Board'">
        <div class="cherish-board-container rounded-3">
          <div v-for="(entry, index) in cherishBoardEntries" :key="index" class="cherish-row">
            <div class="cherish-left">
              <div class="cherish-name">{{ entry.name }}</div>
              <div class="cherish-date">{{ entry.date }}</div>
            </div>
            <div class="cherish-right">
              <div class="cherish-message">{{ entry.message }}</div>
            </div>
          </div>
        </div>
      </div>


    <EditProfileModal
      :show="showEdit"
      :initial="{
        firstMiddleName: profile.name.split(' ').slice(0, -1).join(' '),
        lastName: profile.name.split(' ').slice(-1)[0] || '',
        birth: formatDate(profile.birthDate),
        death: formatDate(profile.deathDate),
        biographyTitle: biographyTitle,
        biography: biography
      }"
      @close="showEdit = false"
      @save="onSaveEdit"
    />

    <UploadMediaModal
      :show="showUpload"
      @close="showUpload = false"
      @save="onSaveUpload"
    />

    <CreateVideoModal
      :show="showCreateVideo"
      :profile-name="profile.name"
      @close="showCreateVideo = false"
    />

    <AddFamilyMemberModal
      :show="showAddFamily"
      :initial-parents="heritageData.parents"
      :initial-children="heritageData.children"
      @close="showAddFamily = false"
      @save="onSaveFamily"
    />

     </div>
   </section>
 </template>
 
 <script setup>
 import { computed, ref, watch } from 'vue'
 import EditProfileModal from '../../components/EditProfileModal/EditProfileModal.vue'
 import UploadMediaModal from '../../components/UploadMediaModal/UploadMediaModal.vue'
 import CreateVideoModal from '../../components/CreateVideoModal/CreateVideoModal.vue'
 import AddFamilyMemberModal from '../../components/AddFamilyMemberModal/AddFamilyMemberModal.vue'
 import './ProfileOptionsView.css'
 import { noop } from './ProfileOptionsView.js'

 const showEdit = ref(false)
const biographyTitle = ref('')
const biography = ref('')

const showUpload = ref(false)
const memoryItems = ref([])
let memoryModalOpened = false
const showCreateVideo = ref(false)
const itemsPerPage = 6
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(memoryItems.value.length / itemsPerPage)))
const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return memoryItems.value.slice(start, start + itemsPerPage)
})
const showAddFamily = ref(false)
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }
function prevPage() { if (currentPage.value > 1) currentPage.value-- }

const heritageData = ref({
  parents: ['Andrea De Castro', 'Ambrosio De Castro'],
  children: ['Reynaldo Balan', 'Jesse Balan', 'Alexander Balan']
})

function onSaveEdit(payload) {
  const { firstMiddleName, lastName, birth, death, biographyTitle: bt, biography: bio } = payload || {}
  const cleanFirst = (firstMiddleName || '').trim()
  const cleanLast = (lastName || '').trim()
  profile.value.name = [cleanFirst, cleanLast].filter(Boolean).join(' ').trim() || profile.value.name
  if (birth) profile.value.birthDate = birth
  if (death) profile.value.deathDate = death
  biographyTitle.value = bt ?? biographyTitle.value
  biography.value = bio ?? biography.value
  showEdit.value = false
}

function onSaveUpload(items) {
  // items: Array<{ type: 'image'|'video', url: string, name?: string, title?: string }>
  memoryItems.value.push(...items)
  currentPage.value = Math.ceil(memoryItems.value.length / itemsPerPage)
  showUpload.value = false
}

function onSaveFamily({ parents, children }) {
  if (Array.isArray(parents)) heritageData.value.parents = parents
  if (Array.isArray(children)) heritageData.value.children = children
  showAddFamily.value = false
}

function onTabClick(tab) {
  activeTopTab.value = tab
  if (tab === 'Memory Lane' && !memoryModalOpened) {
    showUpload.value = true
    memoryModalOpened = true
  }
}

// Top navigation (tabs)
const topTabs = ['Life Journey', 'Memory Lane', 'Heritage', 'Cherish Board']
const activeTopTab = ref(topTabs[0])

const cherishBoardEntries = ref([
  { name: 'Angelita Agdan', date: 'August 5, 2025', message: 'We miss you lola Corrie.' },
  { name: 'Tonch Quiamzon', date: 'August 13, 2025', message: 'You will be forever in our hearts. Mamimiss ko ang tawanan natin kapag pumupunta ako sa inyo. :(' }
])

// Profile data (placeholders, dynamic-ready)
const profile = ref({
  name: 'Corona Aquino',
  birthDate: '1937-03-12',
  deathDate: '2025-02-27'
})

// Helpers for hero placeholders
const coverUrl = ref(coverPlaceholder())
const avatarUrl = ref(avatarPlaceholder(profile.value.name))

// Cover upload handling
const coverFileInput = ref(null)
function pickCoverFile() {
  if (coverFileInput?.value) coverFileInput.value.click()
}
function onCoverFileChange(e) {
  const file = e?.target?.files && e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { coverUrl.value = reader.result }
  reader.readAsDataURL(file)
  // reset input so selecting the same file later still triggers change
  e.target.value = ''
}
const avatarFileInput = ref(null)
function pickAvatarFile() {
  if (avatarFileInput?.value) avatarFileInput.value.click()
}
function onAvatarFileChange(e) {
  const file = e?.target?.files && e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { avatarUrl.value = reader.result }
  reader.readAsDataURL(file)
  e.target.value = ''
}
const dateRange = computed(() => `${formatDate(profile.value.birthDate)} - ${formatDate(profile.value.deathDate)}`)

function formatDate(d) {
  try {
    const dt = new Date(d)
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(dt)
  } catch (e) {
    return d
  }
}

function coverPlaceholder() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='450'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#f8cdd6' />
        <stop offset='50%' stop-color='#f6e7a8' />
        <stop offset='100%' stop-color='#cfe6d7' />
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#5f5f5f' font-family='system-ui, -apple-system, Segoe UI, Roboto, sans-serif' font-size='30' font-weight='600'>Cover Photo Placeholder</text>
  </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function avatarPlaceholder(name = 'C') {
  const initial = (name || 'C').trim().charAt(0).toUpperCase()
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>
    <defs>
      <linearGradient id='ga' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#c1d8b6' />
        <stop offset='100%' stop-color='#7aa86c' />
      </linearGradient>
    </defs>
    <circle cx='90' cy='90' r='90' fill='url(#ga)' />
    <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' fill='#1f2d1f' font-family='system-ui, -apple-system, Segoe UI, Roboto, sans-serif' font-size='72' font-weight='700'>${initial}</text>
  </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}


function placeholderUrl(text, color = '#EEE') {
  // SVG data URL with dynamic background color and label text
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
    <defs>
      <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
        <stop offset='0%' stop-color='${color}' />
        <stop offset='100%' stop-color='#ffffff' stop-opacity='0.9' />
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#666' font-family='system-ui, -apple-system, Segoe UI, Roboto, sans-serif' font-size='36' font-weight='600'>${text}</text>
  </svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

</script>

<style scoped>

</style>
