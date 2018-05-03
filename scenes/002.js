(function() {
  scene.load(function() {
    return {
      background: '#3e2723',
      foreground: ['#efebe9', 0.6],
      materials: [
        { name: '001/001', x: 0.6, y: 0.15, z: 0.5, w: 0.1875, h: 1.333 },
        { name: '002/001', x: 0.15, y: 0.5, z: 0, w: 0.75, h: 0.333 },
      ],
      characters: [
        { name: '001/001', x: 0.7, y: 0.4, z: 0, w: 0.1875, h: 0.333 },
        { name: '002/001', x: 0.1, y: 0.4, z: 0, w: 0.1875, h: 0.333 },
      ],
      actions: [
        { name: '001', x: 0.3, y: 0.3, next: { scene: '001' } },
      ],
    };
  });
})();
