<template>
  <div class="stat-item">
    <span class="stat-value">{{ value }}</span>
    <div class="stat-meta">
      <span class="stat-label">{{ label }}</span>
      <span v-if="sublabel" class="stat-sublabel">{{ sublabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: string | number;
  label: string;
  sublabel?: string;
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

.stat-meta {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 10px;
  color: #777777;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-sublabel {
  font-size: 9px;
  color: #999999;
}
</style>
