import i18n from '@/i18n';
import { mythril_color, slither_color, so1scan_color } from '@/utils/constant';

export const SEVERITY_COLOR_MAPPING = {
  High: '#cc3300',
  Medium: '#ffcc00',
  Low: '#339900',
  Informational: '#339900',
  Optimization: '#339900',
};

export const SCANNING_TOOL_COLOR_MAPPING = {
  So1Scan: so1scan_color,
  Slither: slither_color,
  Mythril: mythril_color,
};

export const SEVERITY_DESCRIPTION = [
  {
    type: 'High',
    description: i18n.t('content.audit-report.severity.high'),
    color: SEVERITY_COLOR_MAPPING.High,
  },
  {
    type: 'Medium',
    description: i18n.t('content.audit-report.severity.medium'),
    color: SEVERITY_COLOR_MAPPING.Medium,
  },
  {
    type: 'Low',
    description: i18n.t('content.audit-report.severity.low'),
    color: SEVERITY_COLOR_MAPPING.Low,
  },
  {
    type: 'Informational',
    description: i18n.t('content.audit-report.severity.informational'),
    color: SEVERITY_COLOR_MAPPING.Informational,
  },
  {
    type: 'Optimization',
    description: i18n.t('content.audit-report.severity.optimization'),
    color: SEVERITY_COLOR_MAPPING.Optimization,
  },
];

export const FRONT_PAGE = {
  logoText: 'SO1SCAN',
  header: 'Bảo vệ hợp đồng thông minh của bạn',
  body: 'Báo cáo các phát hiện lỗ hổng',
  owner: 'Báo cáo này được thực hiện bởi So1Scan',
  footer: 'So1Scan • Báo cáo các phát hiện lỗ hổng',
};

export const SEVERITY_SECTION = {
  section: 'Phân loại mức độ nghiêm trọng',
  description:
    'Mỗi lỗ hổng tìm được sẽ có một mức độ nghiêm trọng (severity) khác nhau. Báo cáo này sẽ dựa vào các loại mức độ nghiêm trọng sau (được sắp xếp từ mức độ nghiêm trọng cao nhất cho đến mức độ nghiêm trọng thấp nhất):',
};

export const VULN_TYPE = {
  section: 'Phân loại lỗ hổng',
  description:
    'Các lỗ hổng trong hợp đồng thông minh của Ethereum thường được phân loại dựa trên ba nguyên nhân chính:',
};

export const VULN_TYPE_DESCRIPTION = [
  {
    type: 'Language',
    description: i18n.t('content.audit-report.vuln-type.language'),
  },
  {
    type: 'EVM',
    description: i18n.t('content.audit-report.vuln-type.evm'),
  },
  {
    type: 'Blockchain',
    description: i18n.t('content.audit-report.vuln-type.blockchain'),
  },
];

export const VULN_TYPE_MAPPING = {
  High: 'Bảo mật',
  Medium: 'Bảo mật',
  Low: 'Bảo mật',
  Informational: 'Cảnh báo',
  Optimization: 'Cảnh báo',
};

export const SUMMARY_SECTION = {
  title: 'Tổng kết các phát hiện lỗ hổng',
  fileName: 'Quét trên hợp đồng thông minh: ',
  scanningTime: 'Thời gian quét: ',
  vulns_severity: 'Số lượng lỗ hổng được phát hiện theo mức độ nghiêm trọng:',
  vulns_tool: 'Số lượng lỗ hổng được phát hiện theo công cụ phát hiện:',
  severity: 'Mức độ nghiêm trọng',
  numberOfVulns: 'Số lượng lỗ hổng',
  table: 'Bảng tổng kết các lỗ hổng:',
  vulnType: 'Loại lỗ hổng',
  scanningTool: 'Công cụ phát hiện',
  instance: 'Số lần xuất hiện',
  linesOfCode: 'Số dòng lệnh trong mã nguồn',
  totalOfVuln: 'Tổng số phát hiện lỗ hổng',
};

export const DETAIL_SECTION = {
  title: 'Chi tiết các lỗ hổng',
  vulnType: 'Loại lỗ hổng',
  scanningTime: 'Thời gian quét: ',
  severity: 'Mức độ nghiêm trọng',
  scanningTool: 'Công cụ phát hiện',
  description: 'Mô tả',
  location: 'Vị trí các lỗ hổng trong hợp đồng thông minh',
};
