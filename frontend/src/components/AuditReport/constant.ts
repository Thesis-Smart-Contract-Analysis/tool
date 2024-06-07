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
  body: 'Báo cáo các lỗ hổng bảo mật',
  owner: 'Báo cáo này được thực hiện bởi So1Scan',
  footer: 'So1Scan • Báo cáo các lỗ hổng bảo mật',
};

export const SEVERITY_SECTION = {
  section: 'Phân loại mức độ nghiêm trọng',
  description:
    'Mỗi lỗ hổng tìm được sẽ có một mức độ nghiêm trọng (severity) khác nhau. Báo cáo này sẽ dựa vào các loại mức độ nghiêm trọng sau (được sắp xếp từ mức độ nghiêm trọng cao nhất cho đến mức độ nghiêm trọng thấp nhất):',
};

export const SUMMARY_SECTION = {
  title: 'Tổng kết các phát hiện lỗ hổng bảo mật',
  fileName: 'Quét trên hợp đồng thông minh: ',
  scanningTime: 'Thời gian quét: ',
  vulns: 'Số lượng lỗ hổng bảo mật được phát hiện theo mức độ nghiêm trọng:',
  severity: 'Mức độ nghiêm trọng',
  numberOfVulns: 'Số lượng lỗ hổng',
  table: 'Bảng tổng kết các lỗ hổng bảo mật:',
  vulnType: 'Loại lỗ hổng',
  scanningTool: 'Công cụ phát hiện',
  instance: 'Số lần xuất hiện',
  linesOfCode: 'Số dòng lệnh trong mã nguồn',
};

export const DETAIL_SECTION = {
  title: 'Chi tiết các lỗ hổng bảo mật',
  scanningTime: 'Thời gian quét: ',
  severity: 'Mức độ nghiêm trọng',
  scanningTool: 'Công cụ phát hiện',
  description: 'Mô tả',
  location: 'Vị trí các lỗ hổng trong hợp đồng thông minh',
};
