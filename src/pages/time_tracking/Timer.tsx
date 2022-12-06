import * as React from 'react'
import { secondToHour } from '../../utils/helpers/secondToHour'
import { useInterval } from '../../utils/hooks/useInterval'

interface TimerProps {
  initialSecond: number
  isWorking: boolean
}

function Timer({ initialSecond, isWorking }: TimerProps) {
  const [second, setSecond] = React.useState(initialSecond)
  function interval() {
    setSecond(s => s + 1)
  }

  // second % 60 === 0 && console.log(second)

  useInterval(interval, isWorking ? 1000 : null)

  return <>{secondToHour(second)}</>
}

export default Timer
