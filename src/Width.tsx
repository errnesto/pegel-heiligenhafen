import React from 'react'
import { scaleLinear } from 'd3'
import { interpolateViridis } from 'd3-scale-chromatic'

type Gauge = number
interface Props {
  data: Gauge[]
}
const Width = (props: Props) => {
  const { data } = props

  const normalGauge = 504
  const offset = 100
  // set to values between 0 and 1 where 0.5 is the normalGauge
  // for the eastern see
  // console.log(gauges)
  const scale = scaleLinear()
    .domain([normalGauge - offset, normalGauge + offset])
    .range([0, 1])

  const values = data.map(value => scale(value))

  interface Agregate {
    offset: number,
    values: number[][]
  }
  const withOffset = values.reduce((agregate, next) => {
    const offset = agregate.offset
    agregate.offset += next
    agregate.values.push([offset, next])
    return agregate
  }, { offset: 0, values: [] } as Agregate)

  const stripeWidth = 20
  return <svg viewBox={`0 0 ${stripeWidth * data.length} 50`} width='100%' height='100%' version="1.1" xmlns="http://www.w3.org/2000/svg">
    {withOffset.values.map((val, i) => {
      return <rect
        key={i}
        x={val[0] * stripeWidth}
        y='0'
        width={val[1] * stripeWidth}
        height='50'
        fill={i % 2 ? '#CAE300' : '#178E8E'}
        />
    })}
  </svg>
}

export default Width
