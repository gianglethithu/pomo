import { Listbox } from '@headlessui/react'
import { addMinutes, endOfDay, format } from 'date-fns'
import { Timestamp } from 'firebase/firestore'
import * as React from 'react'
import { BsChevronExpand, BsPlusCircle, BsSave2 } from 'react-icons/bs'
import { FaHourglassEnd, FaHourglassStart, FaTrash } from 'react-icons/fa'
import { VscChromeClose } from 'react-icons/vsc'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { ButtonInput } from '../../components'
import { getItem, useDataContext } from '../../contexts/dataContext/dataContext'
import { TTask, TWorkUnit } from '../../types'
import { DEFAULT } from '../../utils/constants/defaultValue'
import DatePicker from './DatePicker'
import HourPicker from './HourPicker'

interface WorkUnitEditProps {
  editId: string | undefined
  closeEdit: () => void
  deleteWorkUnit: (wkuId: string) => void
  addWorkUnit: (newWorkUnit: TWorkUnit) => void
}

function getNow() {
  return new Date()
}

function WorkUnitEdit({ editId, closeEdit, deleteWorkUnit, addWorkUnit }: WorkUnitEditProps) {
  const { tasks: allTasks, workUnits } = useDataContext()

  const chosenWorkUnit = workUnits.find(w => w.id === editId)

  // should store taskId instead of task to avoid duplication in state
  // https://beta.reactjs.org/learn/choosing-the-state-structure#avoid-duplication-in-state
  const [taskId, setTaskId] = React.useState<TTask['id']>(chosenWorkUnit?.taskId ?? allTasks[0].id)
  const [date, setDate] = React.useState<Date>(
    chosenWorkUnit?.date ? new Date(chosenWorkUnit.date) : getNow,
  )
  const [hourStart, setHourStart] = React.useState<Date>(chosenWorkUnit?.start.toDate() ?? getNow)
  const [hourEnd, setHourEnd] = React.useState<Date>(chosenWorkUnit?.end.toDate() ?? getNow)

  const selectedTask = getItem(allTasks, taskId)
  const isFinishedWorkUnit = chosenWorkUnit && (chosenWorkUnit.duration ?? 0) > 0
  const isValidTime = hourEnd.getTime() - hourStart.getTime() >= 0

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events
    const target = e.target as typeof e.target & {
      description: { value: string }
      details: { value: string }
    }
    const newWorkUnit: TWorkUnit = {
      id: chosenWorkUnit?.id ?? uuidv4(),
      taskId,
      date: format(date, DEFAULT.DATE_FORMAT),
      start: Timestamp.fromDate(hourStart),
      end: Timestamp.fromDate(hourEnd),
      duration: (hourEnd.getTime() - hourStart.getTime()) / 1000,
      description: target.description.value,
      details: target.details.value,
    }
    addWorkUnit(newWorkUnit)
  }

  return (
    <form className='basis-full md:basis-1/3' onSubmit={handleSubmit}>
      <div className='flex justify-start gap-1 md:justify-end'>
        <button className='button mr-auto' type='button' onClick={closeEdit}>
          <VscChromeClose />
          Close
        </button>
        {isFinishedWorkUnit && (
          <button
            className='button'
            type='button'
            onClick={() => deleteWorkUnit(chosenWorkUnit.id)}
          >
            <FaTrash />
            Delete
          </button>
        )}
        <button
          className='button disabled:text-slate-600 disabled:hover:bg-transparent'
          type='submit'
          disabled={!isValidTime}
        >
          <BsSave2 />
          Save
        </button>
      </div>

      <div className='scrollbar h-[calc(100vh-theme(space.32))] max-w-sm space-y-4 overflow-y-auto'>
        <label className='block'>
          Description
          <input
            type='text'
            name='description'
            className='input block'
            defaultValue={chosenWorkUnit?.description}
          />
        </label>
        <label className='block'>
          Details
          <textarea
            rows={4}
            className='input block resize-none'
            defaultValue={chosenWorkUnit?.details}
            name='details'
          ></textarea>
        </label>
        <Listbox value={taskId} onChange={setTaskId} as='div' className='relative'>
          <Listbox.Label>Choose a task</Listbox.Label>
          <Listbox.Button className='flex w-full items-center justify-between rounded-md bg-slate-700 p-2'>
            <span className={`${selectedTask?.color} mr-2 h-4 w-4 rounded-full`}></span>
            {selectedTask?.name}
            <BsChevronExpand className='ml-auto' />
          </Listbox.Button>
          <Listbox.Options className='scrollbar absolute top-0 left-0 z-50 h-48 w-max -translate-y-[85%] overflow-y-auto rounded-md border-2 border-sky-500 bg-slate-800 p-2'>
            {allTasks.map(t => (
              <Listbox.Option value={t.id} key={t.id}>
                {({ selected }) => (
                  <button className={`${selected ? 'bg-sky-900' : ''} button w-full gap-2 px-1`}>
                    <span className={`${t.color} h-4 w-4 rounded-full`}></span>
                    {t.name}
                  </button>
                )}
              </Listbox.Option>
            ))}
            <li>
              <Link to={`/tasks/new`} className='button w-full gap-2 px-1'>
                <BsPlusCircle />
                <span>Create new task</span>
              </Link>
            </li>
          </Listbox.Options>
        </Listbox>

        {(isFinishedWorkUnit || !editId) && (
          <>
            <div className='relative'>
              Day
              <DatePicker date={date} setDate={setDate} />
            </div>

            <div className='relative'>
              Start of work
              <HourPicker
                timeCaption='Start At'
                selected={hourStart}
                onChange={date => setHourStart(date ?? new Date())}
                customInput={
                  <ButtonInput
                    icon={<FaHourglassStart className='text-sky-400' />}
                    text={format(new Date(hourStart), DEFAULT.HOUR_FORMAT)}
                  />
                }
              />
            </div>

            <div className='relative'>
              End of work
              {!isValidTime && <span className='text-red-400'>: Pick a later timestamp</span>}
              <HourPicker
                timeCaption='End At'
                selected={hourEnd}
                onChange={date => setHourEnd(date ?? new Date())}
                minTime={addMinutes(hourStart, 1)}
                maxTime={endOfDay(date)}
                customInput={
                  <ButtonInput
                    icon={<FaHourglassEnd className='text-sky-400' />}
                    text={format(new Date(hourEnd), 'hh : mm aa')}
                  />
                }
              />
            </div>
          </>
        )}
      </div>
    </form>
  )
}

export default WorkUnitEdit
