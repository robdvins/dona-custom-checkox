<script setup lang="ts">
import { interpolate } from 'flubber'
import { animate } from 'motion'
import { ref } from 'vue'

const checked = ref(false)
const path = ref<HTMLElement | null>(null)
const line = ref<HTMLElement | null>(null)
const check = ref<HTMLElement | null>(null)

const paths = [
  'M0 7a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H5a5 5 0 0 1-5-5V7Z',
  'M1.585 8.962c-.386-.966-.67-2.028-.313-3.005a4.513 4.513 0 0 1 2.684-2.685c.978-.357 2.04-.073 3.006.313 1.95.78 4.126.78 6.076 0 .966-.386 2.028-.67 3.006-.313a4.513 4.513 0 0 1 2.684 2.685c.357.977.073 2.04-.313 3.005a8.179 8.179 0 0 0 0 6.076c.387.966.67 2.028.313 3.006a4.513 4.513 0 0 1-2.684 2.684c-.978.357-2.04.073-3.006-.313a8.179 8.179 0 0 0-6.076 0c-.966.387-2.028.67-3.005.313a4.513 4.513 0 0 1-2.685-2.684c-.357-.978-.073-2.04.313-3.006.78-1.95.78-4.126 0-6.076Z',
  'M0 7a5 5 0 0 1 5-5h10a5.002 5.002 0 0 1 4.83 3.71c.625 2.316 3.92 3.892 3.92 6.29s-3.295 3.974-3.92 6.29A5.002 5.002 0 0 1 15 22H5a5 5 0 0 1-5-5V7Z'
]
const d = ref(paths[0])

const interpolator1 = interpolate(paths[0], paths[1], { maxSegmentLength: 0.1 })
const interpolator2 = interpolate(paths[1], paths[2], { maxSegmentLength: 0.1 })
const interpolator3 = interpolate(paths[2], paths[0], { maxSegmentLength: 0.1 })
const drawCheck = (progress: number) => ({ strokeDashoffset: 1 - progress, visibility: 'visible' })

// NOTE: For now, animation is only when check and not when uncheck.
async function toggleCheck() {
  if (!path.value || !line.value || !check.value) return

  // Phase 1
  animate(path.value, { fill: '#1F2937' }, { duration: 0.3 })
  await animate((progress) => (d.value = interpolator1(progress)), {
    duration: 0.25,
    easing: 'ease'
  }).finished

  // Phase 2
  animate(line.value, { visibility: 'visible', width: '100%', scaleY: 1, left: '0px' }, { duration: 0.5, delay: 0.1 })
  animate(check.value, drawCheck(1), { duration: 0.3, delay: 0.1 })
  await animate((progress) => (d.value = interpolator2(progress)), {
    duration: 0.25,
    easing: 'ease'
  }).finished

  // Phase 3
  await animate((progress) => (d.value = interpolator3(progress)), {
    duration: 0.25,
    easing: 'ease'
  }).finished
}
</script>

<template>
  <div class="flex items-center rounded-lg bg-white p-4">
    <label for="x" class="flex w-full cursor-pointer items-center overflow-hidden text-gray-800">
      <input type="checkbox" id="x" v-model="checked" class="hidden" @click="toggleCheck" />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="flex h-6 w-6 items-center justify-center text-gray-300 transition-all duration-200 hover:text-gray-400/70">
        <path ref="path" :d="d" fill="currentColor" />
        <path id="check" ref="check" class="invisible" d="M6 12.3803L9.00552 15L14 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1" stroke-dashoffset="1" pathLength="1" fill="none"></path>
      </svg>

      <p class="relative ml-1 mb-0.5 select-none text-sm">
        No verás todo a menos que lo veas desde afuera.
        <span ref="line" class="invisible absolute -left-3 top-2.5 h-0.5 w-5 scale-y-[1.5] rounded-full bg-gray-800"></span>
      </p>
    </label>
  </div>
</template>
