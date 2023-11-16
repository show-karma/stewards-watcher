export function serializeWithBigint(this: unknown, value: unknown) {
  return JSON.stringify(
    value,
    (this, (key, val) => (typeof val === 'bigint' ? val.toString() : val))
  );
}
