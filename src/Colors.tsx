import React from 'react'
import { interpolateRdPu } from 'd3-scale-chromatic'

type Gauge = number
interface Props {
  data: Gauge[]
}
const Colors = (props: Props) => {
  const { data } = props

  const stripeWidth = 20
  return <svg viewBox={`0 0 ${stripeWidth * data.length} 50`} width='100%' height='100%' version="1.1" xmlns="http://www.w3.org/2000/svg">
    {data.map((gauge, i) => {
      return <rect
        x='0'
        y={i * stripeWidth}
        width={stripeWidth}
        height='50'
        fill={interpolateRdPu(gauge)}
        />
    })}
  </svg>
}

export default Colors
