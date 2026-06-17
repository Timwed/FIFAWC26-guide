export function formatBeijingTime(dateEvent: string, strTime: string): string {
  const utc = new Date(`${dateEvent}T${strTime}Z`);
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(utc);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('month')}月${get('day')}日 ${get('weekday')} ${get('hour')}:${get('minute')}`;
}

export function formatBeijingDate(dateEvent: string, strTime: string): { iso: string; label: string } {
  const utc = new Date(`${dateEvent}T${strTime}Z`);
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour12: false,
  }).formatToParts(utc);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const y = get('year');
  const m = get('month').padStart(2, '0');
  const d = get('day').padStart(2, '0');
  return { iso: `${y}-${m}-${d}`, label: `${get('month')}月${get('day')}日 ${get('weekday')}` };
}
