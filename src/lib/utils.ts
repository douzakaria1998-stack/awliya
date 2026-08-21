// =============================================
// General Utility Functions
// =============================================

import { format, formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function formatDateAr(dateStr: string): string {
    return format(new Date(dateStr), 'dd MMMM yyyy', { locale: ar });
}

export function formatRelativeAr(dateStr: string): string {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ar });
}

export function formatCurrency(amount: number, currency: string = 'د.ج'): string {
    return `${amount.toLocaleString('ar-DZ')} ${currency}`;
}

export function getPercentageColor(percentage: number): string {
    if (percentage >= 80) return 'var(--color-success)';
    if (percentage >= 60) return 'var(--color-warning)';
    return 'var(--color-error)';
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 11);
}
