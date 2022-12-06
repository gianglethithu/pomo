import { Circle, Line } from 'rc-progress'
import * as React from 'react'
import { VscDebugPause, VscDebugStop, VscPlay } from 'react-icons/vsc'
import { usePomodoroContext } from '../../contexts/pomodoroContext/pomodoroContext'
import { useInterval } from '../../utils/hooks/useInterval'

interface NewTimerProps {
  pomodoroCount: number
  /** in second */
  initialPomodoroDuration: number
  /** in second */
  initialBreakDuration: number
}

function NewTimer({ pomodoroCount, initialPomodoroDuration, initialBreakDuration }: NewTimerProps) {
  const {
    pomodoroStatus,
    setPomodoroStatus,
    pomodoroTimerRef,
    lineIndex,
    setLineIndex,
    nextStatus,
  } = usePomodoroContext()

  const [second, setSecond] = React.useState<number>(pomodoroTimerRef.current)

  const isWorking = pomodoroStatus === 'working'
  const isRelaxing = pomodoroStatus === 'relaxing'

  const lineArray = React.useMemo(
    () => new Array(pomodoroCount * 2 - 1).fill(undefined),
    [pomodoroCount],
  )

  useInterval(
    () => {
      const newSecond = second - 1
      if (newSecond < 0) {
        setSecond(isWorking ? initialBreakDuration : initialPomodoroDuration)
      } else setSecond(newSecond)
    },
    isWorking || isRelaxing ? 1000 : null,
  )

  const percent =
    100 -
    (second / (nextStatus === 'working' ? initialPomodoroDuration : initialBreakDuration)) * 100
  const mm = String(Math.floor(second / 60)).padStart(2, '0')
  const ss = String(second % 60).padStart(2, '0')

  function resetTimer() {
    setPomodoroStatus('idle')
    setSecond(initialPomodoroDuration)
    setLineIndex(0)
    pomodoroTimerRef.current = initialPomodoroDuration
  }

  return (
    <div className='flex grow flex-col items-center justify-center gap-6'>
      <div className='relative grid place-items-center'>
        <div className='pointer-events-none absolute font-mono text-5xl'>
          {mm}:{ss}
        </div>
        <Circle
          percent={percent}
          className='h-52 w-52'
          strokeWidth={6}
          strokeColor={{
            '0%': '#38bdf8', // sky 400
            '100%': '#fb7185', // rose 400
          }}
          trailWidth={6}
          trailColor='#334155' // slate 600
        />
      </div>
      {pomodoroStatus === 'idle' ? (
        <button
          className='rounded-full bg-slate-800 p-2 hover:bg-slate-700'
          onClick={() => setPomodoroStatus(nextStatus)}
        >
          <VscPlay className='h-7 w-7 translate-x-[2px]' />
        </button>
      ) : (
        <div className='flex gap-4'>
          <button className='rounded-full bg-slate-800 p-2 hover:bg-slate-700' onClick={resetTimer}>
            <VscDebugStop className='h-7 w-7' />
          </button>
          {isWorking || isRelaxing ? (
            <button
              className='rounded-full bg-slate-800 p-2 hover:bg-slate-700'
              onClick={() => setPomodoroStatus('pause')}
            >
              <VscDebugPause className='h-7 w-7' />
            </button>
          ) : (
            <button
              className='rounded-full bg-slate-800 p-2 hover:bg-slate-700'
              onClick={() => setPomodoroStatus(nextStatus)}
            >
              <VscPlay className='h-7 w-7 translate-x-[2px]' />
            </button>
          )}
        </div>
      )}
      <div className='flex flex-wrap justify-center gap-2'>
        {lineArray.map((_, index) => {
          const isDone = index < lineIndex
          const isDoing = index === lineIndex

          const currentPercent = isDone ? 100 : isDoing ? percent : 0
          if (index % 2 === 0) return <LongLine key={index} percent={currentPercent} />
          else return <ShortLine key={index} percent={currentPercent} />
        })}
      </div>
    </div>
  )
}

function LongLine({ percent }: { percent: number }) {
  return (
    <Line
      percent={percent}
      className='w-16'
      strokeColor='#38bdf8'
      strokeWidth={4}
      trailColor='#475569'
      trailWidth={4}
      strokeLinecap='round'
    />
  )
}

function ShortLine({ percent }: { percent: number }) {
  return (
    <Line
      percent={percent}
      className='w-4'
      strokeColor='#fb7185'
      strokeWidth={4}
      trailColor='#475569'
      trailWidth={4}
      strokeLinecap='round'
    />
  )
}

export default NewTimer
