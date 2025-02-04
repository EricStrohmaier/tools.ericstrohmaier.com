export function formatDate(date: string, format: string = 'YYYY-MM-DD'): string {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  switch (format) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'DD.MM.YYYY':
      return `${day}.${month}.${year}`;
    case 'YYYY-MM-DD':
    default:
      return `${year}-${month}-${day}`;
  }
}
