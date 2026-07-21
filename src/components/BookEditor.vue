<template>
  <div class="editor-wrapper">
    <header class="editor-header">
      <span class="book-title">Book name</span>
    </header>
    <main class="editor-canvas">
      <p class="chapter-number">1</p>
      <input v-model="titleModel" class="chapter-title" type="text" />
      <editor-content :editor="editor" class="editor-content" />
    </main>
    <footer class="stats-bar">
      <WritingStats :stats="stats" :bestHour="bestHour" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { computed, watch } from "vue";

import { useEditorStats } from "@/composables/useEditorStats";
import { useChapters } from "@/composables/useChapters";
import { useWritingVelocity } from "@/composables/useWritingVelocity";
import { useWritingSessions } from "@/composables/useWritingSessions";

import WritingStats from "@/components/WritingStats.vue";

const { activeChapter, updateTitle } = useChapters();

const { sessions } = useWritingSessions();

const { onTextChange, bestHour } = useWritingVelocity(sessions);

const editor = useEditor({
  extensions: [StarterKit],
  content: "",
  autofocus: true,
});

const text = computed(() => editor.value?.getText() ?? "");

const { stats } = useEditorStats(text);

watch(
  () => stats.value.words,
  (words) => {
    onTextChange(words);
  },
);

const titleModel = computed({
  get: () => activeChapter.value?.title ?? "",
  set: (value) => {
    if (activeChapter.value) {
      updateTitle(activeChapter.value.id, value);
    }
  },
});
</script>

<style>
* {
  box-sizing: border-box;
}

.editor-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fafafa;
}

.editor-header {
  padding: 16px 32px;
  border-bottom: 1px solid #ebebeb;
}

.book-title {
  font-size: 13px;
  font-weight: 500;
  color: #999;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.editor-canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 24px 80px;
  overflow-y: auto;
}

.chapter-number {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #bbb;
  margin-bottom: 12px;
}

.chapter-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 40px;
  font-family: "Georgia", serif;
  border: none;
  outline: none;
  background: transparent;
  text-align: center;
  width: 100%;
  max-width: 620px;
}

.editor-content {
  width: 100%;
  max-width: 620px;
  min-height: 400px;
}

.editor-content .ProseMirror {
  outline: none;
  cursor: text;
  font-family: "Georgia", serif;
  font-size: 17px;
  line-height: 1.8;
  color: #1a1a1a;
  min-height: 400px;
  text-align: left;
  background-image: linear-gradient(
    to bottom,
    transparent 30px,
    #e5e5e5 30px,
    #e5e5e5 31px,
    transparent 31px
  );
  background-size: 100% 30.6px;
  background-position: 0 0;
  background-repeat: repeat-y;
}

.editor-content .ProseMirror p {
  background: transparent;
}

.editor-content .ProseMirror-trailingBreak {
  display: none;
}

.stats-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(250, 250, 250, 0.85);
  backdrop-filter: blur(8px);
  border-top: 1px solid #ebebeb;
}
</style>
