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
  trustatorName: string;
  trustatorNRIC: string;
  trustatorAddress: string;
  trusteeName: string;
  trusteeNRIC: string;
  trusteeAddress: string;
  alternateTrusteeName?: string;
  alternateTrusteeAddress?: string;
  family: FamilyMember[];
};

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 18, marginBottom: 10, textAlign: "center" },
  section: { marginBottom: 12 },
  text: { fontSize: 12, marginBottom: 6, lineHeight: 1.5 },
  indent: { marginLeft: 10 },
});

const WillDocument = ({
  trustatorName,
  trustatorNRIC,
  trustatorAddress,
  trusteeName,
  trusteeNRIC,
  trusteeAddress,
  alternateTrusteeName,
  alternateTrusteeAddress,
  family,
}: WillDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>LAST WILL AND TESTAMENT</Text>

      <View style={styles.section}>
        <Text style={styles.text}>
          I, {trustatorName} (NRIC NO. {trustatorNRIC}) of {trustatorAddress} do hereby revoke all former testamentary
          dispositions made by me and declare this to be my last will.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          1. I appoint my daughter, {trusteeName} (NRIC NO. {trusteeNRIC}) of {trusteeAddress} (hereinafter referred to
          as “my Trustee”) to be the sole Executrix and Trustee of this my Will.
        </Text>

        {alternateTrusteeName && alternateTrusteeAddress && (
          <Text style={styles.text}>
            If my daughter is unwilling and/or unable to act as my Trustee, I appoint {alternateTrusteeName} of{" "}
            {alternateTrusteeAddress} to be the sole Executor and Trustee of this my Will.
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          2. Subject to the payment of my just debts, funeral and testamentary expenses and estate duty (if any) out of
          my personal estate, I give all my properties movable and immovable of whatsoever nature and whatsoever
          situated which I may be possessed of or entitled to at my death (hereinafter collectively called “my
          Property”) to my Trustee UPON TRUST with power of conversion to pay my debts, funeral, testamentary and
          administration expenses and estate duty and subject thereto I direct my Trustee to distribute the same in the
          manner I hereafter direct.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          3. I devise and bequeath all my Property to my Trustee, {trusteeName} (NRIC NO. {trusteeNRIC}) absolutely.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          4. I direct that prior to distribution of my Estate, my Trustee shall be entitled to deal with my Estate in
          her absolute discretion without being liable for loss except for any loss which may arise through her neglect
          or willful default.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>5. Distribution of Assets:</Text>
        {family.map((member, idx) => (
          <View key={idx} style={styles.indent}>
            <Text style={styles.text}>
              - {member.name} ({member.relationship || "Beneficiary"})
            </Text>
            {member.assignedAssets?.map((asset, i) => (
              <Text key={i} style={styles.text}>
                {"  "}• {asset.id}
              </Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          IN WITNESS WHEREOF I, the said {trustatorName} (NRIC NO. {trustatorNRIC}) have hereunto set my hand and seal
          this …… day of …… in this year Two Thousand Twenty-Five (2025).
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>SIGNED BY the abovenamed</Text>
        <Text style={styles.text}>
          {trustatorName} as her last Will in the presence of us both being present at the same time who at her request
          in her presence and in the presence of each other have hereunto subscribed our names as witnesses:-
        </Text>
        <Text style={styles.text}>..................................................</Text>
        <Text style={styles.text}>Witness:</Text>
        <Text style={styles.text}>1. .............................................</Text>
        <Text style={styles.text}>2. .............................................</Text>
      </View>
    </Page>
  </Document>
);

export default WillDocument;
