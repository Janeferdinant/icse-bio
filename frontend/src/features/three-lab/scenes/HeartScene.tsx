import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeartSceneProps {
  heartRate: number; // 40 - 180 bpm
  isPumping: boolean;
  activeChamber?: string | null;
  onSelectChamber?: (chamber: string) => void;
  showValves?: boolean;
  bloodFlowSpeed: number;
}

export const HeartScene: React.FC<HeartSceneProps> = ({
  heartRate,
  isPumping,
  activeChamber,
  onSelectChamber,
  bloodFlowSpeed
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectChamberRef = useRef(onSelectChamber);
  useEffect(() => {
    onSelectChamberRef.current = onSelectChamber;
  }, [onSelectChamber]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0407);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Cinematic Biological Lighting
    scene.add(new THREE.AmbientLight(0xffe4e6, 0.8));
    const keyLight = new THREE.DirectionalLight(0xff859a, 1.6);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    const blueBackLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    blueBackLight.position.set(-8, -4, 4);
    scene.add(blueBackLight);

    const heartGroup = new THREE.Group();
    scene.add(heartGroup);

    const interactiveMeshes: THREE.Mesh[] = [];
    const registerPart = (mesh: THREE.Mesh, partName: string) => {
      mesh.userData = { partName };
      interactiveMeshes.push(mesh);
    };

    // Materials
    // Blue Deoxygenated Heart Chambers
    const raMat = new THREE.MeshPhongMaterial({
      color: 0x1d4ed8,
      specular: 0x60a5fa,
      shininess: 60,
      transparent: true,
      opacity: 0.88
    });
    const rvMat = new THREE.MeshPhongMaterial({
      color: 0x1e40af,
      specular: 0x3b82f6,
      shininess: 70,
      transparent: true,
      opacity: 0.88
    });

    // Red Oxygenated Heart Chambers
    const laMat = new THREE.MeshPhongMaterial({
      color: 0xb91c1c,
      specular: 0xf87171,
      shininess: 70,
      transparent: true,
      opacity: 0.88
    });
    // Left Ventricle with thick muscular myocardium
    const lvMat = new THREE.MeshPhongMaterial({
      color: 0x881337, // Deep rich myocardial crimson
      emissive: 0x4c0519,
      specular: 0xfb7185,
      shininess: 85,
      transparent: true,
      opacity: 0.92
    });

    // Vessel Materials
    const vesselRedMat = new THREE.MeshPhongMaterial({
      color: 0xdc2626,
      emissive: 0x7f1d1d,
      specular: 0xfca5a5,
      shininess: 90
    });
    const vesselBlueMat = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
      emissive: 0x1e3a8a,
      specular: 0x93c5fd,
      shininess: 90
    });

    // Septum Material (Thick central muscular divide)
    const septumMat = new THREE.MeshPhongMaterial({
      color: 0x9f1239,
      specular: 0xf43f5e,
      shininess: 60
    });

    // Valve Cusps Material (translucent pale ivory)
    const valveCuspMat = new THREE.MeshPhongMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });

    // Chordae Tendineae Material ("Heart Strings")
    const stringMat = new THREE.LineBasicMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0.9,
      linewidth: 2
    });

    // Papillary Muscles Material
    const papillaryMat = new THREE.MeshPhongMaterial({
      color: 0x9f1239,
      shininess: 50
    });

    // 1. Right Atrium (Upper Right / Left in anatomical view)
    const raGeo = new THREE.SphereGeometry(1.7, 32, 24);
    raGeo.scale(1.0, 1.25, 0.9);
    const raMesh = new THREE.Mesh(raGeo, raMat);
    raMesh.position.set(-1.85, 1.4, 0);
    registerPart(raMesh, 'Right Atrium');
    heartGroup.add(raMesh);

    // 2. Right Ventricle (Lower Right / Left view)
    const rvGeo = new THREE.ConeGeometry(1.9, 3.4, 32);
    rvGeo.scale(1.1, 1.0, 0.85);
    const rvMesh = new THREE.Mesh(rvGeo, rvMat);
    rvMesh.position.set(-1.45, -1.2, 0);
    rvMesh.rotation.z = 0.16;
    registerPart(rvMesh, 'Right Ventricle');
    heartGroup.add(rvMesh);

    // 3. Left Atrium (Upper Left / Right in view)
    const laGeo = new THREE.SphereGeometry(1.6, 32, 24);
    laGeo.scale(1.0, 1.15, 0.9);
    const laMesh = new THREE.Mesh(laGeo, laMat);
    laMesh.position.set(1.65, 1.5, -0.2);
    registerPart(laMesh, 'Left Atrium');
    heartGroup.add(laMesh);

    // 4. Left Ventricle (Thick Myocardium forming the Heart Apex)
    const lvGeo = new THREE.ConeGeometry(2.35, 4.3, 32);
    lvGeo.scale(1.15, 1.0, 1.0);
    const lvMesh = new THREE.Mesh(lvGeo, lvMat);
    lvMesh.position.set(1.2, -1.6, 0);
    lvMesh.rotation.z = -0.26;
    registerPart(lvMesh, 'Left Ventricle');
    heartGroup.add(lvMesh);

    // 5. Interventricular Septum (Thick central muscular divide)
    const septumGeo = new THREE.BoxGeometry(0.55, 3.8, 1.5);
    const septumMesh = new THREE.Mesh(septumGeo, septumMat);
    septumMesh.position.set(-0.1, -1.3, 0);
    septumMesh.rotation.z = -0.06;
    heartGroup.add(septumMesh);

    // 6. Superior & Inferior Vena Cava (SVC & IVC entering RA)
    const svcGeo = new THREE.CylinderGeometry(0.52, 0.52, 2.8, 20);
    const svcMesh = new THREE.Mesh(svcGeo, vesselBlueMat);
    svcMesh.position.set(-2.4, 3.2, -0.2);
    registerPart(svcMesh, 'Right Atrium');
    heartGroup.add(svcMesh);

    const ivcGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.0, 20);
    const ivcMesh = new THREE.Mesh(ivcGeo, vesselBlueMat);
    ivcMesh.position.set(-2.2, -3.2, -0.2);
    heartGroup.add(ivcMesh);

    // 7. Aorta Trunk & Arch with 3 Branch Arteries
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.4, 0.2, 0),
      new THREE.Vector3(0.7, 2.6, 0.3),
      new THREE.Vector3(0.1, 4.2, 0.1),
      new THREE.Vector3(-1.2, 3.8, -0.4),
      new THREE.Vector3(-1.6, 1.5, -0.8)
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 40, 0.62, 20, false);
    const aortaMesh = new THREE.Mesh(aortaGeo, vesselRedMat);
    registerPart(aortaMesh, 'Aorta');
    heartGroup.add(aortaMesh);

    // 3 Aortic Arch Branch Vessels (Brachiocephalic, Carotid, Subclavian)
    const branchPositions = [
      { x: 0.45, y: 3.9, z: 0.2, h: 1.4, name: 'Brachiocephalic Artery' },
      { x: -0.2, y: 4.3, z: 0.0, h: 1.6, name: 'Left Common Carotid' },
      { x: -0.8, y: 4.1, z: -0.2, h: 1.4, name: 'Left Subclavian' }
    ];
    branchPositions.forEach((b) => {
      const bGeo = new THREE.CylinderGeometry(0.2, 0.2, b.h, 16);
      const bMesh = new THREE.Mesh(bGeo, vesselRedMat);
      bMesh.position.set(b.x, b.y, b.z);
      registerPart(bMesh, 'Aorta');
      heartGroup.add(bMesh);
    });

    // 8. Pulmonary Trunk & Arteries (Arising from RV)
    const paCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.7, 0.1, 0.4),
      new THREE.Vector3(-0.35, 2.3, 0.6),
      new THREE.Vector3(0.8, 2.8, 0.2)
    ]);
    const paGeo = new THREE.TubeGeometry(paCurve, 32, 0.54, 20, false);
    const paMesh = new THREE.Mesh(paGeo, vesselBlueMat);
    heartGroup.add(paMesh);

    // 9. Valves with Chordae Tendineae ("Heart Strings") & Papillary Muscles
    // A. Tricuspid Valve (RA -> RV)
    const tricuspidRing = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.08, 12, 32), valveCuspMat);
    tricuspidRing.position.set(-1.65, 0.15, 0.1);
    tricuspidRing.rotation.x = Math.PI / 2;
    registerPart(tricuspidRing, 'Tricuspid Valve');
    heartGroup.add(tricuspidRing);

    // Tricuspid Papillary Muscle in RV
    const rvPapillaryGeo = new THREE.CylinderGeometry(0.2, 0.35, 1.0, 12);
    const rvPapillary = new THREE.Mesh(rvPapillaryGeo, papillaryMat);
    rvPapillary.position.set(-1.6, -1.8, 0.2);
    rvPapillary.rotation.z = -0.2;
    heartGroup.add(rvPapillary);

    // Chordae Tendineae strings connecting Tricuspid to Papillary
    const rvStrings = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const sPts = [
        new THREE.Vector3(-1.65 + Math.cos(ang) * 0.65, 0.15, 0.1 + Math.sin(ang) * 0.65),
        new THREE.Vector3(-1.6, -1.4, 0.2)
      ];
      const sGeo = new THREE.BufferGeometry().setFromPoints(sPts);
      const sLine = new THREE.Line(sGeo, stringMat);
      rvStrings.add(sLine);
    }
    registerPart(rvPapillary, 'Chordae Tendineae');
    heartGroup.add(rvStrings);

    // B. Bicuspid / Mitral Valve (LA -> LV)
    const mitralRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.08, 12, 32), valveCuspMat);
    mitralRing.position.set(1.4, 0.2, 0.1);
    mitralRing.rotation.x = Math.PI / 2;
    registerPart(mitralRing, 'Bicuspid / Mitral Valve');
    heartGroup.add(mitralRing);

    // Mitral Papillary Muscle in thick LV
    const lvPapillaryGeo = new THREE.CylinderGeometry(0.28, 0.45, 1.2, 12);
    const lvPapillary = new THREE.Mesh(lvPapillaryGeo, papillaryMat);
    lvPapillary.position.set(1.4, -2.2, 0.2);
    lvPapillary.rotation.z = 0.2;
    heartGroup.add(lvPapillary);

    // Chordae Tendineae strings connecting Mitral to Papillary
    const lvStrings = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const sPts = [
        new THREE.Vector3(1.4 + Math.cos(ang) * 0.7, 0.2, 0.1 + Math.sin(ang) * 0.7),
        new THREE.Vector3(1.4, -1.7, 0.2)
      ];
      const sGeo = new THREE.BufferGeometry().setFromPoints(sPts);
      const sLine = new THREE.Line(sGeo, stringMat);
      lvStrings.add(sLine);
    }
    registerPart(lvPapillary, 'Chordae Tendineae');
    heartGroup.add(lvStrings);

    // 10. Circulating Blood Corpuscle Particles
    // Blue Deoxygenated stream: Vena Cava -> RA -> RV -> Pulmonary Trunk
    const blueCount = 110;
    const bluePositions = new Float32Array(blueCount * 3);
    for (let i = 0; i < blueCount; i++) {
      bluePositions[i * 3] = -2.1 + (Math.random() - 0.5) * 1.6;
      bluePositions[i * 3 + 1] = 3.2 - Math.random() * 5.8;
      bluePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    }
    const blueGeo = new THREE.BufferGeometry();
    blueGeo.setAttribute('position', new THREE.BufferAttribute(bluePositions, 3));
    const blueParticleMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.22,
      transparent: true,
      opacity: 0.95
    });
    const particlesBlue = new THREE.Points(blueGeo, blueParticleMat);
    heartGroup.add(particlesBlue);

    // Red Oxygenated stream: Pulmonary Vein -> LA -> LV -> Aorta Arch
    const redCount = 110;
    const redPositions = new Float32Array(redCount * 3);
    for (let i = 0; i < redCount; i++) {
      redPositions[i * 3] = 1.1 + (Math.random() - 0.5) * 1.6;
      redPositions[i * 3 + 1] = -2.6 + Math.random() * 6.5;
      redPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    }
    const redGeo = new THREE.BufferGeometry();
    redGeo.setAttribute('position', new THREE.BufferAttribute(redPositions, 3));
    const redParticleMat = new THREE.PointsMaterial({
      color: 0xf87171,
      size: 0.24,
      transparent: true,
      opacity: 0.95
    });
    const particlesRed = new THREE.Points(redGeo, redParticleMat);
    heartGroup.add(particlesRed);

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
          onSelectChamberRef.current?.(hit.userData.partName);
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
        heartGroup.rotation.y += dx * 0.007;
        heartGroup.rotation.x += dy * 0.007;
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

      // Cardiac Pumping Cycle based on heartRate
      const bps = heartRate / 60.0;
      const cyclePhase = (elapsed * bps * Math.PI * 2) % (Math.PI * 2);

      // Phase 1: Atrial Systole (sin peak)
      const atrialBeat = 1.0 + (isPumping ? Math.sin(cyclePhase) * 0.07 : 0);
      raMesh.scale.set(1.0 * atrialBeat, 1.25 * atrialBeat, 0.9 * atrialBeat);
      laMesh.scale.set(1.0 * atrialBeat, 1.15 * atrialBeat, 0.9 * atrialBeat);

      // Phase 2: Ventricular Systole (delayed cos peak)
      const ventBeat = 1.0 + (isPumping ? Math.cos(cyclePhase - 0.5) * 0.09 : 0);
      rvMesh.scale.set(1.1 * ventBeat, 1.0 * ventBeat, 0.85 * ventBeat);
      lvMesh.scale.set(1.15 * ventBeat, 1.0 * ventBeat, 1.0 * ventBeat);

      // Valves open/close rhythm
      const valvePulse = Math.sin(cyclePhase);
      tricuspidRing.scale.setScalar(1.0 + valvePulse * 0.08);
      mitralRing.scale.setScalar(1.0 + valvePulse * 0.08);

      // Animate blue particles downward through right heart into PA
      const bPos = (particlesBlue.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < blueCount; i++) {
        bPos[i * 3 + 1] -= 0.05 * bloodFlowSpeed;
        if (bPos[i * 3 + 1] < -3.2) {
          bPos[i * 3 + 1] = 3.6;
          bPos[i * 3] = -2.1 + (Math.random() - 0.5) * 1.2;
        }
      }
      particlesBlue.geometry.attributes.position.needsUpdate = true;

      // Animate red particles upward through left heart into Aorta
      const rPos = (particlesRed.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < redCount; i++) {
        rPos[i * 3 + 1] += 0.06 * bloodFlowSpeed;
        if (rPos[i * 3 + 1] > 4.4) {
          rPos[i * 3 + 1] = -2.5;
          rPos[i * 3] = 1.1 + (Math.random() - 0.5) * 1.2;
        }
      }
      particlesRed.geometry.attributes.position.needsUpdate = true;

      if (!isDragging) {
        heartGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.06;
      }

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
  }, [heartRate, isPumping, bloodFlowSpeed]);

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden bg-black/80 border border-rose-500/30 shadow-2xl">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Status Header */}
      <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-rose-500/30 text-xs font-mono space-y-1.5 shadow-lg">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span>Realistic 4-Chamber Heart Cross-Section</span>
        </div>
        <div className="text-slate-300">
          Heart Rate: <strong className="text-rose-400">{heartRate} BPM</strong>
        </div>
        <div className="text-slate-300">
          Circulation Velocity: <strong className="text-sky-400">{(bloodFlowSpeed * 32).toFixed(0)} cm/s</strong>
        </div>
        <div className="pt-1 border-t border-white/10 text-xs font-sans">
          <span className="text-rose-300 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40">
            {isPumping ? "❤️ PUMPING: Atrial & Ventricular Systole Active" : "⏸️ PAUSED"}
          </span>
        </div>
      </div>

      {/* Selected Chamber Badge */}
      {activeChamber && (
        <div className="absolute top-4 right-4 p-2.5 px-3.5 rounded-xl bg-rose-950/90 backdrop-blur-md border border-rose-400 text-xs text-white shadow-xl flex items-center gap-2">
          <span className="text-rose-400 font-bold">Inspecting:</span>
          <span className="font-heading font-black text-rose-200">{activeChamber}</span>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10 pointer-events-none">
        <span>Click any chamber or valve to inspect & hear Dr. Bio</span>
        <span>Drag to rotate 3D view</span>
      </div>
    </div>
  );
};
