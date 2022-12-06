import * as React from 'react'
import { BsChevronExpand } from 'react-icons/bs'

interface ButtonInputProps {
  icon: JSX.Element
  text: string
  onClick?: () => void
  additionalStyles?: string
}

const ButtonInput = React.forwardRef<HTMLButtonElement, ButtonInputProps>(
  ({ onClick, icon, text, additionalStyles }, ref) => {
    // console.log(value)
    // console.log(onClick)
    return (
      <button
        onClick={onClick}
        ref={ref}
        type='button'
        className={`flex w-full items-center justify-between gap-2 rounded-md bg-slate-700 p-2 ${additionalStyles}`}
      >
        {icon}
        {/*@ts-ignore `value` is pass from react-datepicker but cannot find the type definition */}
        {text}
        <BsChevronExpand className='ml-auto' />
      </button>
    )
  },
)
export default ButtonInput
