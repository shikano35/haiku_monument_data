/**
 * ISO 8601形式の日時文字列に変換
 * W3C Recommendation: https://www.w3.org/TR/NOTE-datetime
 * 
 * @param dateString - 入力日時文字列（例: "2025-05-11 16:02:33" or "2025-05-11T16:02:33.000Z"）
 * @returns ISO 8601形式（T区切り+タイムゾーン）の日時文字列
 */
export function formatToISO8601(dateString: string | null | undefined): string | null {
  if (!dateString) return null;

  try {
    // 既にISO 8601形式（Tを含む）の場合
    if (dateString.includes('T')) {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return null;
      return date.toISOString();
    }

    // スペース区切り（MySQL datetime形式）の場合
    // "2025-05-11 16:02:33" -> "2025-05-11T16:02:33.000Z"
    const spaceSeparated = dateString.replace(' ', 'T');
    const date = new Date(spaceSeparated);
    
    if (Number.isNaN(date.getTime())) return null;
    
    return date.toISOString();
  } catch {
    return null;
  }
}

/**
 * xsd:date形式の日付文字列に変換
 * 
 * @param dateString - 入力日付文字列（例: "2025-05-11" or "2025-05-11T00:00:00.000Z"）
 * @returns YYYY-MM-DD形式の日付文字列
 */
export function formatToXSDDate(dateString: string | null | undefined): string | null {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;
    
    // UTC日付でYYYY-MM-DD形式に変換
    return date.toISOString().split('T')[0];
  } catch {
    return null;
  }
}
