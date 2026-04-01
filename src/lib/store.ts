'use client'

import { useState, useCallback } from 'react'
import type { Task, Idea, Focus } from './data'
import { INITIAL_TASKS, INITIAL_FOCUS } from './data'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next =
          typeof value === 'function'
            ? (value as (prev: T) => T)(prev)
            : value
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // ignore write errors
        }
        return next
      })
    },
    [key]
  )

  return [stored, setValue]
}

export function useTasks() {
  return useLocalStorage<Task[]>('ryp-tasks', INITIAL_TASKS)
}

export function useIdeas() {
  return useLocalStorage<Idea[]>('ryp-ideas', [])
}

export function useFocus() {
  return useLocalStorage<Focus>('ryp-focus', INITIAL_FOCUS)
}
