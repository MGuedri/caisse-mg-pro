'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Order } from '@/app/(app)/app-provider';

export const TicketPDF: React.FC<{ order: Order, commerceName?: string }> = ({ order, commerceName = "Café Mon Plaisir" }) => {
  const styles = StyleSheet.create({
    page: { padding: 20, fontFamily: 'Helvetica', fontSize: 10 },
    centerText: { textAlign: 'center' },
    header: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
    subHeader: { fontSize: 8, marginBottom: 5 },
    section: { borderTop: '1px solid black', paddingTop: 5, marginTop: 5 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
    bold: { fontWeight: 'bold' },
    footer: { fontSize: 8, marginTop: 20, color: '#666' }
  });

  return (
    <Document>
      <Page size={[80, 150]} style={styles.page}>
        <View>
          <Text style={[styles.centerText, styles.header]}>{commerceName}</Text>
          <Text style={[styles.centerText, styles.subHeader]}>Ticket n°{order.id.slice(-4)}</Text>
          <Text style={[styles.centerText, styles.subHeader, {marginBottom: 10}]}>{order.timestamp}</Text>
          <Text style={[styles.centerText, styles.subHeader, {marginBottom: 10}]}>Client: {order.clientName}</Text>

          {order.items.map((item, idx) => (
            <View key={idx} style={styles.row}>
              <Text>{item.name} x{item.quantity}</Text>
              <Text>{(item.price * item.quantity).toFixed(3)} DT</Text>
            </View>
          ))}

          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.bold}>Total:</Text>
              <Text style={styles.bold}>{order.total.toFixed(3)} DT</Text>
            </View>
          </View>

          <Text style={[styles.centerText, styles.footer]}>Merci de votre visite !</Text>
          <Text style={[styles.centerText, {fontSize: 8, color: '#666'}]}>www.monplaisir.com</Text>
        </View>
      </Page>
    </Document>
  );
};
