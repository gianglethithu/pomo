import * as React from 'react'
import { DEFAULT } from '../../utils/constants/defaultValue'
import { useInterval } from '../../utils/hooks/useInterval'

interface TimerProps {}

function Timer({}: TimerProps) {
  const circleRef = React.useRef<SVGCircleElement>(null)
  const [dashOffSet, setDashOffset] = React.useState<number>(0)
  const [sectionLength, setSectionLength] = React.useState<number>(1)

  const dashArrayPerSecond = DEFAULT.DASH_ARRAY / (sectionLength * 60)

  useInterval(
    () => setDashOffset(s => s - dashArrayPerSecond),
    dashOffSet <= -DEFAULT.DASH_ARRAY + dashArrayPerSecond ? null : 1000,
  )

  React.useLayoutEffect(() => {
    if (circleRef.current) circleRef.current.style.strokeDashoffset = String(dashOffSet)
  })

  return (
    <svg
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      x='0px'
      y='0px'
      width='22.5em'
      height='22.5em'
      viewBox='0 0 200 200'
      enableBackground='new 0 0 200 200'
      xmlSpace='preserve'
      className=''
    >
      <defs>
        {/* <!-- SVG GLOW FILTER --> */}
        <filter id='glow' x='-120%' y='-120%' width='400%' height='400%'>
          <feOffset result='offOut' in='SourceGraphic' dx='0' dy='0'></feOffset>
          <feGaussianBlur result='blurOut' in='offOut' stdDeviation='10'></feGaussianBlur>
          <feBlend in='SourceGraphic' in2='blurOut' mode='overlay'></feBlend>
        </filter>
      </defs>
      <g>
        {/* <!-- Gray circle under the second countdown circle --> */}
        <circle
          fill='none'
          cx='6.25em'
          cy='6.25em'
          r='5em'
          className='circle stroke-slate-600'
          transform='scale(.8, .8) translate(25 25)'
        />
        {/* <!-- Second countdown circle --> */}
        <circle
          id='seconds_circle'
          fill='none'
          cx='6.25em'
          cy='6.25em'
          r='5em'
          ref={circleRef}
          className='svg-loader_grow circle'
          role='progressbar'
          transform='rotate(-89 100 100) scale(.8, .8) translate(25 25)'
          filter='url(#glow)'
        />
        {/* <!-- Second countdown text --> */}
        <text
          id='second_text'
          text-align='center'
          x='1.3em'
          y='2.4em'
          fontFamily='Poppins'
          fontSize='3em'
          fill='#fff'
        >
          :00
        </text>
        {/* <!-- Minute countdown text --> */}
        <text
          id='minute_text'
          text-align='center'
          x='5.5em'
          y='4em'
          fontFamily='Poppins'
          fontSize='1em'
          fill='#fff'
        >
          25
        </text>
        {/* <!-- Minute countdown circle --> */}
        {/* <circle
            id='minutes_circle'
            fill='none'
            cx='6.25em'
            cy='6.25em'
            r='5em'
            className='svg-loader_grow circle'
            role='progressbar'
            transform='rotate(-89 100 100) translate(0 200) scale(1, -1)'
            filter='url(#glow)'
          /> */}
      </g>
    </svg>
  )
}

export default Timer
