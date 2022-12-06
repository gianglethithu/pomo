import * as React from 'react'
import About from './about/About'
import Settings from './settings/Settings'
import Tags from './tags/Tags'
import TagsHome from './tags/TagsHome'
import TagsNew from './tags/TagsNew'
import Tasks from './tasks/Tasks'
import TasksHome from './tasks/TasksHome'
import TasksNew from './tasks/TasksNew'
import TimeTracking from './time_tracking/TimeTracking'

const Analytics = React.lazy(() => import('./analytics/Analytics'))
const Pomodoro = React.lazy(() => import('./pomodoro/Pomodoro'))

export {
  About,
  Settings,
  Tags,
  Tasks,
  TimeTracking,
  TasksHome,
  TasksNew,
  TagsHome,
  TagsNew,
  Analytics,
  Pomodoro,
}
