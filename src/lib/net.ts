/**
 * Small network-safety helpers shared by server routes that fetch URLs they were given
 * (the site scanner, the live roadmap link checker). No Node-only imports, so any route can use it.
 */

const IPV4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

/**
 * True for an IP address that isn't a normal public internet address: loopback, private, link-local (cloud metadata),
 * carrier-grade NAT, documentation/benchmark, multicast and reserved ranges, plus IPv6 equivalents and IPv6 forms that
 * embed an IPv4 address. Anything that doesn't parse as an IP counts as private (refuse when unsure).
 */
export function isPrivateIp(address: string): boolean {
  const ip = address.toLowerCase().replace(/^\[|\]$/g, '').replace(/%.*$/, '');
  const v4 = IPV4.exec(ip);
  if (v4) {
    const [a, b, c] = v4.slice(1, 4).map(Number);
    if ([a, b, c, Number(v4[4])].some((n) => n > 255)) return true;
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0 && (c === 0 || c === 2)) ||
      (a === 198 && (b === 18 || b === 19)) ||
      (a === 198 && b === 51 && c === 100) ||
      (a === 203 && b === 0 && c === 113)
    );
  }
  if (!ip.includes(':')) return true;
  // IPv4-mapped, IPv4-compatible and NAT64 addresses carry an IPv4 address in the last 32 bits
  const dotted = /^(?:::ffff:(?:0:)?|64:ff9b::|::)(\d+\.\d+\.\d+\.\d+)$/.exec(ip);
  if (dotted) return isPrivateIp(dotted[1]);
  const hex = /^(?:::ffff:(?:0:)?|64:ff9b::)([0-9a-f]{1,4}):([0-9a-f]{1,4})$/.exec(ip);
  if (hex) {
    const hi = parseInt(hex[1], 16);
    const lo = parseInt(hex[2], 16);
    return isPrivateIp(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`);
  }
  return (
    ip === '::' ||
    ip === '::1' ||
    /^f[c-d]/.test(ip) || // unique local fc00::/7
    /^fe[89a-f]/.test(ip) || // link-local fe80::/10 and old site-local fec0::/10
    /^ff/.test(ip) || // multicast
    /^2001:0{0,4}:/.test(ip) || // Teredo (embeds an IPv4 address)
    /^2001:db8:/.test(ip) || // documentation
    /^2002:/.test(ip) // 6to4 (embeds an IPv4 address)
  );
}

/**
 * Refuses obvious internal targets so a server-side fetch can't be pointed at private networks.
 * Hostname-based: WHATWG URL parsing already turns tricks like https://2130706433/ into 127.0.0.1.
 * A public-looking name can still resolve to a private address (e.g. 127.0.0.1.nip.io); callers that fetch should
 * also check the resolved addresses with isPrivateIp (src/lib/links.ts does).
 */
export function isPrivateHost(hostname: string) {
  const h = hostname.toLowerCase().replace(/\.$/, '');
  return (
    h === '' ||
    h === 'localhost' ||
    h.endsWith('.localhost') ||
    h.endsWith('.local') ||
    h.endsWith('.internal') ||
    h.endsWith('.home.arpa') ||
    h === '0.0.0.0' ||
    h.startsWith('[') ||
    !h.includes('.') ||
    (IPV4.test(h) && isPrivateIp(h)) ||
    /^0\./.test(h) ||
    /^127\./.test(h) ||
    /^10\./.test(h) ||
    /^192\.168\./.test(h) ||
    /^169\.254\./.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h) ||
    /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(h)
  );
}

/**
 * Parses a user- or model-supplied URL and returns it only if it is https on the default port, has no credentials and
 * isn't a private host. Use the returned URL's href (normalized) rather than the raw string.
 */
export function safeHttpsUrl(raw: string): URL | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:' || url.port !== '' || url.username || url.password || isPrivateHost(url.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}
