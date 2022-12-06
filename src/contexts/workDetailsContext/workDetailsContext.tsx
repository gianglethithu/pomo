import * as React from 'react'
import type { SetValue } from '../../types'
import { useInterval } from '../../utils/hooks/useInterval'

type TWorkStatus = 'idle' | 'working' | 'pause'

interface WorkDetailsContextType {
  durationTimer: React.MutableRefObject<number>
  workStatus: TWorkStatus
  setWorkStatus: SetValue<TWorkStatus>
}

const WorkDetailsContext = React.createContext<WorkDetailsContextType | undefined>(undefined)
WorkDetailsContext.displayName = 'WorkDetailsContext'

function WorkDetailsProvider({ children }: { children: React.ReactNode }) {
  const durationTimer = React.useRef(0)
  const [workStatus, setWorkStatus] = React.useState<TWorkStatus>('idle')

  useInterval(() => durationTimer.current++, workStatus === 'working' ? 1000 : null)

  const contextValue = React.useMemo(
    () => ({ workStatus, setWorkStatus, durationTimer }),
    [workStatus],
  )

  return <WorkDetailsContext.Provider value={contextValue}>{children}</WorkDetailsContext.Provider>
}

function useWorkDetailsContext() {
  const context = React.useContext(WorkDetailsContext)
  if (context === undefined)
    throw new Error('useWorkDetailsContext must be used within a WorkDetailsProvider')
  return context
}

export { WorkDetailsProvider, useWorkDetailsContext }
