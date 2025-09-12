<template>
  <teleport to="body">
    <div v-if="show" class="cvm-backdrop" @click.self="onClose">
      <div class="cvm-modal" role="dialog" aria-modal="true" aria-labelledby="cvm-title">
        <div class="cvm-header">
          <ol class="cvm-steps" role="tablist" aria-label="Create Video Steps">
            <li
              v-for="(s, i) in steps"
              :key="i"
              :class="['cvm-step', { active: currentStep === i+1 }]"
              role="tab"
              :aria-selected="currentStep === i+1"
              :tabindex="currentStep === i+1 ? 0 : -1"
              @click="goToStep(i+1)"
            >
              <span class="cvm-step-index">{{ i+1 }}</span>
              <span class="cvm-step-label">{{ s }}</span>
            </li>
          </ol>
        </div>

        <div class="cvm-body">
          <!-- Step 1: Upload Photos -->
          <section v-show="currentStep === 1" class="cvm-panel">
            <div class="cvm-section-title">UPLOAD PHOTOS</div>
            <div class="cvm-card">
              <div class="cvm-dropzone" :class="{ dragging: isDragging }" @dragover.prevent="onDragOver" @dragleave="onDragLeave" @drop.prevent="onDrop">
                <input ref="fileInput" class="d-none" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple @change="onFilesSelected" />
                <button type="button" class="cvm-btn cvm-btn-outline" @click="pickFiles">Drag and drop photos here or click to browse</button>
                <div class="cvm-hint">Supported images: JPG, JPEG, PNG, WEBP, GIF.</div>
              </div>

              <div v-if="photos.length" class="cvm-previews">
                <div v-for="(p, i) in photos" :key="i" class="cvm-preview">
                  <img :src="p.url" alt="" />
                  <button type="button" class="cvm-remove" @click="remove(i)"><span aria-hidden>×</span></button>
                </div>
              </div>
            </div>
          </section>

          <!-- Step 2: Select Theme -->
          <section v-show="currentStep === 2" class="cvm-panel">
            <div class="cvm-section-title">SELECT THEME</div>
            <div class="cvm-theme-wrap">
              <div class="cvm-theme-grid">
                <button
                  v-for="t in themes"
                  :key="t.id"
                  type="button"
                  class="theme-card"
                  :class="{ selected: selectedTheme === t.id }"
                  @click="selectTheme(t.id)"
                >
                  <span class="theme-thumb" :class="t.bgClass">
                    <span class="theme-play"></span>
                  </span>
                  <span class="theme-name">
                    {{ t.label }}
                    <i v-if="t.premium" class="fa-solid fa-crown theme-crown" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
            </div>
          </section>

          <!-- Step 3: Select Music -->
          <section v-show="currentStep === 3" class="cvm-panel">
            <div class="cvm-section-title">SELECT MUSIC</div>
            <div class="cvm-music-wrap">
              <div class="music-grid">
                <button
                  v-for="m in musics"
                  :key="m.id"
                  type="button"
                  class="music-tile"
                  :class="{ selected: selectedMusic === m.id, playing: playingId === m.id, premium: m.premium }"
                  @click="toggleMusic(m.id)"
                >
                  <span class="music-icon" :class="{ pause: playingId === m.id }"></span>
                  <span class="music-name">{{ m.label }}</span>
                  <i v-if="m.premium" class="fa-solid fa-crown music-crown" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </section>

          <!-- Step 4: Write Message -->
          <section v-show="currentStep === 4" class="cvm-panel">
            <div class="cvm-section-title">WRITE DEDICATION MESSAGE</div>
            <div class="cvm-dual">
              <div class="cvm-left cvm-card">
                <label class="cvm-label">WRITE DEDICATION MESSAGE</label>
                <input v-model="messageText" class="cvm-input" type="text" placeholder="In loving memory of" />

                <div class="option-group">
                  <label class="radio-pill">
                    <input type="radio" v-model="messagePosition" value="beginning" />
                    <span>Beginning</span>
                  </label>
                  <label class="radio-pill">
                    <input type="radio" v-model="messagePosition" value="end" />
                    <span>End</span>
                  </label>
                </div>

                <select v-model="messageStyle" class="select-control">
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                  <option value="serif">Serif</option>
                </select>
              </div>
              <div class="cvm-right cvm-card">
                <div class="preview-box">
                  <div class="preview-text" :class="messageStyleClass">
                    {{ messageText }}<br />
                    {{ displayName }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Step 5: Generate -->
          <section v-show="currentStep === 5" class="cvm-panel generate-step">
            <div class="cvm-section-title">GENERATE</div>
            <div class="cvm-card">
              <div class="cvm-dual generate-wrap">
                <div class="cvm-left">
                  <div class="cvm-video-mock" :class="themeBgClass" @click="onVideoClick">
                    <video class="mock-video" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" autoplay muted loop playsinline></video>
                    <div class="mock-caption">
                      {{ messageText }}<br />
                      {{ displayName }}
                    </div>
                  </div>
                </div>
                <div class="cvm-right cvm-summary">
                  <div class="summary-line"><span class="summary-title">“{{ messageText }}
                    <br />
                      {{ displayName }}”</span></div>

                  <div class="summary-duo">
                    <div class="duo-item">
                      <span class="summary-label">Theme:</span>
                      <span class="summary-chip">
                        <span class="mini-thumb" :class="themeBgClass"></span>
                        <span class="summary-value">{{ themeLabel }}</span>
                      </span>
                    </div>
                    <div class="duo-item">
                      <span class="summary-label">Music:</span>
                      <span class="summary-chip">
                        <i class="fa-solid fa-music summary-music-icon" aria-hidden="true"></i>
                        <span class="summary-value">{{ musicLabel }}</span>
                      </span>
                    </div>
                  </div>

                  <div class="summary-row">
                    <span class="summary-label">Video Duration:</span>
                    <div class="option-group">
                      <label class="radio-pill"><input type="radio" v-model="duration" value="3" /><span>3 Minutes</span></label>
                      <label class="radio-pill"><input type="radio" v-model="duration" value="5" /><span>5 Minutes (Paid)</span></label>
                    </div>
                  </div>
                  <div class="center">
                    <button type="button" class="cvm-btn cvm-btn-primary large create-video-btn" @click="createVideo" :disabled="creating"><span class="theme-play-small"></span>Create Video</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Step 6: Publish -->
          <section v-show="currentStep === 6" class="cvm-panel publish-step">
            <div class="cvm-section-title">PUBLISH</div>
            <div class="cvm-card">
              <div class="cvm-dual publish-wrap">
                <div class="cvm-left">
                  <div class="cvm-video-mock ready" :class="themeBgClass">
                    <video class="cvm-video" controls preload="metadata" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"></video>
                    <div class="mock-caption">{{ messageText }}<br />{{ displayName }}</div>
                  </div>
                </div>
                <div class="cvm-right publish-box">
                  <h3 class="publish-title">Your Memorial Video Is Ready.</h3>
                  <button type="button" class="cvm-btn cvm-btn-primary large" @click="downloadMp4">Download MP4</button>
                  <button type="button" class="link-btn" @click="viewInJourney">View In Life Journey Page</button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="cvm-footer">
          <div class="spacer"></div>
          <div class="cvm-actions">
            <button type="button" class="cvm-btn cvm-btn-outline" @click="onClose">Close</button>
            <button v-if="currentStep > 1" type="button" class="cvm-btn cvm-btn-outline" @click="prev">Back</button>
            <button
              v-if="currentStep < 6 && currentStep !== 5"
              type="button"
              class="cvm-btn cvm-btn-primary"
              :disabled="(currentStep === 1 && !photos.length) || (currentStep === 2 && !selectedTheme) || (currentStep === 3 && !selectedMusic)"
              @click="next"
            >Next</button>
            <button v-else type="button" class="cvm-btn cvm-btn-primary" @click="finish">Done</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Payment Overlay -->
    <PaymentModal
      :show="showPayment"
      :isThemePremium="isThemePremium"
      :isMusicPremium="isMusicPremium"
      :includeExtended="duration === '5'"
      :prices="PRICES"
      :total="totalAmount"
      @close="closePayment"
      @confirm="confirmPayment"
    />
  </teleport>
</template>

<script src="./CreateVideoModal.js"></script>
<style scoped src="./CreateVideoModal.css"></style>