import { theme } from '../theme';

export const getAvailableColor = (available: boolean | string): string => {
  if (available === true || available === '가능') return theme.colors.success;
  if (available === false || available === '불가') return theme.colors.danger;
  return theme.colors.warning;
};
