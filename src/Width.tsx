import React from 'react'

type Gauge = number
interface Props {
  data: Gauge[]
}
const Width = (props: Props) => {
  const { data } = props

  interface Agregate {
    offset: number,
    values: number[][]
  }
  const withOffset = data.reduce((agregate, next) => {
    const offset = agregate.offset
    agregate.offset += next
    agregate.values.push([offset, next])
    return agregate
  }, { offset: 0, values: [] } as Agregate)

  const totalWidth = data.reduce((sum, next) => sum + next, 0)

  const stripeWidth = 20
  return <svg viewBox={`0 0 ${stripeWidth * totalWidth} 50`} width='100%' height='100%' version="1.1" xmlns="http://www.w3.org/2000/svg">
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
