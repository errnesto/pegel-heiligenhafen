import React from 'react'
import { scaleLinear } from 'd3'
import { interpolateViridis } from 'd3-scale-chromatic'

type Gauge = number
interface Props {
  data: Gauge[]
}
const Colors = (props: Props) => {
  const { data } = props

  const normalGauge = 504
  const offset = 100
  // set to values between 0 and 1 where 0.5 is the normalGauge
  // for the eastern see
  // console.log(gauges)
  const scale = scaleLinear()
    .domain([normalGauge - offset, normalGauge + offset])
    .range([1,0])

  const values = data.map(value => scale(value))

  const stripeWidth = 20
  return <svg viewBox={`0 0 ${stripeWidth * data.length} 50`} width='100%' height='100%' version="1.1" xmlns="http://www.w3.org/2000/svg">
    {values.map((val, i) => {
      return <rect
        key={i}
        x={i * stripeWidth}
        y='0'
        width={stripeWidth}
        height='50'
        fill={interpolateViridis(val)}
        />
    })}
  </svg>
}

export default Colors
