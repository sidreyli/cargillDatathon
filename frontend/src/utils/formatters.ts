export function formatCurrency(value: number, decimals = 0): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `$${(value / 1_000).toFixed(decimals > 0 ? decimals : 0)}K`;
  }
  return `$${value.toFixed(decimals)}`;
}

export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals = 1): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(decimals)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(decimals)}K`;
  }
  return value.toFixed(decimals);
}

export function formatDays(days: number): string {
  return `${days.toFixed(1)}d`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatMT(value: number): string {
  return `${(value / 1000).toFixed(0)}K MT`;
}

export function profitColor(value: number): string {
  if (value > 0) return 'text-teal-500';
  if (value < 0) return 'text-coral-500';
  return 'text-text-secondary';
}

export function tceColor(tce: number): string {
  if (tce >= 15000) return '#0FA67F';
  if (tce >= 10000) return '#1B6CA8';
  if (tce >= 5000) return '#F5A623';
  return '#E74C5E';
}

export function congestionColor(level: string): string {
  if (level === 'low') return '#0FA67F';
  if (level === 'medium') return '#F5A623';
  return '#E74C5E';
}
