/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：首页 Canvas 背景动画，绘制粒子网络连线并跟随鼠标产生交互
 */
(function () {
  const spCanvas = document.getElementById('sp_canvas');
  if (!spCanvas) return;

  const spCtx = spCanvas.getContext('2d');
  const spState = {
    spWidth: 0,
    spHeight: 0,
    spParticles: [],
    spMouse: { x: -9999, y: -9999 },
    spRafId: 0
  };
  const spLinkDistance = 130;
  const spMouseDistance = 170;
  const spReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * 按窗口尺寸与设备像素比调整画布，并重建粒子
   */
  function sp_resizeCanvas() {
    const spDpr = Math.min(window.devicePixelRatio || 1, 2);
    spState.spWidth = window.innerWidth;
    spState.spHeight = window.innerHeight;
    spCanvas.width = Math.round(spState.spWidth * spDpr);
    spCanvas.height = Math.round(spState.spHeight * spDpr);
    spCanvas.style.width = spState.spWidth + 'px';
    spCanvas.style.height = spState.spHeight + 'px';
    spCtx.setTransform(spDpr, 0, 0, spDpr, 0, 0);
    sp_initParticles();
  }

  /**
   * 生成单个粒子，随机位置、速度、半径与颜色
   */
  function sp_createParticle() {
    const spColors = [
      'rgba(140, 175, 255, 0.85)',
      'rgba(46, 230, 214, 0.75)',
      'rgba(169, 123, 255, 0.7)'
    ];
    return {
      x: Math.random() * spState.spWidth,
      y: Math.random() * spState.spHeight,
      vx: (Math.random() - 0.5) * 0.36,
      vy: (Math.random() - 0.5) * 0.36,
      spR: Math.random() * 1.6 + 0.8,
      spColor: spColors[Math.floor(Math.random() * spColors.length)],
      spPhase: Math.random() * Math.PI * 2
    };
  }

  /**
   * 按画布面积初始化粒子数量，控制性能开销
   */
  function sp_initParticles() {
    const spCount = Math.min(110, Math.floor((spState.spWidth * spState.spHeight) / 16000));
    spState.spParticles = [];
    for (let spI = 0; spI < spCount; spI += 1) {
      spState.spParticles.push(sp_createParticle());
    }
  }

  /**
   * 更新粒子位置：边界回弹 + 鼠标排斥
   */
  function sp_updateParticles() {
    const spParticles = spState.spParticles;
    for (let spI = 0; spI < spParticles.length; spI += 1) {
      const spP = spParticles[spI];
      spP.x += spP.vx;
      spP.y += spP.vy;
      spP.spPhase += 0.015;

      if (spP.x < 0 || spP.x > spState.spWidth) spP.vx *= -1;
      if (spP.y < 0 || spP.y > spState.spHeight) spP.vy *= -1;

      const spDx = spP.x - spState.spMouse.x;
      const spDy = spP.y - spState.spMouse.y;
      const spDist = Math.sqrt(spDx * spDx + spDy * spDy);
      if (spDist < 90 && spDist > 0.1) {
        spP.x += (spDx / spDist) * 0.9;
        spP.y += (spDy / spDist) * 0.9;
      }
    }
  }

  /**
   * 绘制一帧画面：粒子、粒子间连线、鼠标连线
   */
  function sp_drawScene() {
    const spParticles = spState.spParticles;
    spCtx.clearRect(0, 0, spState.spWidth, spState.spHeight);

    // 粒子之间的连线
    for (let spI = 0; spI < spParticles.length; spI += 1) {
      for (let spJ = spI + 1; spJ < spParticles.length; spJ += 1) {
        const spA = spParticles[spI];
        const spB = spParticles[spJ];
        const spDx = spA.x - spB.x;
        const spDy = spA.y - spB.y;
        const spDist = Math.sqrt(spDx * spDx + spDy * spDy);
        if (spDist < spLinkDistance) {
          spCtx.strokeStyle = 'rgba(120, 160, 255, ' + (1 - spDist / spLinkDistance) * 0.28 + ')';
          spCtx.lineWidth = 1;
          spCtx.beginPath();
          spCtx.moveTo(spA.x, spA.y);
          spCtx.lineTo(spB.x, spB.y);
          spCtx.stroke();
        }
      }
    }

    // 鼠标与粒子的连线
    for (let spK = 0; spK < spParticles.length; spK += 1) {
      const spP = spParticles[spK];
      const spMd = Math.hypot(spP.x - spState.spMouse.x, spP.y - spState.spMouse.y);
      if (spMd < spMouseDistance) {
        spCtx.strokeStyle = 'rgba(46, 230, 214, ' + (1 - spMd / spMouseDistance) * 0.4 + ')';
        spCtx.lineWidth = 0.8;
        spCtx.beginPath();
        spCtx.moveTo(spP.x, spP.y);
        spCtx.lineTo(spState.spMouse.x, spState.spMouse.y);
        spCtx.stroke();
      }
    }

    // 粒子本体
    for (let spM = 0; spM < spParticles.length; spM += 1) {
      const spP = spParticles[spM];
      const spAlpha = 0.55 + Math.sin(spP.spPhase) * 0.35;
      spCtx.globalAlpha = Math.max(0.15, spAlpha);
      spCtx.fillStyle = spP.spColor;
      spCtx.beginPath();
      spCtx.arc(spP.x, spP.y, spP.spR, 0, Math.PI * 2);
      spCtx.fill();
    }
    spCtx.globalAlpha = 1;
  }

  /**
   * 动画主循环：更新粒子并绘制画面
   */
  function sp_animate() {
    sp_updateParticles();
    sp_drawScene();
    spState.spRafId = window.requestAnimationFrame(sp_animate);
  }

  /**
   * 初始化背景：绑定尺寸变化、鼠标移动与动画循环
   */
  function sp_initBackground() {
    sp_resizeCanvas();
    window.addEventListener('resize', sp_resizeCanvas);

    window.addEventListener('mousemove', function (spEvent) {
      spState.spMouse.x = spEvent.clientX;
      spState.spMouse.y = spEvent.clientY;
    });

    window.addEventListener('mouseout', function () {
      spState.spMouse.x = -9999;
      spState.spMouse.y = -9999;
    });

    // 尊重系统「减少动态效果」偏好，仅绘制静态画面
    if (spReduceMotion) {
      sp_drawScene();
      return;
    }
    sp_animate();
  }

  sp_initBackground();
})();
