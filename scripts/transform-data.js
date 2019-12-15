const fs = require('fs')
const path = require('path')
const d3 = require('d3')

function pad(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

const parser = d3.dsvFormat(';')
const gauges = d3.range(14).reduce((agregate, idx) => {
  const day = idx + 1
  const num = pad(day, 2)
  const dayDataString = fs.readFileSync(path.join(__dirname, `../data/201912${num}.csv`), 'utf8')

  // the csv does not have nice keys since the first line is just a description
  // wat we can deal with that
  const hourKey = `${num}.12.2019`
  const valueKey = 'WSA L�BECK'
  const dayData = parser
    .parse(dayDataString)
    // only get the values from 12:00h and 24:00
    // (the raw data has a key 24:00h – I dont really know what that is
    // node will set it to 00:00 on the next day and I hope this is what they mean)
    .filter(row => row[hourKey] === '12:00' || row[hourKey] === '24:00')
    .map(row => {
      // use a standard date string
      // all times provided by pegelonline.de are UTC+1
      // and in this script we only use data from december 2019
      const year = 2019
      const month = 11 // <- yup this is december
      const [hour, minute] = row[hourKey].split(':')
      const date = new Date(Date.UTC(year, month, day, hour, minute))
      return { time: date.toISOString(), gauge: +row[valueKey] }
    })

  return [...agregate, ...dayData]
}, [])

const normalGauge = 504 // cm over 
const offset = 100 // cm
// set to values between 0 and 6 where 3 is the normalGauge
// for the eastern see
const scale = d3.scaleLinear()
  .domain([normalGauge - offset, normalGauge + offset])
  .range([0, 6])

const widths = gauges.map(gauge => {
  return { ...gauge, width: scale(gauge.gauge).toFixed(2)}
})

const csv = d3.csvFormat(widths)

fs.writeFileSync(path.join(__dirname, '../public/data.csv'), csv, 'utf8')
// fs.writeFileSync(path.join(__dirname, '../public/nodes.csv'), formatedNodes, 'utf8')
console.log('ok')