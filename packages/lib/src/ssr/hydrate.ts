import type { GlobalContextOptions } from "../globalContext"
import { mount } from "../index.js"

export interface SSRProps {
  request: {
    path: string
    query: string
  }
}

export function hydrate<T extends Record<string, unknown>>(
  appFunc: (props: T) => JSX.Element,
  container: GlobalContextOptions,
  appProps?: T
): Kaioken.VNode

export function hydrate<T extends Record<string, unknown>>(
  appFunc: (props: T) => JSX.Element,
  container: HTMLElement,
  appProps?: T
): Kaioken.VNode

export function hydrate<T extends Record<string, unknown>>(
  appFunc: (props: T) => JSX.Element,
  optionsOrRoot: HTMLElement | GlobalContextOptions,
  appProps = {} as T
) {
  if (optionsOrRoot instanceof HTMLElement) {
    optionsOrRoot.innerHTML = ""
    return mount(appFunc, optionsOrRoot, appProps)
  }
  optionsOrRoot.root.innerHTML = ""
  return mount(appFunc, optionsOrRoot, appProps)
}
