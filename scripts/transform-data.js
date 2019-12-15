// this will take gauge data from heiligenhafen and calculate widths of stripes that
// can be used to visualize the sealevel
// and store this to a csv file

const fs = require('fs')
const path = require('path')
const d3 = require('d3')

/*
* a super simple function that can ad leading 0 to a number
*/
function pad(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

const parser = d3.dsvFormat(';')
const numberOfDays = 14
const gauges = d3.range(numberOfDays).reduce((agregate, idx) => {
  const day = idx + 1
  const num = pad(day, 2)
  // load data file
  const dayDataString = fs.readFileSync(path.join(__dirname, `../data/201912${num}.csv`), 'utf8')

  // the header in the csv does not match the values
  // it is not a real header but a description of the file
  // so our keys end up looking like this:
  
  // in the first column of the description is the date of the file
  // the in this column are the hour values so this is our hour key
  const hourKey = `${num}.12.2019`
  // the second column holds the water gauge
  // the key ends up beeing the name of the station since that
  // is the second part of the description
  const valueKey = 'WSA L�BECK'
 
  const dayData = parser
    .parse(dayDataString)
    // only get the values from 12:00h and 24:00
    // (the raw data has a key 24:00h – I dont really know what that is
    // node will set it to 00:00 on the next day – I hope this is what they mean)
    .filter(row => row[hourKey] === '12:00' || row[hourKey] === '24:00')
    .map(row => {
      // in this script we only use data from december 2019
      const year = 2019
      const month = 11 // <- yup this is december
      const [hour, minute] = row[hourKey].split(':')
      // all times provided by pegelonline.de are UTC+1
      const utcHour = hour - 1
      const date = new Date(Date.UTC(year, month, day, utcHour, minute))

      return {
        time: date.toISOString(),
        gauge: parseFloat(row[valueKey])
      }
    })

  return [...agregate, ...dayData]
}, [])

// this is the normal sea leavel for our station
const normalGauge = 504 // cm over
// our domain will be 100 cm above and below that
const offset = 100 // cm

// set to values between 0 and 6 where
// so the average width should be 3
const scale = d3.scaleLinear()
  .domain([normalGauge - offset, normalGauge + offset])
  .range([0, 6])

const widths = gauges.map(gauge => {
  return { ...gauge, width: scale(gauge.gauge).toFixed(2)}
})

const csv = d3.csvFormat(widths)

fs.writeFileSync(path.join(__dirname, '../public/data.csv'), csv, 'utf8')
console.log('ok')
