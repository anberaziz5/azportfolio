"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface RotatingEarthProps {
  width?: number;
  height?: number;
  className?: string;
}

interface LocationData {
  lng: number;
  lat: number;
  city: string;
  country: string;
}

export function RotatingEarth({ width = 800, height = 600, className = "" }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visitorLocationRef = useRef<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Set up responsive dimensions
    const containerWidth = Math.min(width, window.innerWidth - 40);
    const containerHeight = Math.min(height, window.innerHeight - 100);
    const radius = Math.min(containerWidth, containerHeight) / 2.5;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    // Create projection and path generator
    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);

    // --- GEOLOCATION LOGIC ---
    const fetchIPFallback = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) throw new Error("IP fetch failed");
        const data = await response.json();
        return {
          lat: data.latitude,
          lng: data.longitude,
          city: data.city,
          country: data.country_name,
        };
      } catch (err) {
        console.warn("IP Fallback failed:", err);
        return null;
      }
    };

    const fetchLocation = async () => {
      const handleSuccess = async (lat: number, lng: number) => {
        try {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=\${lat}&longitude=\${lng}&localityLanguage=en`
          );
          const geoData = await geoRes.json();
          
          visitorLocationRef.current = {
            lat,
            lng,
            city: geoData.city || geoData.locality || "Unknown City",
            country: geoData.countryName || "Unknown Country",
          };
          
          // Auto-center the globe on the visitor
          rotation[0] = -lng;
          rotation[1] = -lat;
          projection.rotate(rotation as [number, number, number]);
        } catch (e) {
          console.warn("Reverse geocoding failed", e);
        }
      };

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await handleSuccess(position.coords.latitude, position.coords.longitude);
          },
          async (err) => {
            console.warn("Browser geolocation denied/failed. Falling back to IP.", err);
            const ipData = await fetchIPFallback();
            if (ipData) {
              visitorLocationRef.current = ipData;
              rotation[0] = -ipData.lng;
              rotation[1] = -ipData.lat;
              projection.rotate(rotation as [number, number, number]);
            }
          },
          { timeout: 5000 }
        );
      } else {
        const ipData = await fetchIPFallback();
        if (ipData) {
          visitorLocationRef.current = ipData;
          rotation[0] = -ipData.lng;
          rotation[1] = -ipData.lat;
          projection.rotate(rotation as [number, number, number]);
        }
      }
    };

    // --- DOT GENERATION UTILS ---
    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point;
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry;
      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates;
        if (!pointInPolygon(point, coordinates[0])) return false;
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) return false;
        }
        return true;
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false;
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true;
                break;
              }
            }
            if (!inHole) return true;
          }
        }
      }
      return false;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = [];
      const bounds = d3.geoBounds(feature);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;
      const stepSize = dotSpacing * 0.08;

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat];
          if (pointInFeature(point, feature)) dots.push(point);
        }
      }
      return dots;
    };

    const allDots: { lng: number; lat: number }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let landFeatures: any;

    // --- RENDER LOOP ---
    const render = (elapsed: number) => {
      context.clearRect(0, 0, containerWidth, containerHeight);
      const currentScale = projection.scale();
      const scaleFactor = currentScale / radius;

      // Draw ocean
      context.beginPath();
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI);
      context.fillStyle = "rgba(0, 0, 0, 0.2)";
      context.fill();
      context.strokeStyle = "rgba(255, 255, 255, 0.1)";
      context.lineWidth = 1 * scaleFactor;
      context.stroke();

      if (landFeatures) {
        // Draw graticule
        const graticule = d3.geoGraticule();
        context.beginPath();
        path(graticule());
        context.strokeStyle = "rgba(255, 255, 255, 0.05)";
        context.lineWidth = 1 * scaleFactor;
        context.stroke();

        // Draw land outlines
        context.beginPath();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        landFeatures.features.forEach((feature: any) => path(feature));
        context.strokeStyle = "rgba(255, 255, 255, 0.1)";
        context.lineWidth = 1 * scaleFactor;
        context.stroke();

        // Draw dots
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat]);
          if (
            projected &&
            projected[0] >= 0 &&
            projected[0] <= containerWidth &&
            projected[1] >= 0 &&
            projected[1] <= containerHeight
          ) {
            context.beginPath();
            context.arc(projected[0], projected[1], 1.2 * scaleFactor, 0, 2 * Math.PI);
            context.fillStyle = "#999999";
            context.fill();
          }
        });

        // --- DRAW VISITOR MARKER ---
        const loc = visitorLocationRef.current;
        if (loc) {
          const centerGeo: [number, number] = [-rotation[0], -rotation[1]];
          const distance = d3.geoDistance([loc.lng, loc.lat], centerGeo);

          // Only render if on the front side of the globe
          if (distance < Math.PI / 2) {
            const projectedLoc = projection([loc.lng, loc.lat]);
            
            if (projectedLoc) {
              const pulseScale = 1 + Math.sin(elapsed / 250) * 0.3;
              
              // Glowing Outer Pulse
              context.beginPath();
              context.arc(projectedLoc[0], projectedLoc[1], 8 * scaleFactor * pulseScale, 0, 2 * Math.PI);
              context.fillStyle = "rgba(246, 130, 31, 0.4)"; // Cloudflare orange accent
              context.fill();

              // Solid Core Dot
              context.beginPath();
              context.arc(projectedLoc[0], projectedLoc[1], 3.5 * scaleFactor, 0, 2 * Math.PI);
              context.fillStyle = "#F6821F"; 
              context.fill();

              // Label Background
              const labelText = `\${loc.city}, \${loc.country}`;
              context.font = `\${13 * scaleFactor}px var(--font-inter)`;
              
              const textX = projectedLoc[0] + 12 * scaleFactor;
              const textY = projectedLoc[1] + 4 * scaleFactor;

              context.shadowColor = "rgba(0,0,0,0.8)";
              context.shadowBlur = 4;
              
              // Text Label
              context.fillStyle = "#ffffff";
              context.fillText(labelText, textX, textY);
              
              context.shadowBlur = 0;
            }
          }
        }
      }
    };

    const loadWorldData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
        );
        if (!response.ok) throw new Error("Failed to load map data");

        landFeatures = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16);
          dots.forEach(([lng, lat]) => allDots.push({ lng, lat }));
        });
      } catch (err) {
        setError("Failed to load land map data");
        console.error(err);
      }
    };

    // --- ROTATION & INTERACTION ---
    const rotation = [0, 0];
    let autoRotate = true;
    const rotationSpeed = 0.3;

    const rotate = (elapsed: number) => {
      if (autoRotate) {
        rotation[0] += rotationSpeed;
        projection.rotate(rotation as [number, number, number]);
      }
      render(elapsed);
    };

    const rotationTimer = d3.timer(rotate);

    const handleMouseDown = (event: MouseEvent) => {
      autoRotate = false;
      const startX = event.clientX;
      const startY = event.clientY;
      const startRotation = [...rotation];

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const sensitivity = 0.5;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        rotation[0] = startRotation[0] + dx * sensitivity;
        rotation[1] = startRotation[1] - dy * sensitivity;
        rotation[1] = Math.max(-90, Math.min(90, rotation[1]));

        projection.rotate(rotation as [number, number, number]);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        setTimeout(() => { autoRotate = true; }, 3000);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
      const newRadius = Math.max(radius * 0.5, Math.min(radius * 3, projection.scale() * scaleFactor));
      projection.scale(newRadius);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    loadWorldData();
    fetchLocation();

    return () => {
      rotationTimer.stop();
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [width, height]);

  if (error) {
    return (
      <div className={`flex items-center justify-center rounded-2xl p-8 \${className}`}>
        <div className="text-center">
          <p className="text-destructive font-semibold mb-2">Error loading Earth visualization</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative \${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-2xl cursor-grab active:cursor-grabbing"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
}
