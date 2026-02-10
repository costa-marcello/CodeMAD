import { createCanvas } from "@napi-rs/canvas"
import { mkdirSync } from "fs"

const ICONS_DIR = new URL("../packages/desktop/src-tauri/icons/dev/", import.meta.url).pathname

function drawMark(ctx: ReturnType<ReturnType<typeof createCanvas>["getContext"]>, size: number) {
  const bg = "#131010"
  const grey = "#716c6b"
  const red = "#FF3300"

  // Rounded rectangle background (macOS icon style)
  const r = size * 0.18
  ctx.fillStyle = bg
  ctx.beginPath()
  ctx.roundRect(0, 0, size, size, r)
  ctx.fill()

  // The mark viewBox is 60x30 (2:1 ratio)
  const markW = 60
  const markH = 30
  const maxDim = size * 0.65
  const scale = Math.min(maxDim / markW, maxDim / markH)
  const offsetX = (size - markW * scale) / 2
  const offsetY = (size - markH * scale) / 2

  ctx.save()
  ctx.translate(offsetX, offsetY)
  ctx.scale(scale, scale)

  // C (grey)
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

  // M left stroke (red)
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

  // M right stroke (red)
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

  // M V-point (red)
  ctx.beginPath()
  ctx.moveTo(42, 12)
  ctx.lineTo(48, 12)
  ctx.lineTo(48, 18)
  ctx.lineTo(42, 18)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}

function generate(name: string, size: number) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext("2d")
  drawMark(ctx, size)
  const buffer = canvas.toBuffer("image/png")
  Bun.write(`${ICONS_DIR}${name}`, buffer)
  console.log(`  ${name} (${size}x${size})`)
}

console.log("Generating desktop icons...")

// Standard Tauri icon sizes
generate("32x32.png", 32)
generate("64x64.png", 64)
generate("128x128.png", 128)
generate("128x128@2x.png", 256)
generate("icon.png", 512)

// Windows Store logos
generate("Square30x30Logo.png", 30)
generate("Square44x44Logo.png", 44)
generate("Square71x71Logo.png", 71)
generate("Square89x89Logo.png", 89)
generate("Square107x107Logo.png", 107)
generate("Square142x142Logo.png", 142)
generate("Square150x150Logo.png", 150)
generate("Square284x284Logo.png", 284)
generate("Square310x310Logo.png", 310)
generate("StoreLogo.png", 50)

// Android icons
const androidDir = `${ICONS_DIR}android/`
const androidSizes = [
  { name: "mipmap-mdpi/ic_launcher.png", size: 48 },
  { name: "mipmap-mdpi/ic_launcher_round.png", size: 48 },
  { name: "mipmap-hdpi/ic_launcher.png", size: 72 },
  { name: "mipmap-hdpi/ic_launcher_round.png", size: 72 },
  { name: "mipmap-xhdpi/ic_launcher.png", size: 96 },
  { name: "mipmap-xhdpi/ic_launcher_round.png", size: 96 },
  { name: "mipmap-xxhdpi/ic_launcher.png", size: 144 },
  { name: "mipmap-xxhdpi/ic_launcher_round.png", size: 144 },
  { name: "mipmap-xxxhdpi/ic_launcher.png", size: 192 },
  { name: "mipmap-xxxhdpi/ic_launcher_round.png", size: 192 },
]

for (const entry of androidSizes) {
  const dir = `${androidDir}${entry.name.split("/")[0]}`
  mkdirSync(dir, { recursive: true })
  const canvas = createCanvas(entry.size, entry.size)
  const ctx = canvas.getContext("2d")
  drawMark(ctx, entry.size)
  const buffer = canvas.toBuffer("image/png")
  await Bun.write(`${androidDir}${entry.name}`, buffer)
}
console.log("  android icons (5 densities)")

// iOS icons
const iosDir = `${ICONS_DIR}ios/`
mkdirSync(iosDir, { recursive: true })
const iosSizes = [20, 29, 40, 60, 76, 83.5, 1024]
const iosScales = [1, 2, 3]
for (const base of iosSizes) {
  for (const scale of iosScales) {
    const px = Math.round(base * scale)
    if (px > 1024) continue
    const name = `AppIcon-${base}x${base}@${scale}x.png`
    const canvas = createCanvas(px, px)
    const ctx = canvas.getContext("2d")
    drawMark(ctx, px)
    const buffer = canvas.toBuffer("image/png")
    await Bun.write(`${iosDir}${name}`, buffer)
  }
}
console.log("  iOS icons")

// ICO (16, 32, 48, 256)
const icoSizes = [16, 32, 48, 256]
const frames: Buffer[] = []
for (const s of icoSizes) {
  const canvas = createCanvas(s, s)
  const ctx = canvas.getContext("2d")
  drawMark(ctx, s)
  frames.push(Buffer.from(canvas.toBuffer("image/png")))
}

const headerSize = 6
const dirEntrySize = 16
const dirSize = dirEntrySize * frames.length
let dataOffset = headerSize + dirSize
const ico = Buffer.alloc(headerSize + dirSize + frames.reduce((sum, f) => sum + f.length, 0))
ico.writeUInt16LE(0, 0)
ico.writeUInt16LE(1, 2)
ico.writeUInt16LE(frames.length, 4)

