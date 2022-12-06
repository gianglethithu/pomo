import { Timestamp } from 'firebase/firestore'
import { colorOption } from '../utils/constants/colorOptions'
import type { Dispatch, SetStateAction } from 'react'

type ItemColor = keyof typeof colorOption
/** Mon, 2/21/2022 */
type DateString = string

type TComponentType = 'task' | 'tag'
type TSortOption = 'A to Z' | 'Z to A' | 'Oldest first' | 'Newest first' | 'Color'

interface TItem {
  id: string
  date: Timestamp
  name: string
  details: string
  color: ItemColor
}

interface TTask extends TItem {
  tagIds: string[]
}

interface TTag extends TItem {}

interface TWorkUnit {
  id: string
  taskId: string
  date: DateString
  start: Timestamp
  end: Timestamp
  duration?: number
  description?: string
  details?: string
}

type SetValue<T> = Dispatch<SetStateAction<T>>

enum FireStoreCollection {
  TASKS = 'tasks',
  TAGS = 'tags',
  WORKUNIT = 'work_unit',
}

export type {
  TTask,
  TTag,
  TSortOption,
  SetValue,
  TItem,
  TComponentType,
  TWorkUnit,
  ItemColor,
  DateString,
}
export { FireStoreCollection }
