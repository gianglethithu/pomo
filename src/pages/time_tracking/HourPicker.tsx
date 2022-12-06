import * as React from 'react'
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker'

interface HourPickerProps extends ReactDatePickerProps {}

function HourPicker(props: HourPickerProps) {
  return (
    <ReactDatePicker
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      popperPlacement='top-start'
      {...props}
    />
  )
}

export default HourPicker
