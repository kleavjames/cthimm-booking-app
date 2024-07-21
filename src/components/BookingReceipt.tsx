import { SeatCategoryEnum } from "@/constants/seats";
import { Bookings } from "@/types/bookings";
import { numberWithCommas } from "@/utils/strings";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { FC, useMemo } from "react";
import { format, addDays } from "date-fns";

type BookingReceiptProps = {
  bookings: Bookings[];
};

// Create Document Component
export const BookingReceipt: FC<BookingReceiptProps> = ({ bookings }) => {
  const billDetails = bookings[0];
  const totalAmount = bookings.reduce((acc, curr) => acc + curr.amount, 0);
  const vipDetails = useMemo(() => {
    const vipBookings = bookings.filter(
      (booking) => booking.seat_category === SeatCategoryEnum.VIP
    );

    return {
      seats: vipBookings.map((booking) => booking.seat).join(", "),
      qty: vipBookings.length,
      unitPrice: 500,
      amount: vipBookings.reduce((acc, curr) => acc + curr.amount, 0),
    };
  }, [bookings]);
  const premiereDetails = useMemo(() => {
    const premiereBookings = bookings.filter(
      (booking) => booking.seat_category === SeatCategoryEnum.PREMIERE
    );

    return {
      seats: premiereBookings.map((booking) => booking.seat).join(", "),
      qty: premiereBookings.length,
      unitPrice: 400,
      amount: premiereBookings.reduce((acc, curr) => acc + curr.amount, 0),
    };
  }, [bookings]);

  // new date() + 1 day
  const tomorrow = addDays(new Date(), 1);

  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.topView}>
          <Text style={styles.topText}>Invoice</Text>
        </View>
        <View style={styles.mainHeader}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Booking Date</Text>
            <Text style={styles.headerText}>{format(new Date(), "PPP")}</Text>
          </View>
          <View style={styles.header}>
            <Text style={[styles.headerText, { color: "red" }]}>
              Cancellation Date
            </Text>
            <Text style={[styles.headerText, { color: "red" }]}>
              {format(tomorrow, "PPP")}
            </Text>
          </View>
        </View>
        <View style={styles.bill}>
          <Text style={styles.billTo}>Bill to</Text>
          <Text style={styles.baseText}>{billDetails.fullname}</Text>
          <Text style={styles.baseText}>{billDetails.mobile}</Text>
          <Text style={styles.baseText}>{billDetails.network}</Text>
        </View>
        <View>
          <Text style={{ marginBottom: 25, color: "blue" }}>
            Php {numberWithCommas(totalAmount)}.00 due on{" "}
            {format(tomorrow, "PPP")}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 30,
            }}
          >
            <Text style={{ fontSize: 12, flexBasis: 200 }}>Seats</Text>
            <Text style={{ fontSize: 12, flexBasis: 100 }}>Category</Text>
            <Text style={{ fontSize: 12, flexBasis: 100 }}>Qty</Text>
            <Text style={{ fontSize: 12, flexBasis: 100 }}>Unit Price</Text>
            <Text style={{ fontSize: 12, flexBasis: 100 }}>Amount</Text>
          </View>
          <View style={{ border: 0.5, marginTop: 10, marginBottom: 10 }}></View>
          <View style={{ display: "flex", gap: 10 }}>
            {vipDetails.qty > 0 && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 30,
                }}
              >
                <Text style={{ fontSize: 12, flexBasis: 200 }}>
                  {vipDetails.seats}
                </Text>
                <Text style={{ fontSize: 12, flexBasis: 100 }}>VIP</Text>
                <Text style={{ fontSize: 12, flexBasis: 100 }}>
                  {vipDetails.qty}
                </Text>
                <Text style={{ fontSize: 12, flexBasis: 100 }}>
                  {vipDetails.unitPrice}
                </Text>
                <Text style={{ fontSize: 12, flexBasis: 100 }}>
                  {numberWithCommas(vipDetails.amount)}
                </Text>
              </View>
            )}
            {premiereDetails.qty > 0 && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 30,
                }}
              >
                <Text style={{ fontSize: 12, flexBasis: 200 }}>
                  {premiereDetails.seats}
                </Text>
                <Text style={{ fontSize: 12, flexBasis: 100 }}>Premiere</Text>
                <Text style={{ fontSize: 12, flexBasis: 100 }}>
                  {premiereDetails.qty}
                </Text>
                <Text style={{ fontSize: 12, flexBasis: 100 }}>
                  {premiereDetails.unitPrice}
                </Text>
                <Text style={{ fontSize: 12, flexBasis: 100 }}>
                  {numberWithCommas(premiereDetails.amount)}
                </Text>
              </View>
            )}
            <View style={{ border: 0.5 }}></View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 30,
              }}
            >
              <Text style={{ fontSize: 12, flexBasis: 200 }}></Text>
              <Text style={{ fontSize: 12, flexBasis: 100 }}></Text>
              <Text style={{ fontSize: 12, flexBasis: 100 }}></Text>
              <Text style={{ fontSize: 12, flexBasis: 100 }}>Total</Text>
              <Text style={{ fontSize: 12, flexBasis: 100 }}>
                {numberWithCommas(totalAmount)}.00
              </Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 35 }}>
          <Text>Payment Details</Text>
          <View
            style={{ border: 0.5, width: 260, marginTop: 5, marginBottom: 10 }}
          ></View>
          <View style={{ display: "flex", gap: 5 }}>
            <View style={styles.header}>
              <Text style={{ flexBasis: 150, fontSize: 14, marginTop: 5 }}>
                Gcash
              </Text>
              <Text style={styles.headerText}></Text>
            </View>
            <View style={styles.header}>
              <Text style={{ flexBasis: 150, fontSize: 14 }}>
                Felochie Gencianos
              </Text>
              <Text style={styles.headerText}>09983459439</Text>
            </View>
            <View style={styles.header}>
              <Text style={{ flexBasis: 150, fontSize: 14 }}>
                Mary Crystel Isais
              </Text>
              <Text style={styles.headerText}>09225046717</Text>
            </View>
          </View>
          <View style={{ display: "flex", gap: 5, marginTop: 10 }}>
            <View style={styles.header}>
              <Text style={{ flexBasis: 150, fontSize: 14, marginTop: 5 }}>
                Unionbank
              </Text>
              <Text style={styles.headerText}></Text>
            </View>
            <View style={styles.header}>
              <Text style={{ flexBasis: 150, fontSize: 14 }}>
                Mary Crystel Isais
              </Text>
              <Text style={styles.headerText}>109350014528</Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, marginTop: 35, color: "#9aa0a6" }}>
            Please pay on or before due date to avoid cancellation
          </Text>
          <Text style={{ fontSize: 12, marginTop: 10, color: "#9aa0a6" }}>
            Please send a direct message for your proof of payment (screenshot,
            deposit slip, or reference no.) to FB Page: CTHIMM Online Portal
          </Text>
          <Text style={{ fontSize: 12, marginTop: 35, color: "#9aa0a6" }}>
            Reminders:
          </Text>
          <Text style={{ fontSize: 12, marginTop: 10, color: "#9aa0a6" }}>
            You are given 24 hours to pay for your reservation and send your
            proof of payment. Failure to comply will result to the cancellation
            of the reservation.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  topView: {
    marginBottom: 35,
  },
  topText: {
    fontSize: 32,
  },
  mainHeader: {
    display: "flex",
    gap: 6,
    marginBottom: 35,
  },
  headerText: {
    flexBasis: 150,
    fontSize: 14,
  },
  baseText: {
    fontSize: 14,
  },
  bill: {
    display: "flex",
    gap: 4,
    marginBottom: 35,
  },
  billTo: {
    fontSize: 14,
    marginBottom: 5,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  paymentDetails: {
    flexBasis: 200,
    fontSize: 14,
  },
});
