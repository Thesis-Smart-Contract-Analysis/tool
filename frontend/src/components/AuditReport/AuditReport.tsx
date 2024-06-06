import React from 'react';

import {
  Document,
  Image,
  PDFViewer,
  Page,
  Text,
  View,
} from '@react-pdf/renderer';
import { Style } from '@react-pdf/types';

import logo from '@/assets/logo.png';

import './AuditReport.scss';
import useAuditReport from './hooks/useAuditReport';
import usePrepare from './hooks/usePrepare';
import {
  SCANNING_TOOL_COLOR_MAPPING,
  SEVERITY_COLOR_MAPPING,
  SEVERITY_DESCRIPTION,
} from './constant';
import { formatDate, formatSmartContractName } from './helper';

const VULN_PER_PAGE = 16;

const SummaryVulnerabilityRow: React.FC<{
  severity: string;
  detectionTool: string;
  vulnType: string;
  instance: number;
  index: number;
}> = ({ severity, detectionTool, vulnType, instance, index }) => {
  const { severityStyles, summaryResultStyles } = useAuditReport();

  return (
    <View style={summaryResultStyles.tableRow} break={index === VULN_PER_PAGE}>
      <View
        style={{
          width: '25%',
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
          width: '40%',
          ...summaryResultStyles.tableColumn,
        }}
      >
        <Text>{vulnType}</Text>
      </View>
      <View
        style={{
          width: '20%',
          ...summaryResultStyles.tableColumn,
        }}
      >
        <Text>{detectionTool}</Text>
      </View>
      <View
        style={{
          width: '15%',
          ...summaryResultStyles.tableColumn,
        }}
      >
        <Text>{instance}</Text>
      </View>
    </View>
  );
};

const FlexView: React.FC<{
  style?: Style;
  children: React.ReactNode;
}> = ({ style, children }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        ...style,
      }}
    >
      {children}
    </View>
  );
};

