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

  const setValue = React.useCallback(
    (update: T | ((current: T) => T)) => {
      setValueState((current) => {
        const next =
          typeof update === "function"
            ? (update as (current: T) => T)(current)
            : update

        localStorage.setItem(storageKey, next)
        return next
      })
    },
    [storageKey]
  )

  React.useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.storageArea !== localStorage || event.key !== storageKey) {
        return
      }

      setValueState(
        event.newValue !== null && isValid(event.newValue)
          ? event.newValue
          : defaultValue
      )
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [defaultValue, isValid, storageKey])

  return [value, setValue]
}
