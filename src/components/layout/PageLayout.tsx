import { ReactNode } from 'react'

interface PageLayoutProps {
  title: string
  children: ReactNode
}

function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <>
      <h2 className='h-16 text-3xl font-bold'>{title}</h2>
      {children}
    </>
  )
}

export default PageLayout