for (let i = 0; i < frames.length; i++) {
  const s = icoSizes[i]!
  const f = frames[i]!
  const off = headerSize + i * dirEntrySize
  ico.writeUInt8(s < 256 ? s : 0, off)
  ico.writeUInt8(s < 256 ? s : 0, off + 1)
  ico.writeUInt8(0, off + 2)
  ico.writeUInt8(0, off + 3)
  ico.writeUInt16LE(1, off + 4)
  ico.writeUInt16LE(32, off + 6)
  ico.writeUInt32LE(f.length, off + 8)
  ico.writeUInt32LE(dataOffset, off + 12)
  f.copy(ico, dataOffset)
  dataOffset += f.length
}

await Bun.write(`${ICONS_DIR}icon.ico`, ico)
console.log("  icon.ico")

// macOS .icns via iconutil
const iconsetDir = "/tmp/codemad.iconset"
mkdirSync(iconsetDir, { recursive: true })

const icnsSizes = [
  { name: "icon_16x16.png", size: 16 },
  { name: "icon_16x16@2x.png", size: 32 },
  { name: "icon_32x32.png", size: 32 },
  { name: "icon_32x32@2x.png", size: 64 },
  { name: "icon_128x128.png", size: 128 },
  { name: "icon_128x128@2x.png", size: 256 },
  { name: "icon_256x256.png", size: 256 },
  { name: "icon_256x256@2x.png", size: 512 },
  { name: "icon_512x512.png", size: 512 },
  { name: "icon_512x512@2x.png", size: 1024 },
]

for (const entry of icnsSizes) {
  const canvas = createCanvas(entry.size, entry.size)
  const ctx = canvas.getContext("2d")
  drawMark(ctx, entry.size)
  const buffer = canvas.toBuffer("image/png")
  await Bun.write(`${iconsetDir}/${entry.name}`, buffer)
}

const result = Bun.spawnSync(["iconutil", "-c", "icns", iconsetDir, "-o", `${ICONS_DIR}icon.icns`])
if (result.exitCode === 0) {
  console.log("  icon.icns")
} else {
  console.error("  icon.icns FAILED:", result.stderr.toString())
}

// Also generate prod icons (same mark, no visual difference for now)
const PROD_DIR = new URL("../packages/desktop/src-tauri/icons/prod/", import.meta.url).pathname

function generateProd(name: string, size: number) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext("2d")
  drawMark(ctx, size)
  const buffer = canvas.toBuffer("image/png")
  Bun.write(`${PROD_DIR}${name}`, buffer)
}

console.log("\nGenerating prod icons...")
generateProd("32x32.png", 32)
generateProd("64x64.png", 64)
generateProd("128x128.png", 128)
generateProd("128x128@2x.png", 256)
generateProd("icon.png", 512)

generateProd("Square30x30Logo.png", 30)
generateProd("Square44x44Logo.png", 44)
generateProd("Square71x71Logo.png", 71)
generateProd("Square89x89Logo.png", 89)
generateProd("Square107x107Logo.png", 107)
generateProd("Square142x142Logo.png", 142)
generateProd("Square150x150Logo.png", 150)
generateProd("Square284x284Logo.png", 284)
generateProd("Square310x310Logo.png", 310)
generateProd("StoreLogo.png", 50)

// Prod ICO
const prodFrames: Buffer[] = []
for (const s of icoSizes) {
  const canvas = createCanvas(s, s)
  const ctx = canvas.getContext("2d")
  drawMark(ctx, s)
  prodFrames.push(Buffer.from(canvas.toBuffer("image/png")))
}

let prodDataOffset = headerSize + dirSize
const prodIco = Buffer.alloc(headerSize + dirSize + prodFrames.reduce((sum, f) => sum + f.length, 0))
prodIco.writeUInt16LE(0, 0)
prodIco.writeUInt16LE(1, 2)
prodIco.writeUInt16LE(prodFrames.length, 4)

for (let i = 0; i < prodFrames.length; i++) {
  const s = icoSizes[i]!
  const f = prodFrames[i]!
  const off = headerSize + i * dirEntrySize
  prodIco.writeUInt8(s < 256 ? s : 0, off)
  prodIco.writeUInt8(s < 256 ? s : 0, off + 1)
  prodIco.writeUInt8(0, off + 2)
  prodIco.writeUInt8(0, off + 3)
  prodIco.writeUInt16LE(1, off + 4)
  prodIco.writeUInt16LE(32, off + 6)
  prodIco.writeUInt32LE(f.length, off + 8)
  prodIco.writeUInt32LE(prodDataOffset, off + 12)
  f.copy(prodIco, prodDataOffset)
  prodDataOffset += f.length
}

await Bun.write(`${PROD_DIR}icon.ico`, prodIco)
console.log("  icon.ico")

// Prod ICNS
const prodIconsetDir = "/tmp/codemad-prod.iconset"
mkdirSync(prodIconsetDir, { recursive: true })

for (const entry of icnsSizes) {
  const canvas = createCanvas(entry.size, entry.size)
  const ctx = canvas.getContext("2d")
  drawMark(ctx, entry.size)
  const buffer = canvas.toBuffer("image/png")
  await Bun.write(`${prodIconsetDir}/${entry.name}`, buffer)
}

const prodResult = Bun.spawnSync(["iconutil", "-c", "icns", prodIconsetDir, "-o", `${PROD_DIR}icon.icns`])
if (prodResult.exitCode === 0) {
  console.log("  icon.icns")
} else {
  console.error("  icon.icns FAILED:", prodResult.stderr.toString())
}

console.log("\nDone!")
