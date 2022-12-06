import { format } from 'date-fns'
import * as React from 'react'
import ReactDatePicker from 'react-datepicker'
import { BsCalendar2CheckFill } from 'react-icons/bs'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { ButtonInput } from '../../components'
import { SetValue } from '../../types'
import { DEFAULT } from '../../utils/constants/defaultValue'

interface DatePickerProps {
  date: Date
  setDate: SetValue<Date>
}

function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <ReactDatePicker
      selected={date}
      onChange={date => setDate(date ?? new Date())}
      customInput={
        <ButtonInput
          icon={<BsCalendar2CheckFill className='text-sky-400' />}
          text={format(new Date(date), DEFAULT.DATE_FORMAT)}
        />
      }
      popperPlacement='top-start'
      // fixedHeight
      renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
        <div className='flex items-center justify-between px-2 py-2'>
          <span className='text-lg'>{format(date, 'MMMM yyyy')}</span>

          <div className='flex gap-2'>
            <button onClick={decreaseMonth} type='button' className='button'>
              <FaChevronLeft className='h-5 w-5' />
            </button>

            <button onClick={increaseMonth} type='button' className='button'>
              <FaChevronRight className='h-5 w-5' />
            </button>
          </div>
        </div>
      )}
    />
  )
}

export default DatePicker
