import { computed, signal } from "kaioken"
import { count, double, isTracking } from "../signals"

export const GlobalComputedExample = () => {
  const onInc = () => {
    count.value += 1
  }

  const onSwitch = () => {
    isTracking.value = !isTracking.value
    console.log("calling on switch metohd")
  }

  return (
    <div className="flex flex-col">
      <h1>Count: {count}</h1>
      <h1>Double: {double}</h1>
      <h1>is tracking: {`${isTracking}`}</h1>

      <button className="mt-4 text-left" onclick={onInc}>
        Increment
      </button>
      <button className="text-left" onclick={onSwitch}>
        Switch tracking
      </button>
    </div>
  )
}

export const LocalComputedExample = () => {
  const localCount = signal(0, "local count")
  const localIsTracking = signal(false, "local is tracking")
  const localDouble = computed(() => {
    if (localIsTracking.value) {
      return localCount.value * 2
    }

    return 0
  }, "local double")

  const localQuad = computed(() => {
    return localDouble.value * 2
  }, "local quadruble")

  const onInc = () => {
    localCount.value += 1
  }

  const onSwitch = () => {
    localIsTracking.value = !localIsTracking.value
  }

  return (
    <div className="flex flex-col">
      <h1>Count: {localCount}</h1>
      <h1>Double: {localDouble}</h1>
      <h1>Quadruple: {localQuad}</h1>
      <h1>is tracking: {`${localIsTracking}`}</h1>

      <button className="mt-4 text-left" onclick={onInc}>
        Increment
      </button>
      <button className="text-left" onclick={onSwitch}>
        Switch tracking
      </button>
    </div>
  )
}