const AuditReport: React.FC<{
  smartContractName: string;
  scanningTime: number;
}> = ({ smartContractName, scanningTime }) => {
  const {
    styles,
    frontPageStyles,
    severityStyles,
    summaryResultStyles,
    detailResultStyles,
  } = useAuditReport();

  const { summaryResult, detailResult } = usePrepare();

  return (
    <PDFViewer className='pdf-viewer'>
      <Document
        pageMode='useOutlines'
        pdfVersion='1.7ext3'
        title='Smart contract name'
      >
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
                <Text style={frontPageStyles.contractName}>
                  {formatSmartContractName(smartContractName)}
                </Text>
                <Text style={frontPageStyles.date}>
                  {formatDate(new Date())}
                </Text>
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

          {/* Summary Result */}
          <View style={summaryResultStyles.container} break>
            <View style={summaryResultStyles.section}>
              <Text style={summaryResultStyles.section__number}>2</Text>
              <Text style={summaryResultStyles.section__text}>
                Tổng kết các phát hiện lỗ hổng bảo mật
              </Text>
            </View>
            <View style={summaryResultStyles.body}>
              <View style={{ fontWeight: 'normal', fontSize: 14, gap: 12 }}>
                {/* Smart contract name */}
                <FlexView>
                  <FlexView>
                    <Text>{`Quét trên hợp đồng thông minh: `} </Text>
                    <Text
                      style={{
                        fontWeight: 'medium',
                      }}
                    >
                      {formatSmartContractName(smartContractName)}
                    </Text>
                  </FlexView>
                </FlexView>

                {/* Scanning time */}
                <FlexView>
                  <Text>{`Thời gian quét: `} </Text>
                  <Text
                    style={{
                      fontWeight: 'medium',
                    }}
                  >
                    {`${scanningTime.toFixed(3)}s`}
                  </Text>
                </FlexView>

                {/* Number of vuln */}
                <View
                  style={{
                    gap: 12,
                  }}
                >
                  <Text style={{ width: '100%' }}>
                    {`Số lượng lỗ hổng bảo mật được phát hiện theo mức độ nghiêm trọng:`}
                  </Text>
                  <View>
                    <View
                      style={{
                        margin: 'auto',
                        width: '60%',
                        fontSize: 12,
                      }}
                    >
                      <View
                        style={{
                          ...summaryResultStyles.tableHeader,
                        }}
                      >
                        <View
                          style={{
                            width: '50%',
                            ...summaryResultStyles.tableColumn,
                          }}
                        >
                          <View style={{ margin: 'auto' }}>
                            <Text>Mức độ nghiêm trọng</Text>
                          </View>
                        </View>
                        <View
                          style={{
                            width: '50%',
                            ...summaryResultStyles.tableColumn,
                          }}
                        >
                          <View style={{ margin: 'auto' }}>
                            <Text>Số lượng lỗ hổng</Text>
                          </View>
                        </View>
                      </View>
                      <View style={summaryResultStyles.tableRows}>
                        {Object.keys(SEVERITY_COLOR_MAPPING).map((severity) => {
                          return (
                            <View
                              key={severity}
                              style={{
                                flexDirection: 'row',
                              }}
                            >
                              <View
                                style={{
                                  width: '50%',
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
                                  width: '50%',
                                  ...summaryResultStyles.tableColumn,
                                }}
                              >
                                <Text>
                                  {
                                    summaryResult.filter(
                                      (res) => res.severity === severity,
                                    ).length
                                  }
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                </View>

                {/* Summary table of vuln */}
                <View
                  style={{
                    gap: 12,
                  }}
                  break
                >
                  <Text style={{ width: '100%' }}>
                    {`Bảng tổng kết các lỗ hổng bảo mật:`}
                  </Text>

                  <View style={summaryResultStyles.table}>
                    <View style={summaryResultStyles.tableHeader}>
                      <View
                        style={{
                          width: '25%',
                          ...summaryResultStyles.tableColumn,
                        }}
                      >
                        <View style={{ margin: 'auto' }}>
                          <Text>Mức độ nghiêm trọng</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: '40%',
                          ...summaryResultStyles.tableColumn,
                        }}
                      >
                        <View style={{ margin: 'auto' }}>
                          <Text>Loại lỗ hổng</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: '20%',
                          ...summaryResultStyles.tableColumn,
                        }}
                      >
                        <View style={{ margin: 'auto' }}>
                          <Text>Công cụ phát hiện</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: '15%',
                          ...summaryResultStyles.tableColumn,
                        }}
                      >
                        <View style={{ margin: 'auto' }}>
                          <Text>Số lần xuất hiện</Text>
                        </View>
                      </View>
                    </View>
                    <View style={summaryResultStyles.tableRows}>
                      {summaryResult?.map((vuln, index) => {
                        return (
                          <SummaryVulnerabilityRow
                            key={index}
                            severity={vuln.severity}
                            vulnType={vuln.vulnId}
                            detectionTool={vuln.scanningTool}
                            instance={vuln.instance}
                            index={index % (VULN_PER_PAGE + 1)}
                          />
                        );
                      })}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Detail Result */}
          <View style={detailResultStyles.container} break>
            <View style={detailResultStyles.section}>
              <Text style={detailResultStyles.section__number}>3</Text>
              <Text style={detailResultStyles.section__text}>
                Chi tiết các lỗ hổng bảo mật
              </Text>
            </View>

            <View style={detailResultStyles.body}>
              {detailResult.map((vuln, index) => {
                return (
                  <View style={{ gap: 8 }} key={index}>
                    <FlexView
                      style={{
                        gap: 12,
                        fontSize: 14,
                      }}
                    >
                      <Text
                        style={{ fontWeight: 'medium' }}
                      >{`3.${index + 1}`}</Text>
                      <Text
                        style={{
                          textTransform: 'uppercase',
                          fontWeight: 'medium',
                        }}
                      >
                        {vuln.vulnId}
                      </Text>
                    </FlexView>
                    <View
                      style={{ fontWeight: 'normal', fontSize: 14, gap: 8 }}
                    >
                      {/* Severity */}
                      <FlexView>
                        <FlexView>
                          <Text>{`Mức độ nghiêm trọng: `} </Text>
                          <Text
                            style={{
                              fontWeight: 'medium',
                              color:
                                SEVERITY_COLOR_MAPPING[
                                  vuln.severity as keyof typeof SEVERITY_COLOR_MAPPING
                                ],
                            }}
                          >
                            {vuln.severity}
                          </Text>
                        </FlexView>
                      </FlexView>

                      {/* Scanning tool */}
                      <FlexView>
                        <Text>{`Công cụ phát hiện: `} </Text>
                        <Text
                          style={{
                            fontWeight: 'medium',
                            color:
                              SCANNING_TOOL_COLOR_MAPPING[
                                vuln.scanningTool as keyof typeof SCANNING_TOOL_COLOR_MAPPING
                              ],
                          }}
                        >
                          {vuln.scanningTool}
                        </Text>
                      </FlexView>

                      {/* Description */}
                      <View
                        style={{
                          gap: 8,
                        }}
                      >
                        <Text style={{ width: '100%' }}>{`Mô tả:`} </Text>

                        <Text style={detailResultStyles.description}>
                          {vuln.description}
                        </Text>
                      </View>

                      {/* Description */}
                      <View
                        style={{
                          gap: 12,
                        }}
                      >
                        <Text style={{ width: '100%' }}>
                          {`Vị trí các lỗ hổng trong hợp đồng thông minh:`}
                        </Text>
                        <View style={{ gap: 8 }}>
                          {vuln.matches.map((match, index) => {
                            return (
                              <View
                                style={{ fontSize: 14, gap: 4 }}
                                key={index}
                              >
                                <FlexView
                                  style={{
                                    alignItems: 'center',
                                    gap: 4,
                                  }}
                                >
                                  <Text style={detailResultStyles.vulnLocation}>
                                    x
                                  </Text>
                                  <Text>
                                    {`Lỗi được tìm thấy ${match.line ? `ở dòng ${match.line}` : `từ dòng ${match.from} đến dòng ${match.to}`}`}
                                  </Text>
                                </FlexView>
                                <View
                                  style={{
                                    marginLeft: 24,
                                    gap: 4,
                                  }}
                                >
                                  {match.type ? (
                                    <Text
                                      style={{
                                        fontSize: 14,
                                      }}
                                    >
                                      {`Trong ${match.type}`}
                                    </Text>
                                  ) : null}
                                  <Text style={detailResultStyles.vulnMatched}>
                                    {match.matched.trim()}
                                  </Text>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer} fixed>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber }) =>
                `Trang ${pageNumber.toString().padStart(2, '0')}`
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
