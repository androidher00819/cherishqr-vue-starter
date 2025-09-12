<template>
  <teleport to="body">
    <div v-if="show" class="epm-backdrop" @click.self="onClose">
      <div class="epm-modal" role="dialog" aria-modal="true" aria-labelledby="epm-title">
        <!-- Header placeholder for accessibility; design shows field groups instead of a modal title -->
        <form @submit.prevent="onSave">
          <div class="epm-section">
            <div class="epm-row">
              <div class="epm-col">
                <div class="epm-label">NAME</div>
                <input v-model="form.firstMiddleName" type="text" class="epm-input" placeholder="First and Middle Name" />
              </div>
              <div class="epm-col">
                <div class="epm-label invisible">NAME</div>
                <input v-model="form.lastName" type="text" class="epm-input" placeholder="Last Name" />
              </div>
            </div>
            <div class="epm-row">
              <div class="epm-col">
                <div class="epm-label">BIRTH</div>
                <input v-model="form.birth" type="text" class="epm-input" placeholder="mm/dd/yyyy" />
              </div>
              <div class="epm-col">
                <div class="epm-label">DEATH</div>
                <input v-model="form.death" type="text" class="epm-input" placeholder="mm/dd/yyyy" />
              </div>
            </div>
            <!-- Biography Title -->
            <div class="epm-row">
              <div class="epm-col-full">
                <div class="epm-label">BIOGRAPHY TITLE</div>
                <input v-model="form.biographyTitle" type="text" class="epm-input" placeholder="Enter biography title" />
              </div>
            </div>
            <div class="epm-row">
              <div class="epm-col-full">
                <div class="epm-label">BIOGRAPHY</div>
                <textarea v-model="form.biography" class="epm-textarea" rows="10"></textarea>
              </div>
            </div>
          </div>

          <div class="epm-actions">
            <button type="button" class="epm-btn epm-btn-outline" @click="onClose">Close</button>
            <button type="submit" class="epm-btn epm-btn-primary">SAVE</button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script src="./EditProfileModal.js"></script>
<style scoped src="./EditProfileModal.css"></style>