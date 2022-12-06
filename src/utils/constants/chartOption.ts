import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from 'chart.js'
import { secondToHour } from '../helpers/secondToHour'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend)

const barOptions: ChartOptions<'bar'> = {
  maintainAspectRatio: false,
  responsive: true,
  resizeDelay: 500,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: '#f8fafc',
        boxHeight: 16,
        boxWidth: 16,
        font: { family: 'Poppins' },
        usePointStyle: true,
      },
    },
    tooltip: {
      position: 'nearest',
      xAlign: 'center',
      yAlign: 'bottom',
      borderColor: '#0ea5e9',
      borderWidth: 2,
      backgroundColor: '#0f172a',
      usePointStyle: true,
      boxPadding: 2,
      callbacks: {
        label: items => {
          // console.log(items)
          // items.dataset.label looks like 'Tag 1: total time' --> get 'Tag 1'
          return `${items.dataset.label?.split(':')[0]}: ${secondToHour(items.raw as number)}`
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: '#f8fafc', // slate-50
        font: {
          family: 'Poppins',
          size: 9,
        },
      },
      grid: {
        color: '#475569', // slate-600
      },
    },
    y: {
      stacked: true,
      ticks: {
        callback: (value, index, ticks) => {
          return index === 0 ? '' : secondToHour(value as number).slice(0, -3)
        },
        color: '#f8fafc', // slate-50
        // stepSize: 3600,
        font: {
          family: 'Poppins',
          size: 10,
        },
      },
      grid: {
        color: '#475569', // slate-600
      },
    },
  },
}

const lineOptions: ChartOptions<'line'> = {
  maintainAspectRatio: false,
  responsive: true,
  resizeDelay: 500,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: '#f8fafc',
        boxHeight: 16,
        boxWidth: 16,
        font: { family: 'Poppins' },
        usePointStyle: true,
      },
    },
    tooltip: {
      position: 'nearest',
      xAlign: 'center',
      yAlign: 'bottom',
      borderColor: '#0ea5e9',
      borderWidth: 2,
      backgroundColor: '#0f172a',
      usePointStyle: true,
      boxPadding: 2,
      callbacks: {
        label: items => {
          // console.log(items)
          // items.dataset.label looks like 'Tag 1: total time' --> get 'Tag 1'
          return `${items.dataset.label?.split(':')[0]}: ${secondToHour(items.raw as number)}`
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#f8fafc', // slate-50
        font: {
          family: 'Poppins',
          size: 9,
        },
      },
      grid: {
        color: '#475569', // slate-600
      },
    },
    y: {
      ticks: {
        callback: (value, index, ticks) => {
          return index === 0 ? '' : secondToHour(value as number).slice(0, -3)
        },
        color: '#f8fafc', // slate-50
        // stepSize: 3600,
        font: {
          family: 'Poppins',
          size: 10,
        },
      },
      grid: {
        color: '#475569', // slate-600
      },
    },
  },
}

export { barOptions, lineOptions }
