import { BsChevronUp, BsChevronDown } from 'react-icons/bs'

interface ConfigTimerButtonProps {
  text: string
  increment: () => void
  decrement: () => void
}

function ConfigTimerButton({ text, increment, decrement }: ConfigTimerButtonProps) {
  return (
    <div className='input mt-1 flex w-44 py-1'>
      <span className='mr-auto'>{text}</span>
      <button className='rounded-sm px-2 hover:bg-slate-600' onClick={increment}>
        <BsChevronUp className='h-5 w-5' />
      </button>
      <button className='rounded-sm px-2 hover:bg-slate-600' onClick={decrement}>
        <BsChevronDown className='h-5 w-5' />
      </button>
    </div>
  )
}

export default ConfigTimerButton
