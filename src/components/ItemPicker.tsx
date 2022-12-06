import { Listbox } from '@headlessui/react'
import { BsBackspace, BsChevronExpand, BsPlusCircle } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { LabelTag } from '.'
import { TComponentType, TItem } from '../types'

function ItemPicker<T extends TItem>({
  type,
  onChange,
  onDelete,
  pickedItemList,
  allItemList,
}: {
  type: TComponentType
  onChange: (item: string) => void
  onDelete: (e: React.MouseEvent, id: string) => void
  pickedItemList: T[]
  allItemList: T[]
}) {
  return (
    <Listbox value={''} onChange={onChange} as='div' className='relative'>
      <Listbox.Button className='flex w-full items-center justify-between rounded-md bg-slate-700 p-2'>
        <ul className='flex flex-wrap gap-1'>
          {pickedItemList.length === 0 ? (
            <li>Pick a {type}</li>
          ) : (
            pickedItemList.map(t => (
              <LabelTag as='li' key={t.id} additionStyles={`${t.color}`}>
                {t.name}
                <span onClick={e => onDelete(e, t.id)}>
                  <BsBackspace />
                </span>
              </LabelTag>
            ))
          )}
        </ul>
        <BsChevronExpand className='ml-auto' />
      </Listbox.Button>
      <Listbox.Options className='absolute bottom-12 right-0 grid grid-cols-1 rounded-md border-2 border-sky-500 bg-slate-800 lg:-right-3 lg:bottom-0 lg:translate-x-full '>
        {allItemList.map(t =>
          pickedItemList.includes(t) ? undefined : (
            <Listbox.Option key={t.id} value={t.id} className='button gap-1'>
              <span className={`${t.color} h-4 w-4 rounded-full`}></span>
              {t.name}
            </Listbox.Option>
          ),
        )}
        <Listbox.Option value={undefined}>
          <Link to={`/${type}s/new`} className='button gap-1'>
            <BsPlusCircle />
            <span>Create new {type}</span>
          </Link>
        </Listbox.Option>
      </Listbox.Options>
    </Listbox>
  )
}

export default ItemPicker
