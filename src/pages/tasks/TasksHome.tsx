import * as React from 'react'
import { AiOutlineTag } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { ActionBar, LabelTag } from '../../components'
import { useDataContext } from '../../contexts/dataContext/dataContext'
import { TSortOption } from '../../types'
import { sortList } from '../../utils/helpers/sortList'
import { useLocalStorage } from '../../utils/hooks/useLocalStorage'

function TasksHome() {
  const { tasks, tags } = useDataContext()
  const [sortType, setSortType] = useLocalStorage<TSortOption>('task_sort_type', 'Newest first')
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const sortTasks = sortList(tasks, sortType)
  const searchedTasks =
    searchQuery.trim() === ''
      ? sortTasks
      : sortTasks.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div>
      <ActionBar
        type='task'
        sortType={sortType}
        setSortType={setSortType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <ul className='scrollbar mt-4 h-[calc(100vh-theme(space.36))] overflow-y-auto'>
        {searchedTasks.map(t => (
          <li key={t.id}>
            <Link to={`edit/${t.id}`} className='button w-full gap-2'>
              <span className={`${t.color} h-4 w-4 rounded-full`}></span>
              {t.name}
              <div className='ml-auto flex gap-1'>
                {tags
                  .filter(tag => t.tagIds.includes(tag.id))
                  .map(tag => (
                    <LabelTag key={tag.id} as='div' additionStyles={`${tag.color}`}>
                      <AiOutlineTag />
                      {tag.name}
                    </LabelTag>
                  ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TasksHome
