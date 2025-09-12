<template>
  <teleport to="body">
    <div v-if="show" class="umm-backdrop" @click.self="onClose">
      <div class="umm-modal" role="dialog" aria-modal="true">
        <form @submit.prevent="emitSave">
          <div class="umm-section">
            <div class="umm-title">Upload Photos/Videos</div>

            <!-- Dropzone -->
            <div
              class="umm-dropzone"
              :class="{ dragging: isDragging }"
              @dragover.prevent="onDragOver"
              @dragleave="onDragLeave"
              @drop.prevent="onDrop"
            >
              <input ref="fileInput" class="d-none" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4" multiple @change="onFilesSelected" />
              <button type="button" class="umm-btn umm-btn-outline" @click="pickFiles">
                <i class="bi bi-upload me-1"></i> Choose Files
              </button>
              <div class="umm-hint">Drag & drop files here or click Choose Files. You can select multiple files. Supported images: JPG, JPEG, PNG, WEBP, GIF. Supported videos: MP4.</div>
            </div>

            <div v-if="previews.length" class="umm-previews">
              <div v-for="(p, i) in previews" :key="i" class="umm-preview">
                <img v-if="p.type==='image'" :src="p.url" />
                <video v-else :src="p.url" muted></video>
                <button type="button" class="umm-remove" @click="remove(i)"><i class="bi bi-x-lg"></i></button>
                <input v-model="p.title" type="text" class="umm-title-input" placeholder="Enter title" />
                <div class="umm-name" :title="p.name">{{ p.name }}</div>
              </div>
            </div>
          </div>
          <div class="umm-actions">
            <button type="button" class="umm-btn umm-btn-outline" @click="onClose">Close</button>
            <button type="submit" class="umm-btn umm-btn-primary" :disabled="!previews.length">Save</button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script src="./UploadMediaModal.js"></script>
<style scoped src="./UploadMediaModal.css"></style>