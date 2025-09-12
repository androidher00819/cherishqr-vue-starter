import { ref } from 'vue'

export default {
  name: 'UploadMediaModal',
  props: { show: { type: Boolean, default: false } },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const previews = ref([]) // { type:'image'|'video', url, name, title, file }
    const isDragging = ref(false)

    function onClose() { emit('close') }
    function pickFiles() { fileInput.value?.click() }

    function addFiles(files) {
      for (const f of files) {
        const isVideo = f.type.startsWith('video')
        const isImage = f.type.startsWith('image')
        if (!isVideo && !isImage) continue
        const url = URL.createObjectURL(f)
        previews.value.push({ type: isImage ? 'image' : 'video', url, name: f.name, title: '', file: f })
      }
    }

    function onFilesSelected(e) {
      const files = Array.from(e?.target?.files || [])
      addFiles(files)
      e.target.value = ''
    }

    function onDragOver() { isDragging.value = true }
    function onDragLeave() { isDragging.value = false }
    function onDrop(e) {
      isDragging.value = false
      const files = Array.from(e?.dataTransfer?.files || [])
      addFiles(files)
    }

    function remove(i) {
      const [p] = previews.value.splice(i, 1)
      if (p?.url) URL.revokeObjectURL(p.url)
    }

    function emitSave() {
      const items = previews.value.map(({ type, url, name, title }) => ({ type, url, name, title }))
      emit('save', items)
      // Revoke object URLs and clear previews to free memory
      for (const p of previews.value) { if (p?.url) URL.revokeObjectURL(p.url) }
      previews.value = []
    }

    return {
      fileInput, previews, isDragging,
      onClose, pickFiles, onFilesSelected, onDragOver, onDragLeave, onDrop, remove, emitSave
    }
  }
}