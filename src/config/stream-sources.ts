export type StreamTag = 'LOG' | 'SHIP' | 'ESSAY' | 'PROD';

export const TAG_COLORS: Record<StreamTag, string> = {
  LOG: 'var(--status-agent)',
  SHIP: 'var(--signal)',
  ESSAY: '#d8b3f5',
  PROD: 'var(--status-cold)'
};

export const SHIFT_GAP_HOURS = 4;
export const TAPE_HOME_LIMIT = 12;
