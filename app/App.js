import React from 'react'
import { StyleSheet, Text, View, RefreshControl, Platform } from 'react-native'

import Expo from 'expo'
import { Container, Content, Header, Body, Title, H3 } from 'native-base'

import moment from 'moment'
import R, { evolve, curry, map, last, values, mapObjIndexed } from 'ramda'

import RatePlot from './components/RatePlot'
import RateTable from './components/RateTable'

import { fetchRates, fetchRateHistory } from './util/api'

// Request exchange rate every 5 sec
const REQUEST_RATE = 5 * 1000

const nextPlotValue = curry((nextVal, data) => (
  data.slice(1).concat(nextVal)
))

function prepareTable (rateHistory, exchangers) {
  let min = Infinity
  let max = -Infinity
  let mini = -1
  let maxi = -1
  const data = values(mapObjIndexed((rate, i) => {
    const exchanger = exchangers[rate.exchanger]
    const { purchase, sale } = last(rate.data)
    if (purchase < min) {
      min = purchase
      mini = i - 1
    }
    if (sale > max) {
      max = sale
      maxi = i - 1
    }
    return [exchanger.name, purchase, sale]
  }, rateHistory))
  return { data, mini, maxi }
}

export default class App extends React.Component {
  state = {
    loadingError: false,
    isRefreshing: false,

    isReloading: true,
    lastUpdated: new Date(),

    exchangers: {
      1: { id: 1, name: 'Bittrex', color: 'tomato' },
      2: { id: 2, name: 'Yobit', color: 'blue' },
      3: { id: 3, name: 'Kraken', color: 'black' }
    },

    rateHistory: {
      1: { id: 1, exchanger: 1, data: [] },
      2: { id: 2, exchanger: 2, data: [] },
      3: { id: 3, exchanger: 3, data: [] }
    }
  }

  constructor (props) {
    super(props)
    this.requestInterval = setInterval(this.fetchNextTick, REQUEST_RATE)
  }

  async componentDidMount () {
    this.setState({ isReloading: true })
    const rates = await fetchRateHistory(3)
    const lastUpdated = new Date()

    this.setState((prevState, props) => {
      const transformations = {
        1: { data: () => rates.bittrex },
        2: { data: () => rates.yobit },
        3: { data: () => rates.kraken }
      }
      const newRateHistory = evolve(transformations, prevState.rateHistory)
      return {
        isReloading: false,
        lastUpdated: lastUpdated,
        rateHistory: newRateHistory
      }
    })
  }

  componentWillUnmount () {
    clearInterval(this.requestInterval)
  }

  fetchNextTick = async () => {
    this.setState({ isReloading: true })
    const rates = await fetchRates()
    const lastUpdated = new Date()

    this.setState((prevState, props) => {
      const transformations = {
        1: { data: nextPlotValue(rates.bittrex) },
        2: { data: nextPlotValue(rates.yobit) },
        3: { data: nextPlotValue(rates.kraken) }
      }
      const newRateHistory = evolve(transformations, prevState.rateHistory)
      return {
        isReloading: false,
        lastUpdated: lastUpdated,
        rateHistory: newRateHistory
      }
    })
  }

  render () {
    const tableData = this.state.isReloading
      ? null
      : prepareTable(this.state.rateHistory, this.state.exchangers)

    const defaults = values(map(ex => [ex.name, '', ''], this.state.exchangers))

    const lastUpdated = moment(this.state.lastUpdated).calendar()

    this.state.rateHistory && console.log(this.state.rateHistory[1].data.length)

    return (
      <Container>

        <Header style={styles.headerBack} iosBarStyle={'light-content'}>
          <Body>
            <Title style={styles.headerTitle}>BTC Currency</Title>
          </Body>
        </Header>

        <Content refreshControl={
          <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.fetchNextTick} />} >
          <View style={styles.mainContainer}>
            <H3 style={styles.heading}>Currency Chart (USD/BTC)</H3>
            <View style={styles.chartBlock}>
              <RatePlot {...this.state} />
            </View>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, marginLeft: 20}}>
              <Text style={{ height: 10, width: 10, backgroundColor: 'tomato' }} />
              <Text>Bittrex{'  '}</Text>
              <Text style={{ height: 10, width: 10, backgroundColor: 'blue' }} />
              <Text>Yobit{'  '}</Text>
              <Text style={{ height: 10, width: 10, backgroundColor: 'black' }} />
              <Text>Kraken</Text>
            </View>
            <View>
              <RateTable head={['Exchange Provider', 'Purchase', 'Sale']} tableData={tableData} defaults={defaults} />
            </View>
            <Text style={styles.lastUpdate}>Last update: {lastUpdated}</Text>
          </View>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  headerBack: {
    backgroundColor: '#005694'
  },
  headerTitle: {
    color: '#fff',
    paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight
  },
  heading: {
    alignSelf: 'center',
    paddingVertical: 10
  },
  chartBlock: {
    height: 400,
    marginBottom: 10
  },
  lastUpdate: {
    color: '#888',
    marginHorizontal: 15,
    marginVertical: 15
  }
})
