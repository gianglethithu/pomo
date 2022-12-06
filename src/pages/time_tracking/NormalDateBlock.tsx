import { Disclosure } from '@headlessui/react'
import { AiOutlineTag } from 'react-icons/ai'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { LabelTag } from '../../components'
import { useDataContext } from '../../contexts/dataContext/dataContext'
import { TWorkUnit } from '../../types'
import { secondToHour } from '../../utils/helpers/secondToHour'

interface NormalDateBlockProps {
  date: string
  workUnits: TWorkUnit[]
  toggleEdit: (id: string) => void
  editId: string | undefined
}

function NormalDateBlock({ date, workUnits, toggleEdit, editId }: NormalDateBlockProps) {
  const { tasks, tags } = useDataContext()
  const totalWorkDuration = secondToHour(workUnits.reduce((a, b) => a + (b.duration ?? 0), 0))
  return (
    <Disclosure as='li'>
      {({ open }) => (
        <>
          <Disclosure.Button className='flex w-full items-center gap-1 rounded-sm bg-slate-700 px-2 py-4 font-semibold hover:bg-slate-600'>
            {open ? <FaChevronUp /> : <FaChevronDown />}
            {date}
            <span className='ml-auto'>{totalWorkDuration}</span>
          </Disclosure.Button>
          <Disclosure.Panel>
            {workUnits.map(wku => {
              const task = tasks.find(t => t.id === wku.taskId)
              const activeTags = tags.filter(t => task?.tagIds.includes(t.id))
              const isEditing = wku.id === editId
              return (
                <div
                  key={wku.id}
                  className={`${
                    isEditing ? 'bg-sky-800 hover:bg-sky-700' : 'bg-slate-800 hover:bg-slate-700'
                  } relative mt-1 cursor-pointer py-2 px-3`}
                  onClick={() => toggleEdit(wku.id)}
                >
                  <div
                    className={`${task?.color} absolute left-0 top-0 h-full w-1 rounded-l rounded-r`}
                  />
                  {task?.name}
                  <div className='flex gap-1'>
                    {activeTags.map(
                      tag =>
                        tag && (
                          <LabelTag key={tag.id} as='div' additionStyles={`${tag.color} mt-1`}>
                            <AiOutlineTag />
                            {tag.name}
                          </LabelTag>
                        ),
                    )}
                  </div>
                  <div className='absolute right-2 top-0 flex h-full items-center gap-1'>
                    {secondToHour(wku.duration ?? 0)}
                  </div>
                </div>
              )
            })}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default NormalDateBlock
