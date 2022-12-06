import { deleteDoc, doc, setDoc, Timestamp } from 'firebase/firestore'
import * as React from 'react'
import { BsArrowLeftCircle, BsSave2 } from 'react-icons/bs'
import { FaTrash } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { ColorPicker, ItemPicker } from '../../components'
import { getItem, useDataContext } from '../../contexts/dataContext/dataContext'
import { db } from '../../firebaseConfig'
import { FireStoreCollection, ItemColor } from '../../types'
import { DEFAULT } from '../../utils/constants/defaultValue'

interface TasksNewProps {
  edit?: true
}

function TasksNew({ edit }: TasksNewProps) {
  const { taskId } = useParams()
  const { dispatch, tags, tasks, workUnits } = useDataContext()
  const {
    color: currentColor = DEFAULT.TASK_COLOR,
    name: currentName = DEFAULT.TASK_NAME,
    details: currentDetail = '',
    tagIds: currentTags = [],
  } = taskId ? getItem(tasks, taskId) ?? {} : {}
  const [color, setColor] = React.useState<ItemColor>(currentColor)
  const [taskName, setTaskName] = React.useState<string>(currentName)
  const [taskDetail, setTaskDetail] = React.useState<string>(currentDetail)
  const [tagIds, setTagIds] = React.useState<string[]>(currentTags)
  const navigate = useNavigate()

  function handleSave() {
    const newTask = {
      id: taskId ? taskId : uuidv4(),
      date: Timestamp.now(),
      color,
      name: taskName === '' ? '⚠️⚠️⚠️ Empty task name ⚠️⚠️⚠️' : taskName,
      details: taskDetail,
      tagIds,
    }

    setDoc(doc(db, FireStoreCollection.TASKS, newTask.id), newTask)
    edit
      ? dispatch({ type: 'UPDATE_ITEM', newItem: newTask, itemType: 'tasks' })
      : dispatch({ type: 'ADD_ITEM', newItem: newTask, itemType: 'tasks' })
    navigate('..')
  }

  function handleDelete() {
    if (taskId) {
      deleteDoc(doc(db, FireStoreCollection.TASKS, taskId))
      dispatch({ type: 'DELETE_ITEM', itemId: taskId, itemType: 'tasks' })

      // ?? needed ?? delete all related Work Unit to this task
      dispatch({
        type: 'UPDATE_COLLECTION',
        collectionType: 'workUnits',
        newCollection: workUnits.filter(w => w.taskId !== taskId),
      })
      workUnits.forEach(
        w => w.taskId === taskId && deleteDoc(doc(db, FireStoreCollection.WORKUNIT, w.id)),
      )
    }
    navigate('..')
  }

  // useCallback here because it is in the dependency list in Listbox component
  const handleAddTag = React.useCallback(function handleAddTag(tagId: string) {
    setTagIds(oldTagIds => [...oldTagIds, tagId])
  }, [])
  function handleDeleteTag(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    setTagIds(tagIds.filter(tagId => tagId !== id))
  }

  if (taskId && !getItem(tasks, taskId)) return <h2>There is no task with ID: {taskId}</h2>

  return (
    <form className='max-w-md space-y-4'>
      <label className='block'>
        <span className='block'>Task name</span>
        <input
          type='text'
          className='input'
          value={taskName}
          onChange={e => setTaskName(e.currentTarget.value)}
          onFocus={e => e.currentTarget.value === DEFAULT.TASK_NAME && e.currentTarget.select()}
          autoFocus
        />
      </label>
      <label className='block'>
        <span className='block'>Details</span>
        <textarea
          rows={7}
          className='input resize-none'
          value={taskDetail}
          onChange={e => setTaskDetail(e.target.value)}
          placeholder='What exactly do you want to do?'
        ></textarea>
      </label>

      <ColorPicker color={color} setColor={setColor} />

      <ItemPicker
        type='tag'
        allItemList={tags}
        pickedItemList={tags.filter(t => tagIds.includes(t.id))}
        onChange={handleAddTag}
        onDelete={handleDeleteTag}
      />

      <div className='flex gap-2'>
        <button onClick={() => navigate('..')} className='button border-2 border-slate-700'>
          <BsArrowLeftCircle />
          Back
        </button>

        <button className='button border-2 border-slate-700' onClick={handleSave}>
          <BsSave2 />
          Save
        </button>

        {edit && (
          <button onClick={handleDelete} className='button ml-auto border-2 border-slate-700'>
            <FaTrash />
            Delete
          </button>
        )}
      </div>
    </form>
  )
}

export default TasksNew
