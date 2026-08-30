/**
 * 緊急度ティア。値そのものがミノのマス数。
 * ゲームバランスの数値を1箇所に閉じ込めるための定義であり、
 * 調整するときはこのファイルだけを触ればよい。
 */
export enum UrgencyTier {
  Relaxed = 4,
  Normal = 5,
  Near = 6,
  Tight = 7,
  Critical = 8,
}

export const TIER_COLOR: Readonly<Record<UrgencyTier, string>> = {
  [UrgencyTier.Relaxed]: '#4fd0e0',
  [UrgencyTier.Normal]: '#5ec24f',
  [UrgencyTier.Near]: '#e2d13f',
  [UrgencyTier.Tight]: '#e08b30',
  [UrgencyTier.Critical]: '#d94040',
};

export const TIER_LABEL: Readonly<Record<UrgencyTier, string>> = {
  [UrgencyTier.Relaxed]: '余裕',
  [UrgencyTier.Normal]: '通常',
  [UrgencyTier.Near]: '接近',
  [UrgencyTier.Tight]: '切迫',
  [UrgencyTier.Critical]: '限界',
};

/** 残日数 -> ティア。境界は 14 / 7 / 3 / 1 日。 */
export function tierForDaysLeft(days: number): UrgencyTier {
  if (days >= 14) return UrgencyTier.Relaxed;
  if (days >= 7) return UrgencyTier.Normal;
  if (days >= 3) return UrgencyTier.Near;
  if (days >= 1) return UrgencyTier.Tight;
  return UrgencyTier.Critical;
}

/** ローカル日付を YYYY-MM-DD に。UTC 変換で日付がずれるのを避けるため自前で組む。 */
export function toDateKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** 日単位の差。時刻を切り捨ててから比較するので「今日」は必ず 0。 */
export function daysBetween(fromKey: string, now: Date): number {
  if (!fromKey) return Number.POSITIVE_INFINITY;
  const [y, m, d] = fromKey.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((due.getTime() - today.getTime()) / 86400000);
}
