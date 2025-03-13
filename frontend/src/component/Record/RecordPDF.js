// RecordPDF.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  tableCell: {
    fontSize: 10,
  },
});

const RecordPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Filtered Records</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Customer Name</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>CNIC</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Type</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Gold</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Amount</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Date</Text>
          </View>
        </View>
        {data.map((record, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{record.customerName}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{record.cnic}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{record.type}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{record.gold}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{record.amount}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{record.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default RecordPDF;