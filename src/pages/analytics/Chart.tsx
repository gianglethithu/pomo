import { ChartData, ChartDataset } from 'chart.js'
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns'
import React from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { getItem, useDataContext } from '../../contexts/dataContext/dataContext'
import { DateString, TTag, TWorkUnit } from '../../types'
import { barOptions, lineOptions } from '../../utils/constants/chartOption'
import { colorOption } from '../../utils/constants/colorOptions'
import { DEFAULT } from '../../utils/constants/defaultValue'
import { secondToHour } from '../../utils/helpers/secondToHour'

interface ChartProps {
  month: Date
  chartType: 'lines' | 'bars'
  chartDataType: 'tags' | 'tasks'
}

function Chart({ month, chartDataType, chartType }: ChartProps) {
  const { tasks, tags, groupedWorkUnits } = useDataContext()

  const dayInterval = React.useMemo(
    () => eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }),
    [month],
  )

  /**From `Record<DateString, Array<TWorkUnit>>` to `Record<DateString, Record<taskId, duration>>` */
  const groupedWkuTaskTime = React.useMemo(
    () =>
      Object.keys(groupedWorkUnits).reduce((acc, key) => {
        acc[key] = groupedWorkUnits[key].reduce((objWithTaskTime, wku) => {
          objWithTaskTime[wku.taskId] = (objWithTaskTime[wku.taskId] ?? 0) + (wku.duration ?? 0)
          return objWithTaskTime
        }, {} as Record<TWorkUnit['taskId'], number>)

        return acc
      }, {} as Record<DateString, Record<TWorkUnit['taskId'], number>>),
    [groupedWorkUnits],
  )

  const taskDatasets = React.useMemo(
    () =>
      tasks.reduce((acc, t) => {
        const data = dayInterval.map(
          day => groupedWkuTaskTime[format(day, DEFAULT.DATE_FORMAT)]?.[t.id] ?? 0,
        )
        const totalTime = data.reduce((a, b) => a + b)

        if (totalTime === 0) return acc

        const dataset = {
          label: `${t.name}: ${secondToHour(totalTime)}`,
          data,
          backgroundColor: colorOption[t.color],
          borderColor: colorOption[t.color],
        }
        acc.push(dataset)
        return acc
      }, [] as ChartDataset<'bar' | 'line', number[]>[]),
    [dayInterval, groupedWkuTaskTime, tasks],
  )

  /**From `Record<DateString, Array<TWorkUnit>>` to `Record<DateString, Record<tagId, duration>>` */
  const groupedWkuTagTime = React.useMemo(
    () =>
      Object.keys(groupedWorkUnits).reduce((acc, key) => {
        acc[key] = groupedWorkUnits[key]
          .map(wku => {
            const tagIds = getItem(tasks, wku.taskId)?.tagIds
            let temp: Record<TTag['id'], number> = {}
            tagIds && tagIds.forEach(t => (temp[t] = (wku?.duration ?? 0) / tagIds.length))
            return temp
          })
          .reduce((objWithTagTime, item) => {
            for (const tagId in item) {
              objWithTagTime[tagId] = (objWithTagTime[tagId] ?? 0) + item[tagId]
            }
            return objWithTagTime
          }, {} as Record<TTag['id'], number>)
        return acc
      }, {} as Record<DateString, Record<TTag['id'], number>>),
    [groupedWorkUnits, tasks],
  )

  const tagDatasets = React.useMemo(
    () =>
      tags.reduce((acc, t) => {
        const data = dayInterval.map(
          day => groupedWkuTagTime[format(day, DEFAULT.DATE_FORMAT)]?.[t.id] ?? 0,
        )
        const totalTime = data.reduce((a, b) => a + b)

        if (totalTime === 0) return acc

        const dataset = {
          label: `${t.name}: ${secondToHour(totalTime)}`,
          data,
          backgroundColor: colorOption[t.color],
          borderColor: colorOption[t.color],
        }
        acc.push(dataset)
        return acc
      }, [] as ChartDataset<'bar' | 'line', number[]>[]),
    [dayInterval, groupedWkuTagTime, tags],
  )

  const labels = dayInterval.map(d => format(d, 'MMM d'))

  const data: ChartData<'bar' | 'line', number[], string> = {
    labels,
    datasets: chartDataType === 'tasks' ? taskDatasets : tagDatasets,
  }

  if (chartType === 'bars')
    return <Bar options={barOptions} data={data as ChartData<'bar', number[], string>} />

  return <Line options={lineOptions} data={data as ChartData<'line', number[], string>} />
}

export default Chart
