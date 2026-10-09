import { useEffect, useRef } from 'react';

export default function Game() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // 🛠️ FIX: Added shadowToTimePropMult & both Input Multipliers back into your configuration script
    const opts = {
      len: 20,
      count: 50,
      baseTime: 10,
      addedTime: 10,
      dieChance: .05,
      spawnChance: 1,
      sparkChance: .1,
      sparkDist: 10,
      sparkSize: 2,
      color: 'hsl(hue,100%,light%)',
      baseLight: 50,
      addedLight: 10,
      shadowToTimePropMult: 6,             // <--- Was missing/causing the crash
      baseLightInputMultiplier: .01,       // <--- Was missing
      addedLightInputMultiplier: .02,      // <--- Was missing
      cx: 0,
      cy: 0,
      repaintAlpha: .04,
      hueChange: .1
    };

    let w = 0;
    let h = 0;
    let tick = 0;
    let lines = [];
    let dieX = 0;
    let dieY = 0;
    const baseRad = Math.PI * 2 / 6;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      w = canvas.width = container.clientWidth;
      h = canvas.height = container.clientHeight;
      
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, w, h);
      
      opts.cx = w / 2;
      opts.cy = h / 2;
      dieX = w / 2 / opts.len;
      dieY = h / 2 / opts.len;
    };

    function Line() {
      this.reset();
    }

    Line.prototype.reset = function() {
      this.x = 0;
      this.y = 0;
      this.addedX = 0;
      this.addedY = 0;
      this.rad = 0;
      this.lightInputMultiplier = opts.baseLightInputMultiplier + opts.addedLightInputMultiplier * Math.random();
      this.color = opts.color.replace('hue', tick * opts.hueChange);
      this.cumulativeTime = 0;
      this.beginPhase();
    };

    Line.prototype.beginPhase = function() {
      this.x += this.addedX;
      this.y += this.addedY;
      this.time = 0;
      this.targetTime = (opts.baseTime + opts.addedTime * Math.random()) | 0;
      this.rad += baseRad * (Math.random() < .5 ? 1 : -1);
      this.addedX = Math.cos(this.rad);
      this.addedY = Math.sin(this.rad);
      
      if (Math.random() < opts.dieChance || this.x > dieX || this.x < -dieX || this.y > dieY || this.y < -dieY) {
        this.reset();
      }
    };

    Line.prototype.step = function() {
      ++this.time;
      ++this.cumulativeTime;
      
      if (this.time >= this.targetTime) {
        this.beginPhase();
      }
      
      const prop = this.time / this.targetTime;
      const wave = Math.sin(prop * Math.PI / 2);
      const x = this.addedX * wave;
      const y = this.addedY * wave;
      
      ctx.shadowBlur = prop * opts.shadowToTimePropMult;
      ctx.fillStyle = ctx.shadowColor = this.color.replace('light', opts.baseLight + opts.addedLight * Math.sin(this.cumulativeTime * this.lightInputMultiplier));
      ctx.fillRect(opts.cx + (this.x + x) * opts.len, opts.cy + (this.y + y) * opts.len, 2, 2);
      
      if (Math.random() < opts.sparkChance) {
        ctx.fillRect(
          opts.cx + (this.x + x) * opts.len + Math.random() * opts.sparkDist * (Math.random() < .5 ? 1 : -1) - opts.sparkSize / 2, 
          opts.cy + (this.y + y) * opts.len + Math.random() * opts.sparkDist * (Math.random() < .5 ? 1 : -1) - opts.sparkSize / 2, 
          opts.sparkSize, 
          opts.sparkSize
        );
      }
    };

    function loop() {
      animationFrameId = window.requestAnimationFrame(loop);
      ++tick;
      
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0,0,0,alp)'.replace('alp', opts.repaintAlpha);
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      
      if (lines.length < opts.count && Math.random() < opts.spawnChance) {
        lines.push(new Line());
      }
      
      lines.map(function(line) { line.step(); });
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    loop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <canvas 
        ref={canvasRef} 
        id="c" 
        style={{ display: 'block', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} 
      />
    </div>
  );
}
