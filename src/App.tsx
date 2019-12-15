import React, { useEffect, useState } from 'react'
import { csvParse } from 'd3'
import Colors from 'Colors'

const App = () => {
  const inital: number[][] = []
  const [gauges, setGauges] = useState(inital)

  useEffect(() => {
    async function fetchData () {
      const res = await fetch('./data.csv')
      const text = await res.text()
      const data: any = csvParse(text)

      setGauges(data)
    }
    fetchData()
  }, [])

  const normalGauge = 504
  // set to values between 0 and 1 where 0.5 is the normalGauge
  // for the eastern see
  const data = gauges.map(gauge => gauge[1] / (normalGauge * 2))

  console.log(data)

  return <Colors data={data} />
}

export default App
