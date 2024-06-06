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
