import { format } from 'date-fns'
import * as React from 'react'
import ReactDatePicker from 'react-datepicker'
import { AiOutlineTags } from 'react-icons/ai'
import { BsFillBarChartFill } from 'react-icons/bs'
import { FaChartLine, FaChevronLeft, FaChevronRight, FaTasks } from 'react-icons/fa'
import { ButtonInput, PageLayout } from '../../components'
import Chart from './Chart'

function Analytics() {
  const [month, setMonth] = React.useState<Date>(new Date())
  const [chartType, setChartType] = React.useState<'lines' | 'bars'>('bars')
  const [chartDataType, setChartDataType] = React.useState<'tags' | 'tasks'>('tasks')

  return (
    <PageLayout title='Analytics'>
      <div className='mx-auto -mt-5 mb-5 flex max-w-xl justify-center gap-4'>
        <div>
          <button
            className={`button w-20 justify-center rounded-r-none border p-1 ${
              chartType === 'lines' ? 'border-sky-600 bg-slate-800' : 'border-slate-700'
            }`}
            onClick={() => setChartType('lines')}
          >
            <FaChartLine />
            Lines
          </button>
          <button
            className={`button w-20 justify-center rounded-l-none border p-1 ${
              chartType === 'bars' ? 'border-sky-600 bg-slate-800' : 'border-slate-700'
            }`}
            onClick={() => setChartType('bars')}
          >
            <BsFillBarChartFill />
            Bars
          </button>
        </div>

        <div>
          <button
            className={`button w-20 justify-center rounded-r-none border p-1 ${
              chartDataType === 'tasks' ? 'border-sky-600 bg-slate-800' : 'border-slate-700'
            }`}
            onClick={() => setChartDataType('tasks')}
          >
            <FaTasks />
            Tasks
          </button>
          <button
            className={`button w-20 justify-center rounded-l-none border p-1 ${
              chartDataType === 'tags' ? 'border-sky-600 bg-slate-800' : 'border-slate-700'
            }`}
            onClick={() => setChartDataType('tags')}
          >
            <AiOutlineTags />
            Tags
          </button>
        </div>

        <div className='relative'>
          <ReactDatePicker
            selected={month}
            onChange={date => setMonth(date ?? new Date())}
            showMonthYearPicker
            customInput={
              <ButtonInput icon={<></>} text={format(month, 'MMM yyyy')} additionalStyles='py-1' />
            }
            renderCustomHeader={({ date, decreaseYear, increaseYear }) => (
              <div className='flex items-center justify-between gap-2'>
                <button onClick={decreaseYear} type='button' className='button'>
                  <FaChevronLeft className='h-5 w-5' />
                </button>
                <span className='text-lg'>{format(date, 'yyyy')}</span>
                <button onClick={increaseYear} type='button' className='button'>
                  <FaChevronRight className='h-5 w-5' />
                </button>
              </div>
            )}
          />
        </div>
      </div>

      <div className='relative mx-auto h-[80vh] w-[85vw] lg:w-[75vw]'>
        <Chart month={month} chartDataType={chartDataType} chartType={chartType} />
      </div>
    </PageLayout>
  )
}

export default Analytics
