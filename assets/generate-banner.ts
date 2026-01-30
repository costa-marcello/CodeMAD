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

// CODE ends at character 19 (0-indexed), MAD starts at 20
const codeEnd = 19
const charWidth = 11 // Fixed width per character
const startX = 20

ctx.font = "bold 18px monospace"
ctx.textBaseline = "top"

lines.forEach((line, i) => {
  const y = 18 + i * 22

  // Draw each character individually at fixed positions
  for (let j = 0; j < line.length; j++) {
    const char = line[j]
    if (char === " ") continue // Skip spaces

    // Gray for CODE (chars 0-18), orange for MAD (chars 19+)
    ctx.fillStyle = j < codeEnd ? "#888888" : "#FF3300"
    ctx.fillText(char, startX + j * charWidth, y)
  }
})

// Save as PNG
const buffer = canvas.toBuffer("image/png")
await Bun.write("./assets/banner.png", buffer)
console.log("Generated banner.png")
