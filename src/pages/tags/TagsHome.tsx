import * as React from 'react'
import { FaPen } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { ActionBar, LabelTag } from '../../components'
import { useDataContext } from '../../contexts/dataContext/dataContext'
import { TSortOption } from '../../types'
import { sortList } from '../../utils/helpers/sortList'
import { useLocalStorage } from '../../utils/hooks/useLocalStorage'

function TagsHome() {
  const { tags, tasks } = useDataContext()
  const [sortType, setSortType] = useLocalStorage<TSortOption>('tag_sort_type', 'Newest first')
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const sortTags = sortList(tags, sortType)
  const searchedTags =
    searchQuery.trim() === ''
      ? sortTags
      : sortTags.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <>
      <ActionBar
        type='tag'
        sortType={sortType}
        setSortType={setSortType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ul className='scrollbar mt-4 h-[calc(100vh-theme(space.36))] overflow-y-auto'>
        {searchedTags.map(t => (
          <li key={t.id}>
            <Link to={`edit/${t.id}`} className='button w-full gap-2'>
              <span className={`${t.color} h-4 w-4 rounded-full`}></span>
              {t.name}
              <div className='ml-auto flex gap-1'>
                {tasks
                  .filter(task => task.tagIds.includes(t.id))
                  .map(task => (
                    <LabelTag as='div' key={task.id} additionStyles={`${task.color}`}>
                      <FaPen />
                      {task.name}
                    </LabelTag>
                  ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default TagsHome
