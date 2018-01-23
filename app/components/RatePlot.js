import React from 'react'
import { View, Text } from 'react-native'
import {
  VictoryChart,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel
} from 'victory-native'
import moment from 'moment'

const lineOptions = ({ data, color = 'black' }) => ({
  data,
  x: 'date',
  y: 'purchase',
  style: {
    data: {
      stroke: color,
      strokeWidth: (d, active) => { return active ? 2 : 2 }
    },
    labels: { fill: color }
  }
})

class RatePlot extends React.Component {
  render () {
    const { exchangers, rateHistory, isReloading } = this.props

    return (
      <View>
        {isReloading ? (
          <Text>Loading</Text>
        ) : (
          <VictoryChart theme={VictoryTheme.material} height={400} width={400}
            domainPadding={{ y: 10 }}
            containerComponent={
              <VictoryVoronoiContainer
                voronoiDimension='x'
                labels={(d) => `rate: ${d.y}`}
                labelComponent={
                  <VictoryTooltip
                    cornerRadius={0}
                    flyoutStyle={{ fill: 'white' }}
                  />}
            />}>
            <VictoryAxis
              scale='time'
              standalone={false}
              tickFormat={x => moment(x).format('h:mm:ss')}
              fixLabelOverlap
            />

            <VictoryAxis
              dependentAxis
            />

            {Object.values(rateHistory).map(history => {
              const exchanger = exchangers[history.exchanger]
              const options = lineOptions({ data: history.data, color: exchanger.color })
              return (
                <VictoryLine key={history.id} {...options} />
              )
            })}

          </VictoryChart>
        )}
      </View>
    )
  }
}

export default RatePlot
