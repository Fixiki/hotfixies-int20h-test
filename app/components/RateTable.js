import React from 'react'
import { StyleSheet } from 'react-native'
import { Table, Row } from 'react-native-table-component'

export default ({ head, tableData, defaults }) => {
  return (
    <Table style={styles.table}>
      <Row data={head} style={styles.head} textStyle={styles.text} />
      {tableData ? (
        tableData.data.map((row, i) => (
          <Row key={row[0]} data={row}
            style={{
              backgroundColor: (i == tableData.mini) ? '#D8FFA2'
                : (i == tableData.maxi) ? '#D8FFA2' : '#FDFFDD'
            }}
            textStyle={styles.text} />
        ))
      ) : (
        defaults.map(rowData => (
          <Row key={rowData[0]} data={rowData} />
        ))
      )}
    </Table>
  )
}

const styles = StyleSheet.create({
  table: {
    width: 360,
    alignSelf: 'center'
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff'
  },
  text: {
    textAlign: 'center'
  }
})
