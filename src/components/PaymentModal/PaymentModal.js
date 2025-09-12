// External script for PaymentModal.vue (Options API)
// Export a component options object because <script src> expects a default export
export default {
  name: 'PaymentModal',
  props: {
    show: { type: Boolean, default: false },
    isThemePremium: { type: Boolean, default: false },
    isMusicPremium: { type: Boolean, default: false },
    includeExtended: { type: Boolean, default: false },
    prices: { type: Object, required: true },
    total: { type: Number, required: true },
  },
}