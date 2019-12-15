const fs = require('fs')
const path = require('path')
const d3 = require('d3')

function pad(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

const parser = d3.dsvFormat(';')
const data = d3.range(15).reduce((agregate, idx) => {
  const num = pad(idx + 1, 2)
  const dayDataString = fs.readFileSync(path.join(__dirname, `../data/201912${num}.csv`), 'utf8')

  // the csv does not have nice keys since the first line is just a description
  // wat we can deal with that
  const hourKey = `${num}.12.2019`
  const valueKey = 'WSA L�BECK'
  const dayData = parser
    .parse(dayDataString)
    // only get the values from 12:00 h
    .filter(row => row[hourKey] === '12:00' || row[hourKey] === '00:01')
    .map(row => [`${hourKey} ${row[hourKey]}`, row[valueKey]])
    // .reduce((agregate, row) => {

    // }, {})

  return [...agregate, ...dayData]
}, [])

const csv = d3.csvFormat(data)

fs.writeFileSync(path.join(__dirname, '../public/data.csv'), csv, 'utf8')
// fs.writeFileSync(path.join(__dirname, '../public/nodes.csv'), formatedNodes, 'utf8')
console.log('ok')