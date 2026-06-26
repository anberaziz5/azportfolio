"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export function HeroTorus({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 18;
    camera.position.y = -6;
    camera.lookAt(0, 6, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    const isDark = resolvedTheme === "dark";
    const mainColor = 0xF6821F; // Primary orange
    const innerColor = 0xea580c; // Darker orange accent
    
    // Main outer wireframe torus
    const geometry = new THREE.TorusGeometry(14, 4, 32, 180);
    const material = new THREE.MeshBasicMaterial({
        color: mainColor,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.35 : 0.6
    });
    const torus = new THREE.Mesh(geometry, material);
    torus.position.y = 10;
    torus.rotation.x = Math.PI / 2.3;
    scene.add(torus);

    // Inner denser layer for a glowing core effect
    const innerGeometry = new THREE.TorusGeometry(14, 3.8, 16, 120);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: innerColor,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.15 : 0.3
    });
    const innerTorus = new THREE.Mesh(innerGeometry, innerMaterial);
    innerTorus.position.y = 10;
    innerTorus.rotation.x = Math.PI / 2.3;
    scene.add(innerTorus);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        torus.rotation.z = -elapsedTime * 0.05;
        innerTorus.rotation.z = -elapsedTime * 0.03;

        const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.015;
        torus.scale.set(scale, scale, scale);
        innerTorus.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        innerGeometry.dispose();
        innerMaterial.dispose();
    };
  }, [resolvedTheme]);

  return (
    <div className={`w-full h-full relative ${className}`}>
      {/* Subdued Ambient Glow */}
      <div 
        className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[100vw] h-[100vw] max-w-[1000px] max-h-[1000px] rounded-full z-0 pointer-events-none transition-colors duration-500" 
        style={{ 
          background: `radial-gradient(circle, ${resolvedTheme === 'dark' ? 'rgba(246, 130, 31, 0.15)' : 'rgba(246, 130, 31, 0.08)'} 0%, rgba(0,0,0,0) 60%)` 
        }}
      />
      {/* Canvas Container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)"
        }}
      />
    </div>
  );
}
