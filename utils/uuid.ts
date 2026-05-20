// Canonical UUID handling for ids that originate from the backend.
//
// The database stores list / task ids as BINARY(16) values. Depending
// on how the backend serializes them, an id can reach the client as:
//   - a canonical UUID:        "2435f502-5aae-4d90-8303-326c44b780ce"
//   - a bare 32-char hex blob: "2435F5025AAE4D908303326C44B780CE"
//   - a 0x-prefixed hex blob:  "0x2435F5025AAE4D908303326C44B780CE"
//
// The REST endpoints (e.g. GET /tasks/{listId}) expect the canonical,
// hyphenated, lowercase UUID — the exact value MySQL's BIN_TO_UUID()
// produces. normalizeUuid() converts any of the forms above into it so
// the URL is always built correctly.

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Convert any supported id representation into the canonical
 * hyphenated, lowercase UUID. If the value is not a recognisable
 * 32-hex-character id it is returned untouched, so an unexpected id
 * is never silently corrupted.
 */
export const normalizeUuid = (value: string): string => {
  if (!value) return value;

  // Drop an optional 0x prefix and any existing hyphens, then lowercase.
  const hex = value.replace(/^0x/i, '').replace(/-/g, '').toLowerCase();

  // A valid UUID is exactly 32 hex characters once hyphens are removed.
  if (/^[0-9a-f]{32}$/.test(hex)) {
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20),
    ].join('-');
  }

  return value;
};

/** True when the value is already a canonical hyphenated UUID. */
export const isUuid = (value: string): boolean => UUID_REGEX.test(value);
