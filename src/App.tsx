import React, { useEffect, useState } from 'react'
import { csvParse } from 'd3'
import Width from 'Width'

interface CSVROW { time: string, gauge: string, width: string }
const App = () => {
  const inital: CSVROW[] = []
  const [widths, setWidths] = useState(inital)

  useEffect(() => {
    async function fetchData () {
      const res = await fetch('./data.csv')
      const text = await res.text()
      const data: any = csvParse(text)

      setWidths(data)
    }
    fetchData()
  }, [])

  const data = widths.map(gauge => parseFloat(gauge.width))

  return <>
    <Width data={data} />
    <table>
      <thead>
        <tr>
          <td>#</td>
          <td>time</td>
          <td>gauge</td>
          <td>width</td>
        </tr>
      </thead>
      <tbody>
        {widths.map((val, i) =>
          <tr>
            <td>{i}</td>
            <td>{val.time}</td>
            <td>{val.gauge}</td>
            <td>{val.width}</td>
          </tr>
        )}
      </tbody>
    </table>
  </>
}

export default App
