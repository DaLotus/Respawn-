const canvas = document.querySelector("#ambient-scene");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let scale = window.devicePixelRatio || 1;
const nodes = [];
const colors = ["#11695f", "#b8872c", "#7a2638", "#17201d"];

function resize() {
  scale = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  seedNodes();
}

function seedNodes() {
  nodes.length = 0;
  const count = Math.max(34, Math.floor((width * height) / 28000));
  for (let i = 0; i < count; i += 1) {
    nodes.push({
      x: width * (0.38 + Math.random() * 0.58),
      y: Math.random() * height,
      baseX: 0,
      baseY: 0,
      radius: 2 + Math.random() * 3.5,
      color: colors[i % colors.length],
      phase: Math.random() * Math.PI * 2,
      speed: 0.22 + Math.random() * 0.38,
    });
    nodes[i].baseX = nodes[i].x;
    nodes[i].baseY = nodes[i].y;
  }
}

function drawGrid(time) {
  const grid = Math.max(52, Math.min(82, width / 18));
  ctx.strokeStyle = "rgba(23, 32, 29, 0.045)";
  ctx.lineWidth = 1;

  for (let x = width * 0.35; x < width + grid; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - width * 0.08, height);
    ctx.stroke();
  }

  for (let y = -grid; y < height + grid; y += grid) {
    const wobble = Math.sin(time * 0.0003 + y * 0.01) * 10;
    ctx.beginPath();
    ctx.moveTo(width * 0.32, y + wobble);
    ctx.lineTo(width, y - width * 0.05 + wobble);
    ctx.stroke();
  }
}

function drawCabinetGlyph(time) {
  const x = width * 0.7;
  const y = height * 0.53;
  const unit = Math.min(width, height) * 0.16;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.08);
  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = "#17201d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-unit * 0.62, -unit * 1.1);
  ctx.lineTo(unit * 0.48, -unit * 1.1);
  ctx.lineTo(unit * 0.58, unit * 0.78);
  ctx.lineTo(-unit * 0.5, unit * 0.96);
  ctx.closePath();
  ctx.stroke();

  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = "#11695f";
  ctx.strokeRect(-unit * 0.42, -unit * 0.82, unit * 0.72, unit * 0.42);
  ctx.fillStyle = "#b8872c";
  ctx.globalAlpha = 0.13 + Math.sin(time * 0.002) * 0.03;
  ctx.beginPath();
  ctx.arc(unit * 0.05, unit * 0.12, unit * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawNodes(time) {
  for (const node of nodes) {
    node.x = node.baseX + Math.cos(time * 0.001 * node.speed + node.phase) * 18;
    node.y = node.baseY + Math.sin(time * 0.0011 * node.speed + node.phase) * 14;
  }

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 150) {
        ctx.strokeStyle = `rgba(17, 105, 95, ${0.13 * (1 - distance / 150)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  for (const node of nodes) {
    ctx.fillStyle = node.color;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function render(time = 0) {
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f7f5ef");
  gradient.addColorStop(0.58, "#ebe5d6");
  gradient.addColorStop(1, "#d8eee9");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  drawGrid(time);
  drawCabinetGlyph(time);
  drawNodes(time);

  requestAnimationFrame(render);
}

window.addEventListener("resize", resize);
resize();
requestAnimationFrame(render);
