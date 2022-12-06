import { Outlet } from 'react-router-dom'
import { PageLayout } from '../../components'

interface TagsProps {}

function Tags({}: TagsProps) {
  return (
    <PageLayout title='Tags'>
      <Outlet />
    </PageLayout>
  )
}

export default Tags
