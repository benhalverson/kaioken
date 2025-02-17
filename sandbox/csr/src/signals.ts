import { computed, signal } from "kaioken"

export const count = signal(0, "count")

export const isTracking = signal(false, "isTracking")

export const double = computed(() => {
  if (isTracking.value) {
    return count.value * 2
  }

  return 0
}, "double")

/* export const quadruple = computed(() => {
  return double.value * 2
}, "quadruple") */

/* export const octoruple = computed(() => {
  return quadruple.value * 2
}, "octoruple") */
