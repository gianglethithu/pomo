import * as React from 'react'
import { useDataContext } from '../../contexts/dataContext/dataContext'
import { ReactComponent as Spinner } from '../../assets/spinner.svg'

interface PageWrapperProps {
  children: React.ReactNode
}

function PageWrapper({ children }: PageWrapperProps) {
  const { status, error } = useDataContext()
  if (status === 'loading')
    return (
      <div className='grid h-full w-full place-items-center pb-4'>
        <Spinner />
      </div>
    )
  if (status === 'reject')
    return (
      <div className='flex h-full w-full flex-col items-center justify-center gap-4 pb-4 text-lg'>
        <p>Oops! We have an error: {error?.message}</p>
        <p>Please try again later!!!</p>
      </div>
    )
  return <>{children}</>
}

export default PageWrapper
