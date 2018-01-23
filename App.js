import React from 'react'
import { StyleSheet, Text, View, RefreshControl } from 'react-native'
import { Container, Content, Header, Body, Title, H3 } from 'native-base'
import { Table, TableWraper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component'

export default class App extends React.Component {
  state = {
    loadingError: false,
    isRefreshing: false
  }

  render () {
    const tableHead = ['Exchange Provider', 'Buy', 'Sell']
    const tableData = [
      ['abc', '228', '1488'],
      ['...', '227', '1337'],
      ['...', '229', '1545'],
      ['...', '230', '1129']
    ]
    return (
      <Container>

        <Header style={styles.headerBack} iosBarStyle={'light-content'}>
          <Body>
            <Title style={styles.headerTitle}>BTC Currency</Title>
          </Body>
        </Header>

        <Content refreshControl={
          <RefreshControl refreshing={this.state.isRefreshing} onRefresh={() => {}} />} >
          <View style={styles.mainContainer}>
            <H3 style={styles.heading}>Currency Chart (USD/BTC)</H3>
            <View style={styles.chartBlock} />
            <View>
              <Table style={styles.table}>
                <Row data={tableHead} style={styles.head} textStyle={styles.text} />
                <Rows data={tableData} textStyle={styles.text} />
              </Table>
            </View>
            <Text style={styles.lastUpdate}>Last update: 22.01.2018 23:15</Text>
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
    color: '#fff'
  },
  heading: {
    alignSelf: 'center',
    paddingVertical: 10
  },
  chartBlock: {
    height: 400,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 20
  },
  lastUpdate: {
    color: '#888',
    marginHorizontal: 15,
    marginVertical: 15
  },
  table: { width: 360, alignSelf: 'center' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { textAlign: 'center' }

})
