class CanvasEditor {
  constructor(canvas, initialStripColor = '#ffffff', initialCtaText = 'Contact Us', initialLines = []) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stripColor = initialStripColor;
    this.lines = initialLines; // initialization of caption lines 
    this.image = null;
    this.caption = {
      text: '',
      x: 100, // Initial x position for caption
      y: 200, // Initial y position for caption
      fontSize: 25,
      alignment: 'center',
      color: 'black',
      maxCharactersPerLine: 31,
    };
    this.ctaText = initialCtaText; // Initialization of CTA text 
    this.draw(); // draw with strip and cta text
  }

  
  setCaption(caption) {
    this.caption = { ...this.caption, ...caption };
    this.draw();
  }

  setStripColor(color) {
    this.stripColor = color;
    this.draw();
  }

  setImage(imageData) {
    this.image = new Image();
    this.image.onload = () => {
      this.draw();
    };
    this.image.src = imageData;
  }

  

  setCtaText(text) {
    this.ctaText = text;
    this.draw();
  }

  draw() {
    const { ctx, stripColor, lines, caption, ctaText } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 45 parralel lines for design
    if (lines && lines.length > 0) {
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      lines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(line.endX, line.endY);
        ctx.stroke();
      });
    }

    ctx.save();

    // Draw of rounded black rectangle for canva design
    this.drawRoundedRect(ctx, 185, 25, 300, 340, 40);

    // suitable angle in which strip inclined
    ctx.translate(175, 0);
    ctx.rotate((58 * Math.PI) / 180);

    // Draw the strip
    ctx.fillStyle = stripColor;
    ctx.fillRect(-120, -170, this.canvas.height * 5, 290);

    // suitable angle inside the canvas for the contact us buttton
    ctx.translate(60, 35);
    ctx.rotate((32 * Math.PI) / 180);

    // contact us button size
    this.clearRoundedRect(ctx, 290, -275, 35, 140, 10);


    ctx.save();
    ctx.translate(305, -115);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = stripColor;
    ctx.font = "25px Arial";
    ctx.fillText(ctaText, 25, 9);
    ctx.restore();


    ctx.restore();

    // button on the strip
    ctx.save();
    ctx.translate(175, 0);
    ctx.rotate((67 * Math.PI) / 180);
    this.drawRoundedRect(ctx, -50, 230, 120, 30, 10, 'white');
    ctx.restore();

    // Draw the caption text
     ctx.save();
     ctx.fillStyle = caption.color;
     ctx.font = `${caption.fontSize}px Arial`;
     ctx.textAlign = caption.alignment;
    ctx.save();
  
     let xPosition = caption.x;
     if (caption.alignment === 'center') {
       const textWidth = ctx.measureText(caption.text).width;
       xPosition = (this.canvas.width - textWidth) / 2;
     } else if (caption.alignment === 'right') {
       const textWidth = ctx.measureText(caption.text).width;
       xPosition = this.canvas.width - textWidth - caption.x;
     }
 
     const wrappedLines = this.wrapText(caption.text, caption.maxCharactersPerLine);
     wrappedLines.forEach((line, index) => {
       ctx.fillText(line, xPosition-10, caption.y + index * (caption.fontSize + 5)+250);
     });
     ctx.restore();
 
     ctx.restore();
     ctx.save();
  }

  wrapText(text, maxCharactersPerLine) {
    const lines = [];
    while (text.length > maxCharactersPerLine) {
      let breakIndex = text.lastIndexOf(' ', maxCharactersPerLine);
      if (breakIndex === -1) breakIndex = maxCharactersPerLine;
      lines.push(text.slice(0, breakIndex));
      text = text.slice(breakIndex).trim();
    }
    lines.push(text);
    return lines;
  }


  drawRoundedRect(ctx, x, y, width, height, radius, fillStyle = null) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }

  clearRoundedRect(ctx, x, y, width, height, radius) {
    const path = new Path2D();
    path.moveTo(x + radius, y);
    path.lineTo(x + width - radius, y);
    path.quadraticCurveTo(x + width, y, x + width, y + radius);
    path.lineTo(x + width, y + height - radius);
    path.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    path.lineTo(x + radius, y + height);
    path.quadraticCurveTo(x, y + height, x, y + height - radius);
    path.lineTo(x, y + radius);
    path.quadraticCurveTo(x, y, x + radius, y);
    path.closePath();
    ctx.save();
    ctx.clip(path);
    ctx.clearRect(x, y, width, height);
    ctx.restore();
  }
}

export default CanvasEditor;
