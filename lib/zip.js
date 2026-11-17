// Tiny dependency-free ZIP writer (store method, no compression) with CRC-32. Runs in the browser or Node.
// makeZip([{ name: 'my-skill/SKILL.md', data: 'text or Uint8Array' }]) -> Uint8Array
let TABLE;
function table() {
  if (TABLE) return TABLE;
  TABLE = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; TABLE[n] = c >>> 0; }
  return TABLE;
}
export function crc32(bytes) {
  const t = table(); let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = t[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
const enc = (s) => new TextEncoder().encode(s);
const toBytes = (d) => (typeof d === 'string' ? enc(d) : d instanceof Uint8Array ? d : new Uint8Array(d));
function dosDateTime(d) {
  const y = Math.max(1980, d.getFullYear());
  return { time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), date: ((y - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate() };
}
export function makeZip(files, when = new Date()) {
  const { time, date } = dosDateTime(when);
  const entries = files.map((f) => { const name = enc(String(f.name).replace(/^\/+/, '')); const data = toBytes(f.data); return { name, data, crc: crc32(data) }; });
  let size = 22;
  for (const e of entries) size += 30 + e.name.length + e.data.length + 46 + e.name.length;
  const out = new Uint8Array(size); const dv = new DataView(out.buffer);
  let p = 0; const offsets = [];
  const u16 = (v) => { dv.setUint16(p, v, true); p += 2; };
  const u32 = (v) => { dv.setUint32(p, v >>> 0, true); p += 4; };
  for (const e of entries) {
    offsets.push(p);
    u32(0x04034b50); u16(20); u16(0x0800); u16(0); u16(time); u16(date); u32(e.crc); u32(e.data.length); u32(e.data.length); u16(e.name.length); u16(0);
    out.set(e.name, p); p += e.name.length; out.set(e.data, p); p += e.data.length;
  }
  const cdStart = p;
  entries.forEach((e, i) => {
    u32(0x02014b50); u16(20); u16(20); u16(0x0800); u16(0); u16(time); u16(date); u32(e.crc); u32(e.data.length); u32(e.data.length);
    u16(e.name.length); u16(0); u16(0); u16(0); u16(0); u32(0); u32(offsets[i]);
    out.set(e.name, p); p += e.name.length;
  });
  const cdSize = p - cdStart;
  u32(0x06054b50); u16(0); u16(0); u16(entries.length); u16(entries.length); u32(cdSize); u32(cdStart); u16(0);
  return out;
}
// Browser only: triggers a file download for the given bytes/text.
export function downloadBlob(filename, data, type = 'application/octet-stream') {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
