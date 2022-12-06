import { Listbox } from '@headlessui/react'
import * as React from 'react'
import { BsCheck2, BsChevronExpand } from 'react-icons/bs'
import { ItemColor, SetValue } from '../types'
import { colorOption } from '../utils/constants/colorOptions'

interface ColorPickerProps {
  color: ItemColor
  setColor: SetValue<ItemColor>
}

function ColorPicker({ color, setColor }: ColorPickerProps) {
  return (
    <Listbox value={color} onChange={setColor} as='div' className='relative'>
      <Listbox.Button className='flex w-full items-center justify-between rounded-md bg-slate-700 p-2'>
        <span className={`${color} mr-2 h-6 w-6 rounded-full`}></span>
        <span>Color</span>
        <BsChevronExpand className='ml-auto' />
      </Listbox.Button>
      <Listbox.Options className='absolute bottom-12 right-0 grid grid-cols-5 gap-2 rounded-md border-2 border-sky-500 bg-slate-800 p-2 lg:-right-3 lg:bottom-0 lg:translate-x-full '>
        {Object.keys(colorOption).map((c, index) => (
          <Listbox.Option key={index} value={c} as={React.Fragment}>
            {({ active, selected }) => (
              <li
                className={`${
                  active ? 'scale-110' : ''
                } ${c} grid h-8 w-8 place-items-center rounded-full`}
              >
                {selected && <BsCheck2 className='stroke-1 text-2xl text-slate-900' />}
              </li>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  )
}

export default ColorPicker
