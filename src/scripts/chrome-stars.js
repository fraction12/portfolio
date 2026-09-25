// @ts-nocheck
/*
 * Two chrome balloon stars drifting over the cover. This module (and the
 * three.js it pulls in) is imported on demand so it never blocks first paint.
 * Returns a stop function.
 */
import { CanvasTexture, ConeGeometry, Group, Mesh, MeshMatcapMaterial, PerspectiveCamera, Scene, SphereGeometry, Vector3, WebGLRenderer } from 'three';

export async function initChromeStars(cover, canvas) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stopped = false;

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch {
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 18);

  // Chrome matcap painted on a canvas: sky, dark horizon, floor, hot highlight.
  const mc = document.createElement('canvas');
  mc.width = mc.height = 512;
  const g = mc.getContext('2d');
  const lg = g.createLinearGradient(0, 0, 0, 512);
  [[0, '#ffffff'], [0.25, '#eef1f5'], [0.45, '#a9afb7'], [0.5, '#3a3d43'], [0.54, '#7b8089'], [0.72, '#dfe2e6'], [0.9, '#fbfbfc'], [1, '#c3c7cd']]
    .forEach(([o, c]) => lg.addColorStop(o, c));
  g.fillStyle = lg;
  g.fillRect(0, 0, 512, 512);
  const hot = g.createRadialGradient(170, 150, 0, 170, 150, 120);
  hot.addColorStop(0, 'rgba(255,255,255,1)');
  hot.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = hot;
  g.fillRect(0, 0, 512, 512);
  const warm = g.createRadialGradient(360, 380, 0, 360, 380, 90);
  warm.addColorStop(0, 'rgba(255,240,250,.9)');
  warm.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = warm;
  g.fillRect(0, 0, 512, 512);
  const matcapTex = new CanvasTexture(mc);
  const mat = new MeshMatcapMaterial({ matcap: matcapTex });

  function makeStar() {
    const grp = new Group();
    const s = 1 / Math.sqrt(3);
    const dirs = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]]
      .forEach(d => dirs.push([d[0] * s, d[1] * s, d[2] * s]));
    const up = new Vector3(0, 1, 0);
    dirs.forEach((d, k) => {
      const len = k < 6 ? 2.4 : 2.0;
      const geo = new ConeGeometry(0.55, len, 32, 12);
      // Puff the spikes and crinkle the foil a little.
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
        const puff = 1 + 0.12 * Math.sin((y / len + 0.5) * Math.PI);
        const n = 1 + 0.05 * Math.sin(y * 9 + Math.atan2(z, x) * 7);
        p.setXYZ(i, x * puff * n, y, z * puff * n);
      }
      geo.computeVertexNormals();
      const m = new Mesh(geo, mat);
      const v = new Vector3(d[0], d[1], d[2]).normalize();
      m.quaternion.setFromUnitVectors(up, v);
      m.position.copy(v.clone().multiplyScalar(len / 2 + 0.15));
      grp.add(m);
    });
    grp.add(new Mesh(new SphereGeometry(0.62, 32, 24), mat));
    return grp;
  }

  const spots = [[-0.45, 0.26, 0.7], [0.46, -0.3, 0.75]];
  const stars = spots.map((s, k) => {
    const st = makeStar();
    st.userData = { sx: s[0], sy: s[1], sc: s[2], ph: k * 1.7, rs: (k % 2 ? 1 : -1) * (0.12 + k * 0.03) };
    st.rotation.set(k, k * 2, k * 0.5);
    scene.add(st);
    return st;
  });

  let W = 0, H = 0, mx = 0, my = 0, tmx = 0, tmy = 0, sy = 0, visible = true;
  function size() {
    const r = cover.getBoundingClientRect();
    W = r.width;
    H = r.height;
    if (!W || !H) return;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }
  function frame(now) {
    if (stopped) return;
    if (visible && W) {
      const t = now / 1000;
      mx += (tmx - mx) * 0.025;
      my += (tmy - my) * 0.025;
      const vh = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      const vw = vh * camera.aspect;
      const narrow = W < 700;
      stars.forEach((st, k) => {
        const u = st.userData;
        st.scale.setScalar(u.sc * (narrow ? 0.35 : Math.min(0.6, W / 2300)));
        st.position.set(
          u.sx * vw + mx * (k + 1) * 0.15,
          u.sy * vh + Math.sin(t * 0.35 + u.ph) * 0.2 - my * (k + 1) * 0.1 + sy * 0.004 * (k + 1),
          -2,
        );
        if (!reduce) {
          st.rotation.y += u.rs * 0.004;
          st.rotation.x += u.rs * 0.0015;
        }
      });
      renderer.render(scene, camera);
    }
    if (!reduce) requestAnimationFrame(frame);
  }

  const onResize = () => { size(); if (reduce) requestAnimationFrame(frame); };
  const onMove = e => { tmx = (e.clientX / window.innerWidth - 0.5) * 2; tmy = (e.clientY / window.innerHeight - 0.5) * 2; };
  const onScroll = () => { sy = window.scrollY; };
  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; });
  io.observe(cover);
  const ro = new ResizeObserver(onResize);
  ro.observe(cover);
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  size();
  requestAnimationFrame(frame);

  return () => {
    stopped = true;
    io.disconnect();
    ro.disconnect();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('scroll', onScroll);
    scene.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    mat.matcap.dispose();
    mat.dispose();
    renderer.dispose();
  };
}
