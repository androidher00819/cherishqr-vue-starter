<template>
  <teleport to="body">
    <div v-if="show" class="epm-backdrop" @click.self="onClose">
      <div class="epm-modal" role="dialog" aria-modal="true" aria-labelledby="afm-title">
        <form @submit.prevent="onSave">
          <div class="epm-section">
            <div class="epm-row">
              <div class="epm-col-full">
                <div class="epm-label">ADD FAMILY MEMBERS</div>
              </div>
            </div>
            <div class="epm-row">
              <div class="epm-col">
                <div class="epm-label">PARENTS (FULL NAMES)</div>
                <input v-model="parentsInput" type="text" class="epm-input" placeholder="e.g. Andrea De Castro, Ambrosio De Castro" />
                <div class="epm-hint">Separate multiple names with commas</div>
              </div>
              <div class="epm-col">
                <div class="epm-label">CHILDREN (FULL NAMES)</div>
                <input v-model="childrenInput" type="text" class="epm-input" placeholder="e.g. Reynaldo Balan, Jesse Balan" />
                <div class="epm-hint">Separate multiple names with commas</div>
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

<script src="./AddFamilyMemberModal.js"></script>
<style scoped src="./AddFamilyMemberModal.css"></style>