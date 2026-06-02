const orderDateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short'
});

export function formatOrderDate(value: string): string {
  return orderDateFormatter.format(new Date(value));
}
