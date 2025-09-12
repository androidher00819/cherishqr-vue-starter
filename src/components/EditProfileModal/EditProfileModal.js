import { reactive, watch, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'EditProfileModal',
  props: {
    show: { type: Boolean, default: false },
    initial: {
      type: Object,
      default: () => ({ firstMiddleName: '', lastName: '', birth: '', death: '', biographyTitle: '', biography: '' })
    }
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const form = reactive({ firstMiddleName: '', lastName: '', birth: '', death: '', biographyTitle: '', biography: '' })

    function resetForm() {
      form.firstMiddleName = props.initial?.firstMiddleName || ''
      form.lastName = props.initial?.lastName || ''
      form.birth = props.initial?.birth || ''
      form.death = props.initial?.death || ''
      form.biographyTitle = props.initial?.biographyTitle || ''
      form.biography = props.initial?.biography || ''
    }

    watch(() => props.show, (v) => { if (v) resetForm() })
    watch(() => props.initial, () => { if (props.show) resetForm() }, { deep: true })

    function onClose() { emit('close') }
    function onSave() { emit('save', { ...form }) }

    function onKey(e) { if (e.key === 'Escape') onClose() }

    onMounted(() => window.addEventListener('keydown', onKey))
    onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

    return { form, onClose, onSave }
  }
}