import { createCanvas } from "@napi-rs/canvas"

const FAVICON_DIR = new URL("../packages/ui/src/assets/favicon/", import.meta.url).pathname

// CM mark pixel grid (6px per cell in SVG space, viewBox 0 0 60 30)
// C path: M24 6H6V24H24V30H0V0H24V6Z
// M path: M30 0H36V6H42V12H36V30H30V0Z M60 0H54V6H48V12H54V30H60V0Z M42 12H48V18H42V12Z

function drawMark(ctx: ReturnType<ReturnType<typeof createCanvas>["getContext"]>, size: number) {
  const bg = "#131010"
  const grey = "#716c6b"
  const red = "#FF3300"

  // Fill background
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, size, size)

  // The mark viewBox is 60x30 (2:1 ratio)
  // Scale to fit within 80% of the square, centred
  const markW = 60
  const markH = 30
  const maxDim = size * 0.8
  const scale = Math.min(maxDim / markW, maxDim / markH)
  const offsetX = (size - markW * scale) / 2
  const offsetY = (size - markH * scale) / 2

  ctx.save()
  ctx.translate(offsetX, offsetY)
  ctx.scale(scale, scale)

  // Draw C (grey)
  ctx.fillStyle = grey
  ctx.beginPath()
  ctx.moveTo(24, 6)
  ctx.lineTo(6, 6)
  ctx.lineTo(6, 24)
  ctx.lineTo(24, 24)
  ctx.lineTo(24, 30)
  ctx.lineTo(0, 30)
  ctx.lineTo(0, 0)
  ctx.lineTo(24, 0)
  ctx.closePath()
  ctx.fill()

  // Draw M (red) - left stroke
  ctx.fillStyle = red
  ctx.beginPath()
  ctx.moveTo(30, 0)
  ctx.lineTo(36, 0)
  ctx.lineTo(36, 6)
  ctx.lineTo(42, 6)
  ctx.lineTo(42, 12)
  ctx.lineTo(36, 12)
  ctx.lineTo(36, 30)
  ctx.lineTo(30, 30)
  ctx.closePath()
  ctx.fill()

  // Draw M (red) - right stroke
  ctx.beginPath()
  ctx.moveTo(60, 0)
  ctx.lineTo(54, 0)
  ctx.lineTo(54, 6)
  ctx.lineTo(48, 6)
  ctx.lineTo(48, 12)
  ctx.lineTo(54, 12)
  ctx.lineTo(54, 30)
  ctx.lineTo(60, 30)
  ctx.closePath()
  ctx.fill()

  // Draw M (red) - V-point
  ctx.beginPath()
  ctx.moveTo(42, 12)
  ctx.lineTo(48, 12)
  ctx.lineTo(48, 18)
  ctx.lineTo(42, 18)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}

const sizes = [
  { name: "favicon-96x96-v3.png", size: 96 },
  { name: "favicon-96x96.png", size: 96 },
  { name: "apple-touch-icon-v3.png", size: 180 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "web-app-manifest-192x192.png", size: 192 },
  { name: "web-app-manifest-512x512.png", size: 512 },
]

for (const entry of sizes) {
  const canvas = createCanvas(entry.size, entry.size)
  const ctx = canvas.getContext("2d")
  drawMark(ctx, entry.size)
  const buffer = canvas.toBuffer("image/png")
  await Bun.write(`${FAVICON_DIR}${entry.name}`, buffer)
  console.log(`Generated ${entry.name} (${entry.size}x${entry.size})`)
}

// Generate ICO (16x16 + 32x32 + 48x48 PNG frames wrapped in ICO container)
const icoSizes = [16, 32, 48]
const frames: Buffer[] = []

for (const s of icoSizes) {
  const canvas = createCanvas(s, s)
  const ctx = canvas.getContext("2d")
  drawMark(ctx, s)
  frames.push(Buffer.from(canvas.toBuffer("image/png")))
}

// ICO file format: header + directory entries + PNG data
const headerSize = 6
const dirEntrySize = 16
const dirSize = dirEntrySize * frames.length
let dataOffset = headerSize + dirSize

const ico = Buffer.alloc(headerSize + dirSize + frames.reduce((sum, f) => sum + f.length, 0))

// ICO header
ico.writeUInt16LE(0, 0) // reserved
ico.writeUInt16LE(1, 2) // type: ICO
ico.writeUInt16LE(frames.length, 4) // count

for (let i = 0; i < frames.length; i++) {
  const s = icoSizes[i]!
  const f = frames[i]!
  const off = headerSize + i * dirEntrySize
  ico.writeUInt8(s < 256 ? s : 0, off) // width
  ico.writeUInt8(s < 256 ? s : 0, off + 1) // height
  ico.writeUInt8(0, off + 2) // palette
  ico.writeUInt8(0, off + 3) // reserved
  ico.writeUInt16LE(1, off + 4) // planes
  ico.writeUInt16LE(32, off + 6) // bpp
  ico.writeUInt32LE(f.length, off + 8) // size
  ico.writeUInt32LE(dataOffset, off + 12) // offset
  f.copy(ico, dataOffset)
  dataOffset += f.length
}

await Bun.write(`${FAVICON_DIR}favicon-v3.ico`, ico)
await Bun.write(`${FAVICON_DIR}favicon.ico`, ico)
console.log("Generated favicon-v3.ico and favicon.ico")
