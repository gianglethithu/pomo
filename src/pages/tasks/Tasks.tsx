import { Outlet } from 'react-router-dom'
import { PageLayout } from '../../components'

interface TasksProps {}

function Tasks({}: TasksProps) {
  return (
    <PageLayout title='Tasks'>
      <Outlet />
    </PageLayout>
  )
}

export default Tasks
