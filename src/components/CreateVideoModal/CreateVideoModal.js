import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import PaymentModal from '../PaymentModal/PaymentModal.vue'

export default {
  name: 'CreateVideoModal',
  components: { PaymentModal },
  props: {
    show: { type: Boolean, default: false },
    profileName: { type: String, default: '' }
  },
  emits: ['close', 'finish'],
  setup(props, { emit }) {
    const displayName = computed(() => props.profileName || '')

    const steps = ['UPLOAD PHOTOS', 'SELECT THEME', 'SELECT MUSIC', 'WRITE MESSAGE', 'GENERATE', 'PUBLISH']
    const currentStep = ref(1)

    const fileInput = ref(null)
    const isDragging = ref(false)
    const photos = ref([]) // { url, file }

    // THEME selection
    const themes = [
      { id: 'serenity', label: 'Serenity', bgClass: 't1' },
      { id: 'peaceful', label: 'Peaceful', bgClass: 't2' },
      { id: 'tranquility', label: 'Tranquility', bgClass: 't3' },
      { id: 'majestic', label: 'Majestic', bgClass: 't4', premium: true },
    ]
    const selectedTheme = ref('')
    function selectTheme(id) { selectedTheme.value = id }

    // MUSIC selection
    const musics = [
      { id: 'remembrance', label: 'Remembrance' },
      { id: 'nostalgia', label: 'Nostalgia' },
      { id: 'timeless', label: 'Timeless', premium: true },
      { id: 'solitude', label: 'Solitude' },
      { id: 'reflection', label: 'Reflection' },
      { id: 'eternal', label: 'Eternal', premium: true },
    ]
    const selectedMusic = ref('')
    const playingId = ref('')
    function toggleMusic(id) {
      selectedMusic.value = id
      playingId.value = playingId.value === id ? '' : id
    }

    // MESSAGE
    const messageText = ref('In loving memory of')
    const messagePosition = ref('beginning') // 'beginning' | 'end'
    const messageStyle = ref('classic')
    const messageStyleClass = computed(() => ({ classic: 'style-classic', modern: 'style-modern', serif: 'style-serif' }[messageStyle.value]))

    // GENERATE
    const duration = ref('3')
    const creating = ref(false)
    const themeLabel = computed(() => themes.find(t => t.id === selectedTheme.value)?.label || '—')
    const musicLabel = computed(() => musics.find(m => m.id === selectedMusic.value)?.label || '—')
    const themeBgClass = computed(() => themes.find(t => t.id === selectedTheme.value)?.bgClass || '')

    // Payment modal state and pricing
    const showPayment = ref(false)
    const paidExtended = ref(false)
    const PRICES = { premiumTheme: 149, premiumMusic: 99, extended5min: 199 }
    const isThemePremium = computed(() => !!themes.find(t => t.id === selectedTheme.value && t.premium))
    const isMusicPremium = computed(() => !!musics.find(m => m.id === selectedMusic.value && m.premium))
    const totalAmount = computed(() => {
      let total = 0
      if (isThemePremium.value) total += PRICES.premiumTheme
      if (isMusicPremium.value) total += PRICES.premiumMusic
      if (duration.value === '5') total += PRICES.extended5min
      return total
    })

    function onVideoClick() {
      if (duration.value === '5' && !paidExtended.value) {
        showPayment.value = true
      }
    }
    function closePayment() { showPayment.value = false }
    function confirmPayment() {
      paidExtended.value = true
      showPayment.value = false
      createVideo()
    }

    function onClose() { emit('close') }
    function onKey(e) { if (e.key === 'Escape') onClose() }

    onMounted(() => window.addEventListener('keydown', onKey))
    onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

    function pickFiles() { fileInput.value?.click() }
    function onFilesSelected(e) {
      const files = Array.from(e?.target?.files || [])
      addPhotos(files)
      e.target.value = ''
    }
    function onDragOver() { isDragging.value = true }
    function onDragLeave() { isDragging.value = false }
    function onDrop(e) {
      isDragging.value = false
      addPhotos(Array.from(e?.dataTransfer?.files || []))
    }
    function addPhotos(files) {
      for (const f of files) {
        if (!f.type.startsWith('image')) continue
        const url = URL.createObjectURL(f)
        photos.value.push({ url, file: f })
      }
    }
    function remove(i) {
      const [p] = photos.value.splice(i, 1)
      if (p?.url) URL.revokeObjectURL(p.url)
    }

    function goToStep(n) { currentStep.value = n }
    function next() {
      if (currentStep.value === 1 && !photos.value.length) return
      if (currentStep.value === 2 && !selectedTheme.value) return
      if (currentStep.value === 3 && !selectedMusic.value) return
      if (currentStep.value < 6) currentStep.value++
    }
    function prev() { if (currentStep.value > 1) currentStep.value-- }
    function createVideo() {
      if (duration.value === '5' && !paidExtended.value) {
        showPayment.value = true
        return
      }
      creating.value = true
      setTimeout(() => { creating.value = false; currentStep.value = 6 }, 1200)
    }
    function downloadMp4() {
      const blob = new Blob(["Your memorial video is ready."], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'memorial-video.mp4'
      a.click()
      URL.revokeObjectURL(url)
    }
    function viewInJourney() {
      emit('finish', { photos: photos.value.length, theme: selectedTheme.value, music: selectedMusic.value, duration: duration.value })
    }
    function finish() {
      emit('finish', {
        photos: photos.value.map(p => ({ name: p.file?.name, url: p.url })),
        theme: selectedTheme.value,
        music: selectedMusic.value,
        duration: duration.value,
        message: { text: messageText.value, position: messagePosition.value, style: messageStyle.value }
      })
      onClose()
    }

    return {
      // state
      steps, currentStep,
      fileInput, isDragging, photos,
      themes, selectedTheme, selectTheme,
      musics, selectedMusic, playingId, toggleMusic,
      messageText, messagePosition, messageStyle, messageStyleClass,
      duration, creating, themeLabel, musicLabel, themeBgClass,
      showPayment, PRICES, totalAmount, isThemePremium, isMusicPremium,
      displayName,
      // methods
      onClose, onKey,
      pickFiles, onFilesSelected, onDragOver, onDragLeave, onDrop, addPhotos, remove,
      goToStep, next, prev, createVideo, downloadMp4, viewInJourney, finish,
      onVideoClick, closePayment, confirmPayment
    }
  }
}