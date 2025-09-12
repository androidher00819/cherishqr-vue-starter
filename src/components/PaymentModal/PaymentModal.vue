<template>
  <teleport to="body">
    <div v-if="show" class="pay-backdrop" @click.self="$emit('close')">
      <div class="pay-modal" role="dialog" aria-modal="true" aria-labelledby="pay-title">
        <div class="pay-header">
          <div class="pay-brand">
            <img src="/src/assets/image/logo.png" alt="Cherish QR Logo" class="pay-logo" />
          </div>
        </div>
        <div class="pay-body">
          <div id="pay-title" class="pay-title">Payment Summary</div>
          <hr class="pay-divider" />
          <div v-if="isThemePremium" class="pay-row"><span>Premium Theme</span><span>₱ {{ prices.premiumTheme.toFixed(2) }}</span></div>
          <div v-if="isMusicPremium" class="pay-row"><span>Premium Music</span><span>₱ {{ prices.premiumMusic.toFixed(2) }}</span></div>
          <div v-if="includeExtended" class="pay-row"><span>Extended Duration (5 min)</span><span>₱ {{ prices.extended5min.toFixed(2) }}</span></div>
          <hr class="pay-divider" />
          <div class="pay-row pay-total"><span>Total</span><span>₱ {{ total.toFixed(2) }}</span></div>
          <div class="pay-actions">
            <button type="button" class="pay-btn" @click="$emit('confirm')">Confirm & Pay</button>
          </div>
          <div class="pay-providers">
            <span class="pay-provider gcash"><img src="/src/assets/image/gcash.png" alt="GCash" class="gcash-img" /></span>
            <span class="pay-provider card"><i class="fa-solid fa-credit-card" aria-hidden="true"></i> </span>
            <span class="pay-provider paypal"><img src="/src/assets/image/paypal.png" alt="PayPal" class="paypal-img" /></span>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script src="./PaymentModal.js"></script>
<style scoped src="./PaymentModal.css"></style>