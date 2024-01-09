import type { Rec, RouteChildProps, VNode } from "./types"
import { createElement, fragment } from "./index.js"
import { isVNode } from "./utils.js"
import { useState, useEffect } from "./hooks/index.js"

export { Router, Route, Link, navigate }

interface RouterProps {
  basePath?: string
  children?: JSX.Element[]
}

type RouterState = {
  path: string
  search: string
}

function Router(props: RouterProps) {
  const [state, setState] = useState({
    path: window.location.pathname,
    search: window.location.search,
  } as RouterState)

  useEffect(() => {
    const handler = () => {
      setState({
        path: window.location.pathname,
        search: window.location.search,
      })
    }
    window.addEventListener("popstate", handler)
    return () => window.removeEventListener("popstate", handler)
  }, [])

  for (const child of props.children ?? []) {
    if (isRoute(child)) {
      const { match, params, query } = matchPath(
        state.path,
        state.search,
        (props.basePath || "") + child.props.path
      )
      if (match) {
        return fragment({
          children: [createElement(child.props.element, { params, query })],
        }) as JSX.Element
      }
    }
  }

  return null
}

type RouteComponentFunc = (props: RouteChildProps) => JSX.Element | null

interface RouteComponentProps {
  path: string
  element: RouteComponentFunc
}

function isRoute(
  thing: unknown
): thing is VNode & { props: RouteComponentProps } {
  return isVNode(thing) && thing.type === Route
}

function Route({ path, element }: RouteComponentProps) {
  return createElement(Route, { path, element })
}

function navigate(to: string) {
  window.history.pushState({}, "", to)
  var popStateEvent = new PopStateEvent("popstate", { state: {} })
  dispatchEvent(popStateEvent)
}

function Link({ to, children }: { to: string; children?: JSX.Element }) {
  return createElement(
    "a",
    {
      href: to,
      onClick: (e: Event) => {
        e.preventDefault()
        navigate(to)
      },
    },
    children
  )
}

function matchPath(
  value: string,
  query: string,
  routePath: string
): {
  match: RegExpMatchArray | null
  params: any
  query: any
} {
  let paramNames: any[] = []
  let _query: any = {}

  const cPath: string = routePath
  let regexPath =
    cPath.replace(/([:*])(\w+)/g, (_full, _colon, name) => {
      paramNames.push(name)
      return "([^/]+)"
    }) + "(?:/|$)"

  // match query params
  if (query.length) {
    _query = query
      .split("?")[1]
      .split("&")
      .reduce((str, value) => {
        if (str === null) _query = {}
        const [key, val] = value.split("=")
        _query[key] = val
        return _query
      }, null)
  }

  let params: any = {}
  let match = value.split("?")[0].match(new RegExp(regexPath))
  if (match !== null) {
    params = match.slice(1).reduce((acc, value, index) => {
      acc[paramNames[index]] = value.split("?")[0] // ensure no query params
      return acc
    }, {} as Rec)
  }
  return { match, params, query: _query }
}
