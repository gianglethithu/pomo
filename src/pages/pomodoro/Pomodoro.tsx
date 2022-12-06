import { Popover } from '@headlessui/react'
import * as React from 'react'
import { BsQuestionLg } from 'react-icons/bs'
import { VscSettings } from 'react-icons/vsc'
import { PageLayout } from '../../components'
import { usePomodoroContext } from '../../contexts/pomodoroContext/pomodoroContext'
import { LSKey } from '../../utils/constants/localStorageKey'
import useCounter from '../../utils/hooks/useCounter'
import { useLocalStorage } from '../../utils/hooks/useLocalStorage'
import ConfigTimerButton from './ConfigTimerButton'
import ConfigTimerSwitch from './ConfigTimerSwitch'
import NewTimer from './NewTimer'

interface PomodoroProps {}

function Pomodoro({}: PomodoroProps) {
  const { pomodoroStatus, nextStatus, pomodoroTimerRef } = usePomodoroContext()
  const [pomodoroDuration, incPomodoroDuration, decPomodoroDuration] = useCounter({
    lsKey: LSKey.POMODORO_DURATION,
    initialValue: 25,
    maxValue: 50,
    minValue: 5,
    step: 5,
  })
  const [breakDuration, incBreakDuration, decBreakDuration] = useCounter({
    lsKey: LSKey.BREAK_DURATION,
    initialValue: 5,
    maxValue: 15,
    minValue: 1,
  })
  const [pomodoroCount, incPomodoroCount, decpomodoroCount] = useCounter({
    lsKey: LSKey.POMODORO_COUNT,
    initialValue: 4,
    maxValue: 8,
    minValue: 2,
  })
  const [auto, setAuto] = useLocalStorage(LSKey.POMODORO_AUTO, false)
  const [sound, setSound] = useLocalStorage(LSKey.POMODORO_SOUND, false)
  const [sync, setSync] = useLocalStorage(LSKey.POMODORO_SYNC, false)

  // reset timerRef when change duration setting/ finish a section
  // modify ref when rendering is not a good idea
  // https://beta.reactjs.org/learn/referencing-values-with-refs#best-practices-for-refs
  if (pomodoroStatus === 'idle') {
    pomodoroTimerRef.current = (nextStatus === 'working' ? pomodoroDuration : breakDuration) * 60
  }

  return (
    <PageLayout title='Pomodoro'>
      <div className='flex h-[calc(100vh-theme(space.24))] flex-col gap-4'>
        <NewTimer
          key={`${pomodoroDuration}-${breakDuration}-${pomodoroStatus}`}
          pomodoroCount={pomodoroCount}
          initialPomodoroDuration={pomodoroDuration * 60}
          initialBreakDuration={breakDuration * 60}
        />

        <div className='flex justify-between'>
          <a
            href='https://en.wikipedia.org/wiki/Pomodoro_Technique'
            target='_blank'
            rel='noreferrer'
            className='button border border-slate-600'
          >
            <BsQuestionLg className='h-5 w-5' />
          </a>
          <Popover className='relative'>
            <Popover.Button
              className='button border border-slate-600 disabled:border-slate-900 disabled:text-slate-600 disabled:hover:bg-slate-900'
              disabled={pomodoroStatus !== 'idle'}
            >
              <VscSettings className='h-5 w-5' />
            </Popover.Button>
            <Popover.Panel
              // static
              className='absolute right-0 bottom-0 -translate-y-11 space-y-4 rounded-md bg-slate-800 p-4 text-sm'
            >
              <div>
                Pomodoro duration
                <ConfigTimerButton
                  text={`${pomodoroDuration} min`}
                  increment={incPomodoroDuration}
                  decrement={decPomodoroDuration}
                />
              </div>
              <div>
                Break duration
                <ConfigTimerButton
                  text={`${breakDuration} min`}
                  increment={incBreakDuration}
                  decrement={decBreakDuration}
                />
              </div>
              <div>
                Pomodoro count{' '}
                <ConfigTimerButton
                  text={String(pomodoroCount)}
                  increment={incPomodoroCount}
                  decrement={decpomodoroCount}
                />
              </div>
              <ConfigTimerSwitch
                label='Auto start pomodoros & breaks'
                checked={auto}
                onChange={setAuto}
              />
              <ConfigTimerSwitch label='Notification sound' checked={sound} onChange={setSound} />
              <ConfigTimerSwitch
                label='Sync with time tracking (not available)'
                checked={sync}
                onChange={setSync}
              />
            </Popover.Panel>
          </Popover>
        </div>
      </div>
    </PageLayout>
  )
}

export default Pomodoro
