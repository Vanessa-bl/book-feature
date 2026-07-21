<template>
  <div class="stat-item">
    <span class="stat-value">{{ value }}</span>
    <span class="stat-label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: string | number;
  label: string;
}

defineProps<Props>();
</script>

<style scoped>
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
}

.stat-label {
  font-size: 10px;
  color: #777777;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
