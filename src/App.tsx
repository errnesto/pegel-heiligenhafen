import React, { useEffect, useState } from 'react'
import { csvParse } from 'd3'
import Colors from 'Colors'
import Width from 'Width'

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

  const data = gauges.map(gauge => gauge[1])

  return <Width data={data} />
}

export default App
