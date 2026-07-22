<template>
  <div class="stats-container">
    <StatItem :value="stats.words" label="words" />
    <StatItem :value="stats.characters" label="characters" />
    <StatItem :value="stats.paragraphs" label="paragraphs" />

    <StatItem
      v-if="bestHour"
      :value="`${String(bestHour.hour).padStart(2, '0')}:00`"
      :label="`${bestHour.wordsPerHour} w/h (${bestHour.minutes} min)`"
    />

    <StatItem v-else value="—" label="analytics" />

    <StatItem :value="stats.readingTimeMinutes" label="min read" />
  </div>
</template>

<script setup lang="ts">
import StatItem from "./StatItem.vue";

interface Props {
  stats: {
    words: number;
    characters: number;
    paragraphs: number;
    readingTimeMinutes: number;
  };

  bestHour: {
    hour: number;
    wordsPerHour: number;
    minutes: number;
  } | null;
}

defineProps<Props>();
</script>

<style>
.stats-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 12px 24px;
}
</style>
