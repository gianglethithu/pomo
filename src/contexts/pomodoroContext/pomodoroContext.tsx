import * as React from 'react'
import { SetValue } from '../../types'
import { LSKey } from '../../utils/constants/localStorageKey'
import { useInterval } from '../../utils/hooks/useInterval'
import notification from '../../assets/pomodoro_notification.mp3'

const noti = new Audio(notification)

type TPomodoroStatus = 'idle' | 'working' | 'pause' | 'relaxing'

interface PomodoroContextType {
  pomodoroStatus: TPomodoroStatus
  setPomodoroStatus: SetValue<TPomodoroStatus>
  lineIndex: number
  setLineIndex: SetValue<number>
  pomodoroTimerRef: React.MutableRefObject<number>
  nextStatus: Extract<'working' | 'relaxing', TPomodoroStatus>
}

const PomodoroContext = React.createContext<PomodoroContextType | undefined>(undefined)
PomodoroContext.displayName = 'PomodoroContext'

function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [pomodoroStatus, setPomodoroStatus] = React.useState<TPomodoroStatus>('idle')
  const [lineIndex, setLineIndex] = React.useState<number>(0)
  const pomodoroTimerRef = React.useRef(NaN)

  const pomodoroDuration = Number(window.localStorage.getItem(LSKey.POMODORO_DURATION) ?? 25)
  const breakDuration = Number(window.localStorage.getItem(LSKey.BREAK_DURATION) ?? 5)
  const pomodoroCount = Number(window.localStorage.getItem(LSKey.POMODORO_COUNT) ?? 4)
  const auto = window.localStorage.getItem(LSKey.POMODORO_AUTO) === 'true'
  const sound = window.localStorage.getItem(LSKey.POMODORO_SOUND) === 'true'
  const sync = window.localStorage.getItem(LSKey.POMODORO_SYNC) === 'true'

  const isWorking = pomodoroStatus === 'working'
  const isRelaxing = pomodoroStatus === 'relaxing'
  const nextStatus = lineIndex % 2 === 0 ? 'working' : 'relaxing'

  useInterval(
    () => {
      const newSecond = pomodoroTimerRef.current - 1
      // console.log(newSecond)
      if (newSecond < 0) {
        const nextLineIndex = lineIndex + 1
        pomodoroTimerRef.current = isWorking ? breakDuration * 60 : pomodoroDuration * 60
        setPomodoroStatus(auto ? (isWorking ? 'relaxing' : 'working') : 'idle')
        setLineIndex(nextLineIndex === pomodoroCount * 2 - 1 ? 0 : nextLineIndex)
        sound && noti.play()
      } else pomodoroTimerRef.current = newSecond
    },
    isWorking || isRelaxing ? 1000 : null,
  )

  const contextValue: PomodoroContextType = {
    pomodoroStatus,
    setPomodoroStatus,
    lineIndex,
    setLineIndex,
    pomodoroTimerRef,
    nextStatus,
  }

  return <PomodoroContext.Provider value={contextValue}>{children}</PomodoroContext.Provider>
}

function usePomodoroContext() {
  const context = React.useContext(PomodoroContext)
  if (context === undefined)
    throw new Error('usePomodoroContext must be used within a PomodoroProvider')
  return context
}

export { PomodoroProvider, usePomodoroContext }
