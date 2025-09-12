import { computed } from 'vue'
import logoUrl from '../../assets/image/logo.png'

export default {
  name: 'LogoLoader',
  props: {
    label: { type: String, default: 'Loading' },
    size: { type: [Number, String], default: 100 },
    speed: { type: String, default: '1s' },
    textSize: { type: String, default: '1.2rem' },
    orientation: { type: String, default: 'vertical' },
  },
  setup(props) {
    const sizePx = computed(() => typeof props.size === 'number' ? `${props.size}px` : props.size)
    const orientationClass = computed(() => props.orientation === 'horizontal' ? 'is-horizontal' : 'is-vertical')
    const { speed, textSize } = props
    return { logoUrl, sizePx, orientationClass, speed, textSize }
  }
}