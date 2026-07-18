import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatDate = (date: Date | string, formatStr: string = 'dd MMM yyyy') => {
  return format(new Date(date), formatStr, { locale: id });
};

export const formatDateTime = (date: Date | string) => {
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: id });
};

export const formatRelativeTime = (date: Date | string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num);
};
