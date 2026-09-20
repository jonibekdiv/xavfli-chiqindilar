/**
 * Format utilities
 */
export const formatSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

export const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;

  if (diff < 60) return 'hozir';
  if (diff < 3600) return Math.floor(diff / 60) + ' daq oldin';
  if (diff < 86400) return Math.floor(diff / 3600) + ' soat oldin';
  if (diff < 604800) return Math.floor(diff / 86400) + ' kun oldin';

  return new Date(iso).toLocaleDateString('uz-UZ');
};

export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('uz-UZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};