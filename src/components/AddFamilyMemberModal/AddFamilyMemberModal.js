import { ref, watch } from 'vue'

export default {
  name: 'AddFamilyMemberModal',
  props: {
    show: { type: Boolean, default: false },
    initialParents: { type: Array, default: () => [] },
    initialChildren: { type: Array, default: () => [] },
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const parentsInput = ref('')
    const childrenInput = ref('')

    function parseList(v) {
      return (v || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    }

    function reset() {
      parentsInput.value = (props.initialParents || []).join(', ')
      childrenInput.value = (props.initialChildren || []).join(', ')
    }

    watch(() => props.show, (v) => { if (v) reset() })

    function onClose() { emit('close') }
    function onSave() {
      const parents = parseList(parentsInput.value)
      const children = parseList(childrenInput.value)
      emit('save', { parents, children })
    }

    return { parentsInput, childrenInput, onClose, onSave }
  }
}