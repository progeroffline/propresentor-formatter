import * as React from "react"

// Shared by ThemeProvider and LocaleProvider: read/write a string value in
// localStorage, validate it against a type guard, and stay in sync with
// changes made from another tab via the "storage" event. Kept in one place
// so a fix to this persistence behavior (e.g. handling localStorage.clear()
// producing event.key === null) only has to be made once.
export function usePersistedState<T extends string>(
  storageKey: string,
  defaultValue: T,
  isValid: (value: string) => value is T
): [T, (update: T | ((current: T) => T)) => void] {
  const [value, setValueState] = React.useState<T>(() => {
    const stored = localStorage.getItem(storageKey)
    return stored !== null && isValid(stored) ? stored : defaultValue
  })

  // Mirrors `value` so setValue can read the current value without relying
  // on the setState functional-updater form, keeping localStorage.setItem
  // (a side effect) out of the updater passed to setValueState.
  const valueRef = React.useRef(value)

  const setValue = React.useCallback(
    (update: T | ((current: T) => T)) => {
      const next =
        typeof update === "function"
          ? (update as (current: T) => T)(valueRef.current)
          : update

      localStorage.setItem(storageKey, next)
      valueRef.current = next
      setValueState(next)
    },
    [storageKey]
  )

  React.useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.storageArea !== localStorage || event.key !== storageKey) {
        return
      }

      const next =
        event.newValue !== null && isValid(event.newValue)
          ? event.newValue
          : defaultValue

      valueRef.current = next
      setValueState(next)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [defaultValue, isValid, storageKey])

  return [value, setValue]
}
