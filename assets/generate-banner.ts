import { createCanvas } from "@napi-rs/canvas"

const canvas = createCanvas(460, 90)
const ctx = canvas.getContext("2d")

// Background
ctx.fillStyle = "#0d1117"
ctx.beginPath()
ctx.roundRect(0, 0, 460, 90, 8)
ctx.fill()

// ASCII art lines
const lines = [
  "█▀▀▀ █▀▀█ █▀▀▄ █▀▀▀ █▄ ▄█ █▀▀█ █▀▀▄",
  "█    █  █ █  █ █▀▀▀ █ ▀ █ █▀▀█ █  █",
  "█▄▄▄ █▄▄█ █▄▄▀ █▄▄▄ █   █ █  █ █▄▄▀",
]

// CODE part ends at character 19, MAD starts at character 20
const codeEnd = 19

ctx.font = "bold 18px monospace"
ctx.textBaseline = "top"

lines.forEach((line, i) => {
  const y = 18 + i * 22
  const codePart = line.slice(0, codeEnd)
  const madPart = line.slice(codeEnd)

  // Draw CODE in gray
  ctx.fillStyle = "#888888"
  ctx.fillText(codePart, 20, y)

  // Measure CODE width and draw MAD in orange
  const codeWidth = ctx.measureText(codePart).width
  ctx.fillStyle = "#FF3300"
  ctx.fillText(madPart, 20 + codeWidth, y)
})

// Save as PNG
const buffer = canvas.toBuffer("image/png")
await Bun.write("./assets/banner.png", buffer)
console.log("Generated banner.png")
