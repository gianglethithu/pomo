import { useState } from 'react'
import { VscThreeBars } from 'react-icons/vsc'
import { NavLink } from 'react-router-dom'
import { navLinks } from '../../utils/constants/navLinks'

interface SideBarProps {}

function SideBar({}: SideBarProps) {
  const [open, setOpen] = useState<boolean>(true)
  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className='pointer-events-none lg:pointer-events-auto'
      >
        <VscThreeBars className='ml-2 h-6 w-6 text-slate-600 active:scale-75 lg:text-inherit' />
      </button>
      <nav className='mt-2 space-y-2'>
        {navLinks.map(({ id, Icon, title, to }) => (
          <NavLink
            key={id}
            to={to}
            className={({ isActive }) =>
              `flex gap-4 border-l-4 p-2 pl-1 hover:bg-slate-700 ${
                isActive ? 'border-rose-500 bg-slate-700' : 'border-transparent'
              }`
            }
          >
            <Icon className='h-6 w-6' />
            {open && <span className='hidden w-52 grow select-none lg:block'>{title}</span>}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default SideBar
