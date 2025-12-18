import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * 日付を「YYYY/MM/DD/曜日」形式でフォーマット
 */
export function formatDateWithDay(date: Date): string {
  return format(date, 'yyyy/MM/dd/E', { locale: ja });
}