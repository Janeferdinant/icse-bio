import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface EyeDefectSceneProps {
  visionMode: 'normal' | 'myopia' | 'myopia_corrected' | 'hyperopia' | 'hyperopia_corrected';
  accommodation: number; // 0 - 100%
  onSelectComponent?: (component: string) => void;
  selectedComponent?: string | null;
}

export const EyeDefectScene: React.FC<EyeDefectSceneProps> = ({
  visionMode,
  accommodation,
  onSelectComponent,
  selectedComponent
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectComponentRef = useRef(onSelectComponent);
  useEffect(() => {
    onSelectComponentRef.current = onSelectComponent;
  }, [onSelectComponent]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Cinematic Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const mainLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    mainLight.position.set(6, 6, 8);
    scene.add(mainLight);

    const backRimLight = new THREE.DirectionalLight(0xf59e0b, 1.0);
    backRimLight.position.set(-6, -6, -4);
    scene.add(backRimLight);

    const eyeGroup = new THREE.Group();
    scene.add(eyeGroup);

    const interactiveMeshes: THREE.Mesh[] = [];
    const registerPart = (mesh: THREE.Mesh, partName: string) => {
      mesh.userData = { partName };
      interactiveMeshes.push(mesh);
    };

    // Eyeball Axial Length scaling:
    // Myopia = elongated eyeball; Hyperopia = shortened eyeball; Normal = standard 4.2
    const isMyopic = visionMode === 'myopia' || visionMode === 'myopia_corrected';
    const isHyperopic = visionMode === 'hyperopia' || visionMode === 'hyperopia_corrected';
    const eyeballScaleX = isMyopic ? 1.18 : isHyperopic ? 0.88 : 1.0;
    const retinaBackX = 4.2 * eyeballScaleX;

    // Materials
    const scleraMat = new THREE.MeshPhongMaterial({
      color: 0xf8fafc,
      specular: 0x94a3b8,
      shininess: 60,
      side: THREE.DoubleSide
    });

    const choroidMat = new THREE.MeshPhongMaterial({
      color: 0x451a03, // Dark brown vascular layer
      side: THREE.DoubleSide
    });

    const retinaMat = new THREE.MeshPhongMaterial({
      color: 0xf59e0b, // Amber sensory retina
      emissive: 0x78350f,
      side: THREE.DoubleSide,
      shininess: 40
    });

    const foveaMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    const corneaMat = new THREE.MeshPhongMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
      specular: 0xffffff,
      shininess: 120,
      side: THREE.DoubleSide
    });

    const irisMat = new THREE.MeshPhongMaterial({
      color: 0x0284c7, // Vibrant azure iris
      emissive: 0x075985,
      shininess: 80
    });

    const lensMat = new THREE.MeshPhongMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.72,
      specular: 0xffffff,
      shininess: 110
    });

    const ciliaryMat = new THREE.MeshPhongMaterial({
      color: 0xec4899,
      emissive: 0x831843,
      shininess: 70
    });

    const opticNerveMat = new THREE.MeshPhongMaterial({
      color: 0xe2e8f0,
      shininess: 10
    });

    // 1. Sclera (Outer White Coat) - Sagittal hemisphere cut
    const scleraGeo = new THREE.SphereGeometry(3.6, 40, 24, 0, Math.PI * 1.5, 0, Math.PI);
    scleraGeo.scale(eyeballScaleX, 1, 1);
    const scleraMesh = new THREE.Mesh(scleraGeo, scleraMat);
    scleraMesh.rotation.y = Math.PI * 0.25;
    scleraMesh.position.set(0.6, 0, 0);
    registerPart(scleraMesh, 'Sclera');
    eyeGroup.add(scleraMesh);

    // 2. Choroid (Middle Vascular Layer)
    const choroidGeo = new THREE.SphereGeometry(3.52, 36, 20, 0, Math.PI * 1.45, 0, Math.PI);
    choroidGeo.scale(eyeballScaleX, 1, 1);
    const choroidMesh = new THREE.Mesh(choroidGeo, choroidMat);
    choroidMesh.rotation.y = Math.PI * 0.25;
    choroidMesh.position.set(0.6, 0, 0);
    eyeGroup.add(choroidMesh);

    // 3. Retina (Inner Light-Sensitive Layer)
    const retinaGeo = new THREE.SphereGeometry(3.45, 36, 20, 0, Math.PI * 1.1, 0, Math.PI);
    retinaGeo.scale(eyeballScaleX, 1, 1);
    const retinaMesh = new THREE.Mesh(retinaGeo, retinaMat);
    retinaMesh.rotation.y = Math.PI * 0.45;
    retinaMesh.position.set(0.6, 0, 0);
    registerPart(retinaMesh, 'Retina');
    eyeGroup.add(retinaMesh);

    // Fovea Centralis (Yellow spot / pinpoint pit at center of retina)
    const foveaGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const foveaMesh = new THREE.Mesh(foveaGeo, foveaMat);
    foveaMesh.position.set(retinaBackX, 0, 0);
    registerPart(foveaMesh, 'Fovea');
    eyeGroup.add(foveaMesh);

    // 4. Optic Nerve (Posterior nerve bundle exiting eye)
    const opticGeo = new THREE.CylinderGeometry(0.55, 0.65, 2.8, 20);
    const opticMesh = new THREE.Mesh(opticGeo, opticNerveMat);
    opticMesh.position.set(retinaBackX + 1.2, -0.6, 0);
    opticMesh.rotation.z = Math.PI / 2 + 0.25;
    registerPart(opticMesh, 'Optic Nerve');
    eyeGroup.add(opticMesh);

    // 5. Cornea (Clear anterior dome bulge)
    const corneaGeo = new THREE.SphereGeometry(1.8, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.42);
    const corneaMesh = new THREE.Mesh(corneaGeo, corneaMat);
    corneaMesh.position.set(-2.2, 0, 0);
    corneaMesh.rotation.y = -Math.PI / 2;
    registerPart(corneaMesh, 'Cornea');
    eyeGroup.add(corneaMesh);

    // 6. Iris & Pupil Aperture
    const irisShape = new THREE.Shape();
    irisShape.absarc(0, 0, 1.6, 0, Math.PI * 2, false);
    const pupilHole = new THREE.Path();
    pupilHole.absarc(0, 0, 0.65, 0, Math.PI * 2, true);
    irisShape.holes.push(pupilHole);

    const irisGeo = new THREE.ShapeGeometry(irisShape, 32);
    const irisMesh = new THREE.Mesh(irisGeo, irisMat);
    irisMesh.position.set(-1.6, 0, 0);
    irisMesh.rotation.y = Math.PI / 2;
    registerPart(irisMesh, 'Iris & Pupil');
    eyeGroup.add(irisMesh);

    // 7. Ciliary Body & Suspensory Zonule Ligaments
    const ciliaryRingGeo = new THREE.TorusGeometry(1.7, 0.18, 16, 32);
    const ciliaryMesh = new THREE.Mesh(ciliaryRingGeo, ciliaryMat);
    ciliaryMesh.position.set(-1.0, 0, 0);
    ciliaryMesh.rotation.y = Math.PI / 2;
    registerPart(ciliaryMesh, 'Ciliary Muscle');
    eyeGroup.add(ciliaryMesh);

    // Suspensory Zonules (fine radial connective fibers)
    const zonuleGroup = new THREE.Group();
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const zPts = [
        new THREE.Vector3(-1.0, Math.cos(a) * 1.25, Math.sin(a) * 1.25),
        new THREE.Vector3(-1.0, Math.cos(a) * 1.65, Math.sin(a) * 1.65)
      ];
      const zGeo = new THREE.BufferGeometry().setFromPoints(zPts);
      const zLine = new THREE.Line(zGeo, new THREE.LineBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.6 }));
      zonuleGroup.add(zLine);
    }
    eyeGroup.add(zonuleGroup);

    // 8. Crystalline Lens (Biconvex lens with variable thickness)
    const lensThickness = 0.45 + (accommodation / 100.0) * 0.4;
    const lensGeo = new THREE.SphereGeometry(1.35, 32, 24);
    lensGeo.scale(lensThickness, 1.25, 1.25);
    const lensMesh = new THREE.Mesh(lensGeo, lensMat);
    lensMesh.position.set(-1.0, 0, 0);
    registerPart(lensMesh, 'Crystalline Lens');
    eyeGroup.add(lensMesh);

    // 9. Corrective Glasses Lens (if corrected mode)
    if (visionMode === 'myopia_corrected') {
      // Concave diverging lens (thinner center, thicker rim)
      const glassesGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.2, 32);
      glassesGeo.scale(0.8, 1, 1);
      const glassesMat = new THREE.MeshPhongMaterial({
        color: 0xec4899,
        transparent: true,
        opacity: 0.6,
        shininess: 100,
        specular: 0xffffff
      });
      const glassesMesh = new THREE.Mesh(glassesGeo, glassesMat);
      glassesMesh.position.set(-4.2, 0, 0);
      glassesMesh.rotation.z = Math.PI / 2;
      eyeGroup.add(glassesMesh);
    } else if (visionMode === 'hyperopia_corrected') {
      // Convex converging lens (biconvex)
      const glassesGeo = new THREE.SphereGeometry(1.5, 32, 24);
      glassesGeo.scale(0.25, 1.25, 1.25);
      const glassesMat = new THREE.MeshPhongMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.6,
        shininess: 100,
        specular: 0xffffff
      });
      const glassesMesh = new THREE.Mesh(glassesGeo, glassesMat);
      glassesMesh.position.set(-4.2, 0, 0);
      eyeGroup.add(glassesMesh);
    }

    // 10. Optical Light Rays & Convergence Point
    // Normal / Corrected: converge on retinaBackX
    // Myopia uncorrected: converge in front (~2.9)
    // Hyperopia uncorrected: converge behind (~5.8)
    let focalX = retinaBackX;
    if (visionMode === 'myopia') {
      focalX = 2.9;
    } else if (visionMode === 'hyperopia') {
      focalX = 5.6;
    }

    const raysGroup = new THREE.Group();
    const rayHeights = [-0.9, -0.45, 0, 0.45, 0.9];

    rayHeights.forEach((h) => {
      const pts: THREE.Vector3[] = [];
      const startX = -8.5;
      pts.push(new THREE.Vector3(startX, h, 0));

      if (visionMode === 'myopia_corrected') {
        pts.push(new THREE.Vector3(-4.2, h, 0));
        pts.push(new THREE.Vector3(-2.2, h * 1.15, 0)); // diverged by concave
      } else if (visionMode === 'hyperopia_corrected') {
        pts.push(new THREE.Vector3(-4.2, h, 0));
        pts.push(new THREE.Vector3(-2.2, h * 0.85, 0)); // converged by convex
      } else {
        pts.push(new THREE.Vector3(-2.2, h, 0)); // hit cornea
      }

      // Enter cornea & reach lens
      pts.push(new THREE.Vector3(-1.0, h * 0.75, 0));
      // Converge from lens to focalX
      pts.push(new THREE.Vector3(focalX, 0, 0));

      // If focalX is in front of retina (myopia), rays continue diverging to hit the retina
      if (visionMode === 'myopia') {
        const blurSpread = (retinaBackX - focalX) * (h * 0.35);
        pts.push(new THREE.Vector3(retinaBackX, -blurSpread, 0));
      }

      const rGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const rMat = new THREE.LineBasicMaterial({
        color: 0xfde047,
        linewidth: 2,
        transparent: true,
        opacity: 0.9
      });
      const rLine = new THREE.Line(rGeo, rMat);
      raysGroup.add(rLine);
    });

    // Glowing Focal Point
    const focalPointGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const focalPointMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const focalMesh = new THREE.Mesh(focalPointGeo, focalPointMat);
    focalMesh.position.set(focalX, 0, 0);
    raysGroup.add(focalMesh);

    eyeGroup.add(raysGroup);

    // Raycaster for interactive part clicks
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
          onSelectComponentRef.current?.(hit.userData.partName);
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
        eyeGroup.rotation.y += dx * 0.007;
        eyeGroup.rotation.x += dy * 0.007;
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

      // Subtle pulse on focal point
      focalMesh.scale.setScalar(1.0 + Math.sin(elapsed * 4.0) * 0.15);

      if (!isDragging) {
        eyeGroup.rotation.y = Math.sin(elapsed * 0.4) * 0.05;
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
  }, [visionMode, accommodation]);

  const getDefectDescription = () => {
    switch (visionMode) {
      case 'normal':
        return {
          title: 'Normal Vision (Emmetropia)',
          desc: 'Light rays focus directly on the retina/fovea bullseye! Vision is crisp and clear.',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        };
      case 'myopia':
        return {
          title: 'Myopia (Nearsightedness)',
          desc: 'Eyeball is too long! Light rays converge in front of the retina, causing distant objects to look blurry.',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        };
      case 'myopia_corrected':
        return {
          title: 'Myopia Corrected (Concave Lens)',
          desc: 'A diverging concave lens spreads light rays slightly before the cornea, shifting focus back onto the retina!',
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40'
        };
      case 'hyperopia':
        return {
          title: 'Hyperopia (Farsightedness)',
          desc: 'Eyeball is too short! Light rays converge behind the retina, making close objects difficult to see.',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
      case 'hyperopia_corrected':
        return {
          title: 'Hyperopia Corrected (Convex Lens)',
          desc: 'A converging convex lens pre-bends light rays inward, allowing the eye lens to focus them onto the retina!',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        };
    }
  };

  const status = getDefectDescription();

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden bg-black/80 border border-sky-500/30 shadow-2xl">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Status Header */}
      <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-sky-500/30 text-xs font-mono space-y-1.5 shadow-lg max-w-sm">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <span>{status.title}</span>
        </div>
        <div className="text-slate-300">
          Lens Accommodation: <strong className="text-sky-300">{accommodation}%</strong>
        </div>
        <div className="pt-1 border-t border-white/10 text-xs font-sans">
          <p className="text-slate-300 leading-relaxed">{status.desc}</p>
        </div>
      </div>

      {/* Selected Component Badge */}
      {selectedComponent && (
        <div className="absolute top-4 right-4 p-2.5 px-3.5 rounded-xl bg-sky-950/90 backdrop-blur-md border border-sky-400 text-xs text-white shadow-xl flex items-center gap-2">
          <span className="text-sky-400 font-bold">Selected:</span>
          <span className="font-heading font-black text-sky-200">{selectedComponent}</span>
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
