import { Switch } from '@headlessui/react'
import { SetValue } from '../../types'

interface ConfigTimerSwitchProps {
  checked: boolean
  onChange: SetValue<boolean>
  label: string
}

function ConfigTimerSwitch({ checked, onChange, label }: ConfigTimerSwitchProps) {
  return (
    <Switch.Group as='div' className='flex flex-col gap-1'>
      <Switch.Label passive>{label}</Switch.Label>
      <Switch
        checked={checked}
        onChange={onChange}
        className={`${
          checked ? 'bg-sky-500' : 'bg-slate-600'
        } relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-500 focus:outline-none`}
      >
        <span
          className={`${
            checked ? 'translate-x-7 bg-slate-800' : 'translate-x-1 bg-slate-50'
          } inline-block h-4 w-4 rounded-full transition duration-500`}
        />
      </Switch>
    </Switch.Group>
  )
}

export default ConfigTimerSwitch
