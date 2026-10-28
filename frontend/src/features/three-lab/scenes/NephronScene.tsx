import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface NephronSceneProps {
  ghp: number; // 50 - 70 mm Hg
  bop: number; // 25 - 35 mm Hg
  chp: number; // 10 - 20 mm Hg
  adhLevel: number; // 0 - 100%
  selectedPart?: string | null;
  onSelectPart?: (part: string) => void;
}

export const NephronScene: React.FC<NephronSceneProps> = ({
  ghp,
  bop,
  chp,
  adhLevel
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nfp = ghp - (bop + chp);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dirLight = new THREE.DirectionalLight(0xf59e0b, 1.4);
    dirLight.position.set(6, 8, 6);
    scene.add(dirLight);

    const nephronGroup = new THREE.Group();
    scene.add(nephronGroup);

    // Materials
    const capsuleMat = new THREE.MeshPhongMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.65,
      shininess: 90,
      side: THREE.DoubleSide
    });
    const glomerulusMat = new THREE.MeshPhongMaterial({ color: 0xef4444, shininess: 80 });
    const afferentMat = new THREE.MeshPhongMaterial({ color: 0xdc2626 });
    const efferentMat = new THREE.MeshPhongMaterial({ color: 0xb91c1c });
    const pctMat = new THREE.MeshPhongMaterial({ color: 0xfacc15, shininess: 60 });
    const henleMat = new THREE.MeshPhongMaterial({ color: 0x38bdf8, shininess: 60 });
    const ductMat = new THREE.MeshPhongMaterial({ color: 0xca8a04, shininess: 60 });

    // 1. Bowman's Capsule (hemispherical cup open on one side)
    const capsuleGeo = new THREE.SphereGeometry(2.0, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const capsuleMesh = new THREE.Mesh(capsuleGeo, capsuleMat);
    capsuleMesh.position.set(-2.5, 2.5, 0);
    capsuleMesh.rotation.x = Math.PI / 1.1;
    capsuleMesh.userData = { id: 'capsule', name: "Bowman's Capsule" };
    nephronGroup.add(capsuleMesh);

    // 2. Glomerulus (knotted ball of capillary vessels inside the cup)
    const glomerulusGeo = new THREE.TorusKnotGeometry(0.9, 0.28, 64, 16);
    const glomerulusMesh = new THREE.Mesh(glomerulusGeo, glomerulusMat);
    glomerulusMesh.position.set(-2.5, 2.5, 0);
    glomerulusMesh.userData = { id: 'glomerulus', name: "Glomerulus Capillary Tuft" };
    nephronGroup.add(glomerulusMesh);

    // 3. Afferent Arteriole (Wide lumen entering glomerulus)
    const afferentGeo = new THREE.CylinderGeometry(0.48, 0.48, 2.8, 16);
    const afferentMesh = new THREE.Mesh(afferentGeo, afferentMat);
    afferentMesh.position.set(-4.2, 4.2, 0.4);
    afferentMesh.rotation.z = -Math.PI / 4;
    nephronGroup.add(afferentMesh);

    // 4. Efferent Arteriole (Narrow lumen exiting glomerulus)
    const efferentGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.8, 16);
    const efferentMesh = new THREE.Mesh(efferentGeo, efferentMat);
    efferentMesh.position.set(-0.8, 4.2, -0.4);
    efferentMesh.rotation.z = Math.PI / 4;
    nephronGroup.add(efferentMesh);

    // 5. Proximal Convoluted Tubule (PCT) - Sinuous yellow tube
    const pctCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.5, 1.0, 0),
      new THREE.Vector3(-1.5, 0.2, 0.5),
      new THREE.Vector3(-0.5, 1.2, -0.5),
      new THREE.Vector3(0.5, 0.0, 0.2),
      new THREE.Vector3(0.0, -1.5, 0)
    ]);
    const pctGeo = new THREE.TubeGeometry(pctCurve, 40, 0.38, 16, false);
    const pctMesh = new THREE.Mesh(pctGeo, pctMat);
    nephronGroup.add(pctMesh);

    // 6. Loop of Henle (Hairpin U-turn extending deep into medulla)
    const henleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, -1.5, 0),
      new THREE.Vector3(0.2, -4.5, 0),
      new THREE.Vector3(0.8, -5.2, 0),
      new THREE.Vector3(1.4, -4.5, 0),
      new THREE.Vector3(1.6, -1.2, 0)
    ]);
    const henleGeo = new THREE.TubeGeometry(henleCurve, 40, 0.28, 16, false);
    const henleMesh = new THREE.Mesh(henleGeo, henleMat);
    nephronGroup.add(henleMesh);

    // 7. Distal Convoluted Tubule (DCT) & Collecting Duct
    const ductCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.6, -1.2, 0),
      new THREE.Vector3(2.5, 0.5, 0.4),
      new THREE.Vector3(3.5, 0.8, 0),
      new THREE.Vector3(3.5, -5.5, 0)
    ]);
    const ductGeo = new THREE.TubeGeometry(ductCurve, 40, 0.42, 16, false);
    const ductMesh = new THREE.Mesh(ductGeo, ductMat);
    nephronGroup.add(ductMesh);

    // Ultrafiltrate particles dropping through glomerulus into capsule
    const pCount = Math.max(10, Math.floor(nfp * 5));
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = -2.5 + (Math.random() - 0.5) * 1.2;
      pPos[i * 3 + 1] = 2.5 - Math.random() * 2.5;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xfef08a, size: 0.14, transparent: true, opacity: 0.8 });
    const pPoints = new THREE.Points(pGeo, pMat);
    nephronGroup.add(pPoints);

    // Drag rotation
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
        nephronGroup.rotation.y += dx * 0.008;
        nephronGroup.rotation.x += dy * 0.008;
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };
    const onMouseUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      // Animate filtrate flow
      const arr = pPoints.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        arr[i * 3 + 1] -= 0.03 * (nfp > 0 ? nfp / 10.0 : 0.1);
        if (arr[i * 3 + 1] < 0.2) {
          arr[i * 3 + 1] = 2.8;
          arr[i * 3] = -2.5 + (Math.random() - 0.5) * 1.0;
        }
      }
      pPoints.geometry.attributes.position.needsUpdate = true;

      if (!isDragging) {
        nephronGroup.rotation.y += 0.002;
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
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [ghp, bop, chp, adhLevel, nfp]);

  return (
    <div className="relative w-full h-[480px] rounded-2xl overflow-hidden bg-black/60 border border-wine-500/20">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-4 right-4 p-3 rounded-xl bg-black/80 border border-wine-500/30 text-xs font-mono space-y-1">
        <div className="text-white font-bold">Ultrafiltration Pressures:</div>
        <div className="text-emerald-400">Glomerular Hydrostatic (GHP): {ghp} mm Hg</div>
        <div className="text-red-400">Blood Colloid Osmotic (BOP): -{bop} mm Hg</div>
        <div className="text-amber-400">Capsular Hydrostatic (CHP): -{chp} mm Hg</div>
        <div className="pt-1 border-t border-white/10 font-bold text-wine-300">
          Net Filtration Pressure: {nfp} mm Hg
        </div>
      </div>
      <div className="absolute bottom-3 left-4 text-[11px] font-mono text-slate-400 bg-black/60 px-2.5 py-1 rounded-lg border border-white/10 pointer-events-none">
        Drag to rotate • Yellow: Filtrate • Red: Capillaries • Blue: Loop of Henle
      </div>
    </div>
  );
};
