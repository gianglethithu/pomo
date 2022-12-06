import { Menu } from '@headlessui/react'
import { format } from 'date-fns'
import { deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore'
import * as React from 'react'
import { BsPlusCircle, BsPlusLg } from 'react-icons/bs'
import { FaPause, FaPlay, FaStop } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { PageLayout } from '../../components'
import { getItem, useDataContext } from '../../contexts/dataContext/dataContext'
import { useWorkDetailsContext } from '../../contexts/workDetailsContext/workDetailsContext'
import { db } from '../../firebaseConfig'
import { FireStoreCollection, TWorkUnit } from '../../types'
import { DEFAULT } from '../../utils/constants/defaultValue'
import FirstDateBlock from './FirstDateBlock'
import NormalDateBlock from './NormalDateBlock'
import WorkUnitEdit from './WorkUnitEdit'

function TimeTracking() {
  const { tasks, workUnits, dispatch, groupedWorkUnits } = useDataContext()
  const { durationTimer, workStatus, setWorkStatus } = useWorkDetailsContext()
  const [edit, dispatchEdit] = React.useReducer(
    (
      state: { isEditing: boolean; editId?: string },
      action: { type: 'NEW_EDIT' } | { type: 'TOGGLE'; editId: string } | { type: 'CLOSE' },
    ) => {
      switch (action.type) {
        case 'NEW_EDIT':
          return { isEditing: true }
        case 'TOGGLE': {
          if (!state.isEditing || !state.editId || action.editId !== state.editId)
            return { isEditing: true, editId: action.editId }
          return { isEditing: false }
        }
        case 'CLOSE':
          return { isEditing: false }
      }
    },
    { isEditing: false },
  )

  const { isEditing, editId } = edit

  const isWorking = workStatus === 'working'
  const isPause = workStatus === 'pause'
  const isIdle = workStatus === 'idle'

  // form of key: Tue, 02/22/2022
  const dateKeys = React.useMemo(
    () =>
      Object.keys(groupedWorkUnits).sort((d1, d2) => {
        const getNumeric = (key: string) =>
          key.split(', ')[1].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3/$1/$2')
        if (getNumeric(d1) < getNumeric(d2)) return 1
        else return -1
      }),
    [groupedWorkUnits],
  )

  function startWork(taskId: string) {
    const date = format(new Date(), DEFAULT.DATE_FORMAT)
    const newWorkUnit = {
      id: uuidv4(),
      date,
      taskId,
      start: Timestamp.now(),
      end: Timestamp.now(),
    }
    setWorkStatus('working')
    durationTimer.current = 0
    dispatch({ type: 'ADD_ITEM', newItem: newWorkUnit, itemType: 'workUnits' })
  }

  function handlePauseWork() {
    setWorkStatus('pause')
  }

  function handleContinueWork() {
    setWorkStatus('working')
  }

  function handleStopWork() {
    const newWorkUnit = { ...workUnits[0], end: Timestamp.now(), duration: durationTimer.current }
    setWorkStatus('idle')
    setDoc(doc(db, FireStoreCollection.WORKUNIT, newWorkUnit.id), newWorkUnit)
    dispatch({ type: 'UPDATE_ITEM', newItem: newWorkUnit, itemType: 'workUnits' })
    durationTimer.current = 0
  }

  // WorkUnitEdit block function
  function addWorkUnit(newWorkUnit: TWorkUnit) {
    const editWku = getItem(workUnits, newWorkUnit.id)
    editWku
      ? dispatch({ type: 'UPDATE_ITEM', newItem: newWorkUnit, itemType: 'workUnits' })
      : dispatch({ type: 'ADD_ITEM', newItem: newWorkUnit, itemType: 'workUnits' })
    closeEdit()
    setDoc(doc(db, FireStoreCollection.WORKUNIT, newWorkUnit.id), newWorkUnit)
  }

  function deleteWorkUnit(wkuId: string) {
    closeEdit()
    dispatch({ type: 'DELETE_ITEM', itemId: wkuId, itemType: 'workUnits' })
    deleteDoc(doc(db, FireStoreCollection.WORKUNIT, wkuId))
  }

  function toggleEdit(id: string) {
    dispatchEdit({ type: 'TOGGLE', editId: id })
  }

  function closeEdit() {
    dispatchEdit({ type: 'CLOSE' })
  }

  return (
    <PageLayout title='Time tracking'>
      <div className='flex gap-4'>
        <div className={`${isEditing ? 'hidden' : 'block'} grow md:block`}>
          <div className='flex gap-1'>
            <button className='button' onClick={() => dispatchEdit({ type: 'NEW_EDIT' })}>
              <BsPlusLg />
              Add work unit
            </button>

            {isIdle ? (
              <Menu as='div' className='relative'>
                <Menu.Button className='button'>
                  <FaPlay />
                  Start work
                </Menu.Button>
                <Menu.Items
                  as='ul'
                  className='absolute z-50 w-max translate-y-2 rounded-md border-2 border-sky-500 bg-slate-800 p-2'
                >
                  {tasks.map(({ color, name, id }) => (
                    <Menu.Item key={id} as='li'>
                      <button className='button w-full gap-2 px-1' onClick={() => startWork(id)}>
                        <span className={`${color} h-4 w-4 rounded-full`}></span>
                        {name}
                      </button>
                    </Menu.Item>
                  ))}
                  <Menu.Item as='li'>
                    <Link to={`/tasks/new`} className='button w-full gap-2 px-1'>
                      <BsPlusCircle />
                      <span>Create new task</span>
                    </Link>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            ) : (
              <>
                <button className='button' onClick={handleStopWork}>
                  <FaStop />
                  Stop work
                </button>
                {isPause ? (
                  <button className='button' onClick={handleContinueWork}>
                    <FaPlay />
                    Continue work
                  </button>
                ) : (
                  <button className='button' onClick={handlePauseWork}>
                    <FaPause />
                    Pause work
                  </button>
                )}
              </>
            )}
          </div>

          <ul className='scrollbar mt-2 h-[calc(100vh-theme(space.32))] space-y-1 overflow-y-auto'>
            {dateKeys.length > 0 && (
              <>
                {dateKeys[0] === format(new Date(), DEFAULT.DATE_FORMAT) ? (
                  <FirstDateBlock
                    date={dateKeys[0]}
                    workUnits={groupedWorkUnits[dateKeys[0]]}
                    isWorking={isWorking}
                    isIdle={isIdle}
                    timerRef={durationTimer}
                    toggleEdit={toggleEdit}
                    editId={editId}
                  />
                ) : (
                  <NormalDateBlock
                    toggleEdit={toggleEdit}
                    date={dateKeys[0]}
                    editId={editId}
                    workUnits={groupedWorkUnits[dateKeys[0]]}
                  />
                )}
                {dateKeys.slice(1).map(date => (
                  <NormalDateBlock
                    key={date}
                    editId={editId}
                    toggleEdit={toggleEdit}
                    date={date}
                    workUnits={groupedWorkUnits[date]}
                  />
                ))}
              </>
            )}
          </ul>
        </div>
        {isEditing && (
          <WorkUnitEdit
            key={editId}
            editId={editId}
            closeEdit={closeEdit}
            deleteWorkUnit={deleteWorkUnit}
            addWorkUnit={addWorkUnit}
          />
        )}
      </div>
    </PageLayout>
  )
}

export default TimeTracking
