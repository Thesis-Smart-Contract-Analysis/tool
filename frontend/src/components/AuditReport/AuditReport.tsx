import React from "react";

import {
  Document,
  Image,
  PDFViewer,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";

import logo from "@/assets/logo.png";

import "./AuditReport.scss";
import useAuditReport from "./hooks/useAuditReport";
import { SEVERITY_COLOR_MAPPING, SEVERITY_DESCRIPTION } from "./constant";
import usePrepare from "./hooks/usePrepare";

const VulnerabilityRow: React.FC<{
  severity: string;
  detectionTool: string;
  vulnType: string;
  instance: number;
  status: string;
  index: number;
}> = ({ severity, detectionTool, vulnType, status, instance, index }) => {
  const { severityStyles, summaryResultStyles } = useAuditReport();

  return (
    <View style={summaryResultStyles.tableRow} break={index === 18}>
      <View
        style={{
          width: "20%",
          ...summaryResultStyles.tableColumn,
        }}
      >
        <Text
          style={{
            backgroundColor:
              SEVERITY_COLOR_MAPPING[
                severity as keyof typeof SEVERITY_COLOR_MAPPING
              ],
            ...severityStyles.severityColor,
          }}
        ></Text>
        <Text>{severity}</Text>
      </View>
      <View
        style={{
          width: "40%",
          ...summaryResultStyles.tableColumn,
        }}
      >
        <Text>{vulnType}</Text>
      </View>
      <View
        style={{
          width: "15%",
          ...summaryResultStyles.tableColumn,
        }}
      >
        <Text>{detectionTool}</Text>
      </View>
      <View
        style={{
          width: "10%",
          ...summaryResultStyles.tableColumn,
        }}
      >
        <Text>{instance}</Text>
      </View>
      <View
        style={{
          width: "15%",
          ...summaryResultStyles.tableColumn,
        }}
      >
        <Text>{status}</Text>
      </View>
    </View>
  );
};

const AuditReport: React.FC = () => {
  const { styles, frontPageStyles, severityStyles, summaryResultStyles } =
    useAuditReport();

  const { summaryResult } = usePrepare();

  return (
    <PDFViewer className="pdf-viewer">
      <Document title="Smart contract name">
        {/* Front Page */}
        <Page style={frontPageStyles.root}>
          <View style={frontPageStyles.container}>
            <View style={frontPageStyles.header}>
              <View style={frontPageStyles.header__logo}>
                <Image src={logo} style={frontPageStyles.logoImage} />
                <Text style={frontPageStyles.logoText}>SO1SCAN</Text>
              </View>
              <Text style={frontPageStyles.header__text}>
                Bảo vệ hợp đồng thông minh của bạn
              </Text>
            </View>
            <View style={frontPageStyles.body}>
              <Text style={frontPageStyles.body__title}>
                Báo cáo các lỗ hổng bảo mật
              </Text>
              <View style={frontPageStyles.body__description}>
                <Text style={frontPageStyles.contractName}>Tên hợp đồng</Text>
                <Text style={frontPageStyles.date}>Ngày lập báo cáo</Text>
              </View>
              <Text style={frontPageStyles.body__smallText}>
                Báo cáo này được thực hiện bởi So1Scan
              </Text>
            </View>
            <View style={frontPageStyles.footer}>
              <Text style={frontPageStyles.footer__smallText}>
                So1Scan &bull; Báo cáo các lỗ hổng bảo mật
              </Text>
            </View>
          </View>
        </Page>

        {/* Page layout */}
        <Page style={styles.body} wrap>
          {/* Header */}
          <View style={styles.header} fixed>
            <View style={styles.header__logo}>
              <Image src={logo} style={styles.logoImage} />
              <Text style={styles.logoText}>SO1SCAN</Text>
            </View>
            <Text style={styles.header__text}>Được thực hiện bởi So1Scan</Text>
          </View>

          {/* Severity Section */}
          <View style={severityStyles.container}>
            <View style={severityStyles.section}>
              <Text style={severityStyles.section__number}>1</Text>
              <Text style={severityStyles.section__text}>
                Phân loại mức độ nghiêm trọng
              </Text>
            </View>
            <View style={severityStyles.body}>
              <Text style={severityStyles.description}>
                Mỗi lỗ hổng tìm được sẽ có một mức độ nghiêm trọng (severity)
                khác nhau. Báo cáo này sẽ dựa vào các loại mức độ nghiêm trọng
                sau (được sắp xếp từ mức độ nghiêm trọng cao nhất cho đến mức độ
                nghiêm trọng thấp nhất):
              </Text>
              <View style={severityStyles.severityList}>
                {SEVERITY_DESCRIPTION.map((severity) => (
                  <View key={severity.type} style={severityStyles.severityItem}>
                    <View style={severityStyles.severityType}>
                      <Text
                        style={{
                          backgroundColor: severity.color,
                          ...severityStyles.severityColor,
                        }}
                      ></Text>
                      <Text style={severityStyles.type}>{severity.type}</Text>
                    </View>
                    <Text style={severityStyles.severityDescription}>
                      {severity.description}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={summaryResultStyles.container} break>
            <View style={summaryResultStyles.section}>
              <Text style={summaryResultStyles.section__number}>2</Text>
              <Text style={summaryResultStyles.section__text}>
                Bảng tổng kết các lỗ hổng bảo mật
              </Text>
            </View>
            <View style={summaryResultStyles.body}>
              <View style={summaryResultStyles.table}>
                <View style={summaryResultStyles.tableHeader}>
                  <View
                    style={{
                      width: "20%",
                      ...summaryResultStyles.tableColumn,
                    }}
                  >
                    <View style={{ margin: "auto" }}>
                      <Text>Mức độ nghiêm trọng</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "40%",
                      ...summaryResultStyles.tableColumn,
                    }}
                  >
                    <View style={{ margin: "auto" }}>
                      <Text>Loại lỗ hổng</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "15%",
                      ...summaryResultStyles.tableColumn,
                    }}
                  >
                    <View style={{ margin: "auto" }}>
                      <Text>Công cụ phát hiện</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "10%",
                      ...summaryResultStyles.tableColumn,
                    }}
                  >
                    <View style={{ margin: "auto" }}>
                      <Text>Số lần xuất hiện</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      width: "15%",
                      ...summaryResultStyles.tableColumn,
                    }}
                  >
                    <View style={{ margin: "auto" }}>
                      <Text>Trạng thái</Text>
                    </View>
                  </View>
                </View>
                <View style={summaryResultStyles.tableRows}>
                  {summaryResult?.map((vuln, index) => {
                    return (
                      <VulnerabilityRow
                        key={index}
                        severity={vuln.severity}
                        vulnType={vuln.vulId}
                        detectionTool={vuln.scanningTool}
                        instance={vuln.instance}
                        status="Pending Fix"
                        index={index % 19}
                      />
                    );
                  })}
                </View>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer} fixed>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber }) =>
                `Trang ${pageNumber.toString().padStart(2, "0")}`
              }
              fixed
            />
            <Text style={styles.footerText}>
              So1Scan &bull; Báo cáo các lỗ hổng bảo mật
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default AuditReport;
