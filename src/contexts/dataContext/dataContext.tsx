import { getDocs } from 'firebase/firestore'
import * as React from 'react'
import { tagsColRef, tasksColRef, workUnitsColRef } from '../../firebaseConfig'
import type { DateString, TTag, TTask, TWorkUnit } from '../../types'

interface TState {
  status: 'loading' | 'success' | 'reject'
  error?: Error
  tasks: TTask[]
  tags: TTag[]
  workUnits: TWorkUnit[]
}
type TAction =
  | { type: 'GETTING_DATA' }
  | { type: 'GET_DATA_SUCCESS'; tasks: TTask[]; tags: TTag[]; workUnits: TWorkUnit[] }
  | { type: 'GET_DATA_REJECT'; error: Error }
  | { type: 'DELETE_ITEM'; itemId: string; itemType: keyof Omit<TState, 'status' | 'error'> }
  | {
      type: 'ADD_ITEM'
      newItem: TTask | TTag | TWorkUnit
      itemType: keyof Omit<TState, 'status' | 'error'>
    }
  | {
      type: 'UPDATE_ITEM'
      newItem: TTask | TTag | TWorkUnit
      itemType: keyof Omit<TState, 'status' | 'error'>
    }
  | {
      type: 'UPDATE_COLLECTION'
      collectionType: keyof Omit<TState, 'status' | 'error'>
      newCollection: TState['tags'] | TState['tasks'] | TState['workUnits']
    }

interface DataContextType extends TState {
  groupedWorkUnits: Record<string, TWorkUnit[]>
  dispatch: React.Dispatch<TAction>
}

const DataContext = React.createContext<DataContextType | undefined>(undefined)
DataContext.displayName = 'DataContext'

function reducer(state: TState, action: TAction): TState {
  switch (action.type) {
    case 'GET_DATA_SUCCESS': {
      const { tags, tasks, workUnits } = action
      return { status: 'success', tags, tasks, workUnits }
    }
    case 'GET_DATA_REJECT': {
      return { ...state, status: 'reject', error: action.error }
    }
    case 'DELETE_ITEM': {
      const { itemId, itemType } = action
      //@ts-ignore https://github.com/microsoft/TypeScript/issues/44373
      const newCollection = state[itemType].filter(item => item.id !== itemId)
      return { ...state, [itemType]: newCollection }
    }
    case 'ADD_ITEM': {
      const { newItem, itemType } = action
      const newCollection = [newItem, ...state[itemType]]
      return { ...state, [itemType]: newCollection }
    }
    case 'UPDATE_ITEM': {
      const { newItem, itemType } = action
      const newCollection = state[itemType].map(item => (item.id === newItem.id ? newItem : item))
      return { ...state, [itemType]: newCollection }
    }
    case 'UPDATE_COLLECTION': {
      const { collectionType, newCollection } = action
      return { ...state, [collectionType]: newCollection }
    }

    default:
      throw new Error(`There is no action: ${action.type}`)
  }
}

const inititalState: TState = { status: 'loading', tasks: [], tags: [], workUnits: [] }

function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, inititalState)

  React.useEffect(() => {
    async function getData() {
      try {
        const snapshots = await Promise.all([
          getDocs(tasksColRef),
          getDocs(tagsColRef),
          getDocs(workUnitsColRef),
        ])

        const [tasks, tags, workUnits] = snapshots.map(s => {
          const temp: any[] = []
          s.forEach(doc => temp.push(doc.data()))
          return temp
        })

        // console.log(tags, tasks, workUnits)
        // dispatch({ type: 'GET_DATA_REJECT', error: new Error('There is no error') })

        dispatch({ type: 'GET_DATA_SUCCESS', tasks, tags, workUnits })
      } catch (error: any) {
        dispatch({ type: 'GET_DATA_REJECT', error })
      }
    }

    getData()
  }, [])

  const groupedWorkUnits = React.useMemo(
    () =>
      state.workUnits.reduce((final, current) => {
        const { date } = current
        if (date in final) final[date].push(current)
        else final[date] = [current]
        return final
      }, {} as Record<DateString, TWorkUnit[]>),
    [state.workUnits],
  )

  return (
    <DataContext.Provider value={{ ...state, groupedWorkUnits, dispatch }}>
      {children}
    </DataContext.Provider>
  )
}

function useDataContext() {
  const context = React.useContext(DataContext)
  if (context === undefined) throw new Error('useDataContext must be used within a DataProvider')
  return context
}

function getItem<T extends { id: string }>(collection: T[], itemId: string) {
  return collection.find(item => item.id === itemId)
}

export { DataProvider, useDataContext, getItem }
