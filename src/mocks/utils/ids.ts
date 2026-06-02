let sequence = 1000;

export function nextId(prefix: string): string {
  sequence += 1;
  return `${prefix}-${sequence}`;
}

export function createOrderNumber(): string {
  sequence += 1;
  return `ORD-${sequence}`;
}

export function resetIdSequence(): void {
  sequence = 1000;
}
