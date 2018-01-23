const fakeComissionResponse = {
  date: '2018-01-22 21:47:00',
  commission: '0.01'
}

const fakeRateResponse = {
  date: '2018-01-22 21:47:00',
  purchase: '0.000032',
  sale: '0.000031'
}

const fakeRateHistoryResponse = [{
  date: '2018-01-22 21:46:00',
  purchase: '0.000032',
  sale: '0.000031'
}, {
  date: '2018-01-22 21:47:00',
  purchase: '0.000032',
  sale: '0.000031'
}]

export async function fetchRates () {
  Promise.all([
    fetch('https://bittrex.com/home/api'),
    fetch('https://www.yobit.net/ru/api/'),
    fetch('https://www.kraken.com/help/api')
  ])
  return {
    bittrex: { date: new Date(), purchase: Math.random(), sale: Math.random() },
    yobit: { date: new Date(), purchase: Math.random(), sale: Math.random() },
    kraken: { date: new Date(), purchase: Math.random(), sale: Math.random() }
  }
}

export function fetchRateHistory (n) {
  function arrayFill (size, gen) {
    return Array(size).fill(null).map(gen)
  }

  const randGen = () => {
    let date = new Date()
    let count = n
    return () => {
      const newDate = new Date(date.setSeconds(date.getSeconds() - count * 5))
      count -= 1
      return { date: newDate, purchase: Math.random(), sale: Math.random() }
    }
  }

  return {
    bittrex: arrayFill(n, randGen()),
    yobit: arrayFill(n, randGen()),
    kraken: arrayFill(n, randGen())
  }
}
