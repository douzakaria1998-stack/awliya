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

export function generateAutoPassword(prefix: string = 'Awliya'): string {
    const symbols = ['@', '#', '$', '!', '&', '*'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    return `${prefix}${symbol}${randomNum}`;
}

export function formatStudentCount(count: number, language: string = 'ar'): string {
    if (language === 'ar') {
        if (count === 0) return '0 طالب';
        if (count === 1) return 'طالب واحد';
        if (count === 2) return 'طالبان';
        if (count >= 3 && count <= 10) return `${count} طلاب`;
        return `${count} طالباً`;
    }
    if (language === 'fr') {
        return count <= 1 ? `${count} élève` : `${count} élèves`;
    }
    return count === 1 ? '1 student' : `${count} students`;
}

export function formatChildrenCount(count: number, language: string = 'ar'): string {
    if (language === 'ar') {
        if (count === 0) return '0 أبناء';
        if (count === 1) return 'ابن واحد';
        if (count === 2) return 'ابنان';
        if (count >= 3 && count <= 10) return `${count} أبناء`;
        return `${count} ابناً`;
    }
    if (language === 'fr') {
        return count <= 1 ? `${count} enfant` : `${count} enfants`;
    }
    return count === 1 ? '1 child' : `${count} children`;
}

