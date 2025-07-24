import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type AssignedAsset = {
  id: string;
  amount: number;
};

type FamilyMember = {
  name: string;
  relationship?: string;
  assets: number;
  assignedAssets?: AssignedAsset[];
};

type WillDocumentProps = {
  clientName: string;
  clientAddress: string;
  clientNRIC: string;
  family: FamilyMember[];
};

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 4 },
  section: { marginBottom: 10 },
  indent: { marginLeft: 10 },
});

const WillDocument = ({ clientName, clientAddress, clientNRIC, family }: WillDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Last Will</Text>
      <View style={styles.section}>
        <Text style={styles.text}>
          I, {clientName}, of {clientAddress}, hereby declare this to be my Last Will.
        </Text>
        <Text style={styles.text}>NRIC No: {clientNRIC}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>I appoint the following family members as beneficiaries:</Text>
        {family.map((member, idx) => (
          <View key={idx} style={styles.indent}>
            <Text style={styles.text}>
              - {member.name} ({member.relationship}) : RM {member.assets}
            </Text>
            {member.assignedAssets?.map((a, i) => (
              <Text key={i} style={styles.text}>
                {"  "}• {a.id} : RM {a.amount}
              </Text>
            ))}
          </View>
        ))}
      </View>

      <Text style={styles.text}>This document is valid as of today.</Text>
    </Page>
  </Document>
);

export default WillDocument;
