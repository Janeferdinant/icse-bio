import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface StomataSceneProps {
  turgorPressure: number; // 0 - 100%
  kIonConcentration: number; // 0 - 100%
  lightCondition: 'day' | 'night' | 'drought';
  onSelectPart?: (partName: string) => void;
  selectedPart?: string | null;
}

export const StomataScene: React.FC<StomataSceneProps> = ({
  turgorPressure,
  kIonConcentration,
  lightCondition,
  onSelectPart,
  selectedPart
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectPartRef = useRef(onSelectPart);
  useEffect(() => {
    onSelectPartRef.current = onSelectPart;
  }, [onSelectPart]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02130e);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Multi-directional cinematic biological lighting
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 0.7);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xfef08a, 1.4);
    mainSun.position.set(6, 8, 8);
    scene.add(mainSun);

    const chlorophyllGlow = new THREE.PointLight(0x22c55e, 1.5, 20);
    chlorophyllGlow.position.set(0, 0, 4);
    scene.add(chlorophyllGlow);

    const stomataGroup = new THREE.Group();
    scene.add(stomataGroup);

    // Calculate effective turgor & aperture spread
    const effectiveTurgor = lightCondition === 'night' ? 12 : lightCondition === 'drought' ? 4 : turgorPressure;
    const apertureSpread = (effectiveTurgor / 100.0) * 1.65; // 0 = touching/closed, 1.65 = wide open

    // Materials
    const outerWallMat = new THREE.MeshPhongMaterial({
      color: 0x4ade80,
      emissive: 0x052e16,
      specular: 0x86efac,
      shininess: 70,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide
    });

    const innerWallMat = new THREE.MeshPhongMaterial({
      color: 0x14532d, // Dark dense forest green
      emissive: 0x064e3b,
      specular: 0x4ade80,
      shininess: 95
    });

    const chloroplastMat = new THREE.MeshPhongMaterial({
      color: 0x15803d,
      emissive: 0x14532d,
      specular: 0x86efac,
      shininess: 100
    });

    const vacuoleMat = new THREE.MeshPhongMaterial({
      color: 0x67e8f9,
      emissive: 0x083344,
      transparent: true,
      opacity: 0.45,
      shininess: 85
    });

    const nucleusMat = new THREE.MeshPhongMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      shininess: 90
    });

    const epidermalMat = new THREE.MeshPhongMaterial({
      color: 0x065f46,
      transparent: true,
      opacity: 0.35,
      wireframe: false
    });

    const interactiveMeshes: THREE.Mesh[] = [];

    // Helper to register parts
    const registerPart = (mesh: THREE.Mesh, partName: string) => {
      mesh.userData = { partName };
      interactiveMeshes.push(mesh);
    };

    // 1. Surrounding Epidermal Pavement Cells (Jigsaw leaf surface)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const dist = 5.2 + (i % 2 === 0 ? 0.6 : -0.4);
      const epiShape = new THREE.Shape();
      const s = 1.6;
      epiShape.moveTo(-s, -s);
      epiShape.quadraticCurveTo(0, -s * 1.5, s, -s);
      epiShape.quadraticCurveTo(s * 1.4, 0, s, s);
      epiShape.quadraticCurveTo(0, s * 1.4, -s, s);
      epiShape.quadraticCurveTo(-s * 1.3, 0, -s, -s);

      const epiGeo = new THREE.ExtrudeGeometry(epiShape, { depth: 0.4, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.1 });
      const epiMesh = new THREE.Mesh(epiGeo, epidermalMat);
      epiMesh.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, -0.6);
      epiMesh.rotation.z = angle + 0.3;
      stomataGroup.add(epiMesh);
    }

    // 2. Left Guard Cell (Authentic Kidney-Bean Curved Spline)
    const leftPoints = [
      new THREE.Vector3(-0.35 - apertureSpread * 0.7, -3.2, 0),
      new THREE.Vector3(-1.8 - apertureSpread * 1.3, -1.8, 0.2),
      new THREE.Vector3(-2.4 - apertureSpread * 1.55, 0, 0.3),
      new THREE.Vector3(-1.8 - apertureSpread * 1.3, 1.8, 0.2),
      new THREE.Vector3(-0.35 - apertureSpread * 0.7, 3.2, 0)
    ];
    const leftCurve = new THREE.CatmullRomCurve3(leftPoints);
    const leftGeo = new THREE.TubeGeometry(leftCurve, 40, 0.95, 20, false);
    const leftGuardCell = new THREE.Mesh(leftGeo, outerWallMat);
    registerPart(leftGuardCell, 'Guard Cells');
    stomataGroup.add(leftGuardCell);

    // Thick Inner Cellulose Wall (Left)
    const leftInnerPoints = [
      new THREE.Vector3(-0.25 - apertureSpread * 0.65, -3.0, 0),
      new THREE.Vector3(-0.65 - apertureSpread * 0.9, -1.5, 0),
      new THREE.Vector3(-0.85 - apertureSpread * 0.95, 0, 0),
      new THREE.Vector3(-0.65 - apertureSpread * 0.9, 1.5, 0),
      new THREE.Vector3(-0.25 - apertureSpread * 0.65, 3.0, 0)
    ];
    const leftInnerCurve = new THREE.CatmullRomCurve3(leftInnerPoints);
    const leftInnerGeo = new THREE.TubeGeometry(leftInnerCurve, 32, 0.35, 16, false);
    const leftInnerMesh = new THREE.Mesh(leftInnerGeo, innerWallMat);
    registerPart(leftInnerMesh, 'Thick Inner Wall');
    stomataGroup.add(leftInnerMesh);

    // 3. Right Guard Cell (Mirrored Kidney-Bean)
    const rightPoints = [
      new THREE.Vector3(0.35 + apertureSpread * 0.7, -3.2, 0),
      new THREE.Vector3(1.8 + apertureSpread * 1.3, -1.8, 0.2),
      new THREE.Vector3(2.4 + apertureSpread * 1.55, 0, 0.3),
      new THREE.Vector3(1.8 + apertureSpread * 1.3, 1.8, 0.2),
      new THREE.Vector3(0.35 + apertureSpread * 0.7, 3.2, 0)
    ];
    const rightCurve = new THREE.CatmullRomCurve3(rightPoints);
    const rightGeo = new THREE.TubeGeometry(rightCurve, 40, 0.95, 20, false);
    const rightGuardCell = new THREE.Mesh(rightGeo, outerWallMat);
    registerPart(rightGuardCell, 'Guard Cells');
    stomataGroup.add(rightGuardCell);

    // Thick Inner Cellulose Wall (Right)
    const rightInnerPoints = [
      new THREE.Vector3(0.25 + apertureSpread * 0.65, -3.0, 0),
      new THREE.Vector3(0.65 + apertureSpread * 0.9, -1.5, 0),
      new THREE.Vector3(0.85 + apertureSpread * 0.95, 0, 0),
      new THREE.Vector3(0.65 + apertureSpread * 0.9, 1.5, 0),
      new THREE.Vector3(0.25 + apertureSpread * 0.65, 3.0, 0)
    ];
    const rightInnerCurve = new THREE.CatmullRomCurve3(rightInnerPoints);
    const rightInnerGeo = new THREE.TubeGeometry(rightInnerCurve, 32, 0.35, 16, false);
    const rightInnerMesh = new THREE.Mesh(rightInnerGeo, innerWallMat);
    registerPart(rightInnerMesh, 'Thick Inner Wall');
    stomataGroup.add(rightInnerMesh);

    // 4. Stomatal Pore Aperture Visualization (Center opening)
    const poreShape = new THREE.Shape();
    const pw = Math.max(0.1, apertureSpread * 0.9);
    poreShape.moveTo(0, -3.0);
    poreShape.quadraticCurveTo(-pw, 0, 0, 3.0);
    poreShape.quadraticCurveTo(pw, 0, 0, -3.0);
    const poreGeo = new THREE.ShapeGeometry(poreShape);
    const poreMat = new THREE.MeshBasicMaterial({
      color: 0x022c22,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    const poreMesh = new THREE.Mesh(poreGeo, poreMat);
    poreMesh.position.z = -0.1;
    registerPart(poreMesh, 'Stomatal Aperture');
    stomataGroup.add(poreMesh);

    // 5. Embedded Chloroplasts (8 per cell)
    [-1.7, 1.7].forEach((sideX) => {
      for (let i = 0; i < 7; i++) {
        const cGeo = new THREE.SphereGeometry(0.22, 16, 12);
        cGeo.scale(1.2, 0.8, 1.0);
        const cMesh = new THREE.Mesh(cGeo, chloroplastMat);
        const yOffset = -2.2 + i * 0.72;
        const xOffset = sideX > 0 ? sideX + apertureSpread * 1.1 : sideX - apertureSpread * 1.1;
        cMesh.position.set(xOffset, yOffset, 0.25);
        registerPart(cMesh, 'Chloroplast');
        stomataGroup.add(cMesh);
      }
    });

    // 6. Central Vacuole (Expands with turgor pressure)
    const vacuoleRadius = 0.45 + (effectiveTurgor / 100.0) * 0.35;
    [-1.6, 1.6].forEach((sideX) => {
      const vGeo = new THREE.SphereGeometry(vacuoleRadius, 24, 16);
      vGeo.scale(0.9, 1.8, 0.8);
      const vMesh = new THREE.Mesh(vGeo, vacuoleMat);
      const posX = sideX > 0 ? sideX + apertureSpread * 0.9 : sideX - apertureSpread * 0.9;
      vMesh.position.set(posX, 0.2, 0.1);
      registerPart(vMesh, 'Vacuole');
      stomataGroup.add(vMesh);
    });

    // 7. Cell Nucleus
    [-1.8, 1.8].forEach((sideX) => {
      const nGeo = new THREE.SphereGeometry(0.28, 16, 16);
      const nMesh = new THREE.Mesh(nGeo, nucleusMat);
      const posX = sideX > 0 ? sideX + apertureSpread * 1.15 : sideX - apertureSpread * 1.15;
      nMesh.position.set(posX, -1.2, 0.25);
      registerPart(nMesh, 'Guard Cells');
      stomataGroup.add(nMesh);
    });

    // 8. Potassium (K+) Ion & Water Influx Particles
    const kCount = Math.floor(kIonConcentration * 1.8);
    const kGeo = new THREE.BufferGeometry();
    const kPos = new Float32Array(kCount * 3);
    for (let i = 0; i < kCount; i++) {
      kPos[i * 3] = (Math.random() - 0.5) * 8.0;
      kPos[i * 3 + 1] = (Math.random() - 0.5) * 8.0;
      kPos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
    }
    kGeo.setAttribute('position', new THREE.BufferAttribute(kPos, 3));
    const kMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.2,
      transparent: true,
      opacity: 0.85
    });
    const kPoints = new THREE.Points(kGeo, kMat);
    stomataGroup.add(kPoints);

    // Raycasting for interactive clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, true);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.partName) {
          onSelectPartRef.current?.(hit.userData.partName);
        }
      }
    };
    container.addEventListener('click', handleClick);

    // Mouse drag to rotate
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        stomataGroup.rotation.y += dx * 0.007;
        stomataGroup.rotation.x += dy * 0.007;
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };
    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle biological breathing movement
      if (!isDragging) {
        stomataGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.03;
      }

      // Animate K+ ion particles swirling toward vacuole
      const posAttr = kGeo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < kCount; i++) {
        arr[i * 3 + 2] += 0.015;
        if (arr[i * 3 + 2] > 2.0) {
          arr[i * 3 + 2] = -2.0;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(reqId);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [turgorPressure, kIonConcentration, lightCondition]);

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden bg-black/80 border border-emerald-500/30 shadow-2xl">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Status Header */}
      <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-emerald-500/30 text-xs font-mono space-y-1.5 shadow-lg">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Realistic Stomatal Complex</span>
        </div>
        <div className="text-slate-300">
          Turgor Pressure: <strong className="text-emerald-400">{turgorPressure}%</strong>
        </div>
        <div className="text-slate-300">
          K⁺ Ion Influx: <strong className="text-sky-400">{kIonConcentration}%</strong>
        </div>
        <div className="pt-1 border-t border-white/10 text-xs font-sans">
          <span className="text-slate-400 block mb-0.5 font-mono text-[10px] uppercase">State:</span>
          {turgorPressure > 35 ? (
            <span className="text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
              🍃 OPEN: Active Transpiration & CO₂ Absorption
            </span>
          ) : (
            <span className="text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
              🔒 CLOSED: Water Conservation State
            </span>
          )}
        </div>
      </div>

      {/* Selected Component Badge */}
      {selectedPart && (
        <div className="absolute top-4 right-4 p-2.5 px-3.5 rounded-xl bg-emerald-950/90 backdrop-blur-md border border-emerald-400 text-xs text-white shadow-xl flex items-center gap-2">
          <span className="text-emerald-400 font-bold">Selected:</span>
          <span className="font-heading font-black text-emerald-200">{selectedPart}</span>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10 pointer-events-none">
        <span>Click any organ component to inspect & hear Dr. Bio</span>
        <span>Drag to rotate 3D view</span>
      </div>
    </div>
  );
};
