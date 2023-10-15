self.addEventListener('message', function(e) {
    const { maxLevel, branches, sides, scale, spread } = e.data;
  
    // Put your fractal calculation function here
    function calculateFractal(level, x1, y1, angle, length) {
        if (level === 0) {
          const x2 = x1 + length * Math.cos(angle);
          const y2 = y1 + length * Math.sin(angle);
          return [{x1, y1, x2, y2}];
        }
      
        const branches = [];
        const newLength = length * scale;
        const x2 = x1 + length * Math.cos(angle);
        const y2 = y1 + length * Math.sin(angle);
      
        branches.push({x1, y1, x2, y2});
        branches.push(...calculateFractal(level - 1, x2, y2, angle - spread, newLength));
        branches.push(...calculateFractal(level - 1, x2, y2, angle + spread, newLength));
      
        return branches;
      }
  
    const points = calculateFractal(maxLevel, branches, sides, scale, spread);
    
    self.postMessage(points);
  }, false);
  