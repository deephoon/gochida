import { theme } from '../theme';

/** 작업 가능/확인 필요 상태의 전경색. 확인 필요는 경고 톤(amber)으로 낮춰 표현한다. */
export const getAvailabilityColor = (available: boolean): string =>
  available ? theme.colors.success : '#C77F12';

/** 작업 가능/확인 필요 배지의 배경색. */
export const getAvailabilityBg = (available: boolean): string =>
  available ? theme.colors.successLight : theme.colors.warningLight;
