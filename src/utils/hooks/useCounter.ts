import { useLocalStorage } from './useLocalStorage'

interface Options {
  initialValue?: number
  maxValue?: number
  minValue?: number
  step?: number
  lsKey: string
}

/**
 * @returns Tuple [count, increment, decrement, reset, setCount]
 */
function useCounter(
  { lsKey, initialValue = 0, maxValue = Infinity, minValue = -Infinity, step = 1 } = {} as Options,
) {
  const [value, setValue] = useLocalStorage(lsKey, initialValue)

  function increment() {
    setValue(x => {
      const newValue = x + step
      return newValue > maxValue ? maxValue : newValue
    })
  }

  function decrement() {
    setValue(x => {
      const newValue = x - step
      return newValue < minValue ? minValue : newValue
    })
  }

  const reset = () => setValue(initialValue)

  return [value, increment, decrement, reset, setValue] as const
}

export default useCounter
