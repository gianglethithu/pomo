import { Menu } from '@headlessui/react'
import * as React from 'react'
import { BsArrowDownUp, BsCheck2, BsPlusCircle } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { SetValue, TComponentType, TSortOption } from '../types'
import { sortOptions } from '../utils/constants/sortOptions'

interface ActionBarProps {
  type: TComponentType
  sortType: TSortOption
  searchQuery: string
  setSortType: SetValue<TSortOption>
  setSearchQuery: SetValue<string>
}

function ActionBar({ type, sortType, setSortType, searchQuery, setSearchQuery }: ActionBarProps) {
  return (
    <div className='flex gap-2'>
      <Menu as='div' className='relative'>
        <Menu.Button className='button'>
          <BsArrowDownUp />
          <span>Sort</span>
        </Menu.Button>
        <Menu.Items
          as='ul'
          className='absolute z-50 w-max translate-y-2 rounded-md border-2 border-sky-500 bg-slate-800 p-2'
        >
          {sortOptions.map(({ id, type }) => (
            <Menu.Item key={id} as='li'>
              {({ active }) => (
                <button
                  className={`${active ? 'bg-slate-700' : ''} w-full py-1 px-2 text-left`}
                  onClick={() => setSortType(type as TSortOption)}
                >
                  <BsCheck2
                    className={`${sortType === type ? '' : 'text-transparent'} mr-2 inline-block`}
                  />
                  <span>{type}</span>
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Menu>
      <input
        type='search'
        value={searchQuery}
        onChange={e => setSearchQuery(e.currentTarget.value)}
        className='input w-auto grow'
        placeholder='Seach...'
      />

      <Link to='new' className='button'>
        <BsPlusCircle />
        <span>Create new {type}</span>
      </Link>
    </div>
  )
}

export default ActionBar
