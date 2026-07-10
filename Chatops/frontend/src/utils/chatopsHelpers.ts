export const formatTimestamp = (ts: number) => {
  const date = new Date(ts);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const time = date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  if (date.toDateString() === now.toDateString()) return `Hoje ${time}`;
  if (date.toDateString() === yesterday.toDateString()) return `Ontem ${time}`;
  return `${date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })} ${time}`;
};

export const getDateLabel = (ts: number) => {
  const date = new Date(ts);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === now.toDateString()) return 'Hoje';
  if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
};

export const formatFileSize = (bytes?: number) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getInitials = (userId: string) =>
  userId.split(/[^A-Za-zÀ-ÿ]+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('') ||
  userId.slice(0, 2).toUpperCase();

const AVATAR_COLORS = [
  'hsl(0,80%,42%)', 'hsl(355,75%,38%)', 'hsl(348,65%,45%)',
  'hsl(5,70%,40%)',  'hsl(0,60%,35%)',   'hsl(10,72%,44%)',
];
export const getAvatarColor = (uid: string) => AVATAR_COLORS[uid.charCodeAt(0) % AVATAR_COLORS.length];
