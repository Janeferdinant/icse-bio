import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DnaHelixSceneProps {
  rotationSpeed: number;
  uncoilLevel: number; // 0 - 100%
  highlightBasePairs: boolean;
}

export const DnaHelixScene: React.FC<DnaHelixSceneProps> = ({
  rotationSpeed,
  uncoilLevel,
  highlightBasePairs
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dirLight1 = new THREE.DirectionalLight(0x818cf8, 1.5);
    dirLight1.position.set(6, 10, 6);
    scene.add(dirLight1);

    const dnaGroup = new THREE.Group();
    scene.add(dnaGroup);

    // Materials
    const backbone1Mat = new THREE.MeshPhongMaterial({ color: 0x6366f1, shininess: 80 }); // Blue-indigo 5'->3'
    const backbone2Mat = new THREE.MeshPhongMaterial({ color: 0xa855f7, shininess: 80 }); // Purple 3'->5'
    const aMat = new THREE.MeshPhongMaterial({ color: 0x22c55e, shininess: 60 }); // Adenine (Green)
    const tMat = new THREE.MeshPhongMaterial({ color: 0xef4444, shininess: 60 }); // Thymine (Red)
    const cMat = new THREE.MeshPhongMaterial({ color: 0x06b6d4, shininess: 60 }); // Cytosine (Cyan)
    const gMat = new THREE.MeshPhongMaterial({ color: 0xfacc15, shininess: 60 }); // Guanine (Yellow)
    const histoneMat = new THREE.MeshPhongMaterial({ color: 0xf97316, transparent: true, opacity: 0.85, shininess: 90 });

    const totalRungs = 28;
    const radius = 1.8 + (uncoilLevel / 100.0) * 1.5;
    const heightPitch = 0.35 + (uncoilLevel / 100.0) * 0.15;

    // Build base pairs and rungs
    for (let i = 0; i < totalRungs; i++) {
      const angle = (i * 0.5) * (1.0 - (uncoilLevel / 100.0) * 0.4);
      const y = (i - totalRungs / 2) * heightPitch;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      // Backbone Spheres (Sugar-Phosphate nodes)
      const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), backbone1Mat);
      b1.position.set(x1, y, z1);
      dnaGroup.add(b1);

      const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), backbone2Mat);
      b2.position.set(x2, y, z2);
      dnaGroup.add(b2);

      // Base pair rungs (split in half at hydrogen bonds)
      const isAT = i % 2 === 0;
      const matLeft = isAT ? aMat : cMat;
      const matRight = isAT ? tMat : gMat;

      // Left half rung
      const half1Curve = new THREE.LineCurve3(new THREE.Vector3(x1, y, z1), new THREE.Vector3(0, y, 0));
      const r1Mesh = new THREE.Mesh(new THREE.TubeGeometry(half1Curve, 8, 0.1, 8, false), matLeft);
      dnaGroup.add(r1Mesh);

      // Right half rung
      const half2Curve = new THREE.LineCurve3(new THREE.Vector3(0, y, 0), new THREE.Vector3(x2, y, z2));
      const r2Mesh = new THREE.Mesh(new THREE.TubeGeometry(half2Curve, 8, 0.1, 8, false), matRight);
      dnaGroup.add(r2Mesh);
    }

    // Histone Octamer Protein Core (visible when uncoiling)
    if (uncoilLevel > 20) {
      const histoneMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 2.2, 24), histoneMat);
      histoneMesh.position.set(0, 0, 0);
      dnaGroup.add(histoneMesh);
    }

    // Drag to rotate
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
        dnaGroup.rotation.y += dx * 0.008;
        dnaGroup.rotation.x += dy * 0.008;
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
      if (!isDragging) {
        dnaGroup.rotation.y += 0.015 * rotationSpeed;
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
  }, [rotationSpeed, uncoilLevel, highlightBasePairs]);

  return (
    <div className="relative w-full h-[480px] rounded-2xl overflow-hidden bg-black/60 border border-wine-500/20">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/80 border border-indigo-500/30 text-xs font-mono space-y-1">
        <div className="text-white font-bold">DNA Complementary Base-Pairing:</div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold">Adenine (A) = Thymine (T) [2 H-bonds]</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-bold">Guanine (G) ≡ Cytosine (C) [3 H-bonds]</span>
        </div>
        <div className="text-purple-300">Antiparallel Sugar-Phosphate Strands: 5' → 3' & 3' → 5'</div>
      </div>
      <div className="absolute bottom-3 left-4 text-[11px] font-mono text-slate-400 bg-black/60 px-2.5 py-1 rounded-lg border border-white/10 pointer-events-none">
        Drag to rotate • Orange: Histone Octamer Core • Blue/Purple: Sugar-Phosphate Backbones
      </div>
    </div>
  );
};
