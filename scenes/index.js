(function() {
  scene.load(function(character) {
    return {
      background: '#efebe9',
      materials: [
        { name: '001/001', x: 0.15, y: 0.2, z: 0, w: 0.75, h: 0.333 },
      ],
      characters: [
        { name: '001/001', x: 0.5, y: 0.6, z: 0, w: 0.1875, h: 0.333 },
      ],
      actions: [
        { name: '001/001', x: 0.5, y: 0.5, next: { scene: '001/001', character: '001' } },
      ],
    };
  });
})();
