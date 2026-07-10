import { describe, expect, it } from 'vitest';
import { formatTimestamp, getDateLabel, formatFileSize, getInitials, getAvatarColor } from './chatopsHelpers';

describe('chatopsHelpers', () => {
  it('formats timestamps as Hoje for current date', () => {
    const now = Date.now();
    expect(formatTimestamp(now)).toContain('Hoje');
    expect(getDateLabel(now)).toBe('Hoje');
  });

  it('formats timestamps as Ontem for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const ts = yesterday.getTime();

    expect(formatTimestamp(ts)).toContain('Ontem');
    expect(getDateLabel(ts)).toBe('Ontem');
  });

  it('formats older timestamps with a localized date', () => {
    const older = new Date('2024-01-15T12:34:00Z').getTime();
    const formatted = formatTimestamp(older);
    expect(formatted).toContain('15');
    expect(formatted).toContain('12:34');
    expect(getDateLabel(older)).toContain('15');
  });

  it('formats file sizes correctly', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(2048)).toBe('2.0 KB');
    expect(formatFileSize(2_500_000)).toBe('2.4 MB');
  });

  it('returns initials from a name string', () => {
    expect(getInitials('João Silva')).toBe('JS');
    expect(getInitials('goncalo')).toBe('G');
    expect(getInitials('')).toBe('');
  });

  it('returns a stable avatar color', () => {
    expect(getAvatarColor('goncalo')).toBe(getAvatarColor('goncalo'));
  });
});
