'use client'

import { useRef, useMemo, useState, memo, useCallback, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import {
  journeyRoute,
  journeyStopKey,
  type JourneyStop,
} from '@/content/world-journey'
import type { GeoJSON } from '@/utils/geojson-loader'

type GlobeTheme = {
  sceneBg: string
  sphereColor: string
  lineColor: string
  markerColor: string
  currentMarkerColor: string
  arcColor: string
  labelColor: string
  labelMutedColor: string
  loadingTextColor: string
}

const DEFAULT_GLOBE_THEME: GlobeTheme = {
  sceneBg: '#fafbfc',
  sphereColor: '#e4ebf3',
  lineColor: '#8aa4bc',
  markerColor: '#365f85',
  currentMarkerColor: '#397b80',
  arcColor: '#365f85',
  labelColor: '#253449',
  labelMutedColor: '#617085',
  loadingTextColor: '#617085',
}

// Convert lat/lng to 3D coordinates on sphere
function latLngToVector3(
  lat: number,
  lng: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

// Create arc between two points on the globe
function createArc(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  const segments = 50

  for (let i = 0; i <= segments; i++) {
    const t = i / segments

    // Spherical interpolation
    const point = new THREE.Vector3().lerpVectors(start, end, t)

    // Calculate arc height based on distance
    const distance = start.distanceTo(end)
    const arcHeight = Math.min(distance * 0.3, 0.8)
    const heightFactor = Math.sin(t * Math.PI) * arcHeight

    // Push point outward from center
    point.normalize().multiplyScalar(radius + heightFactor)
    points.push(point)
  }

  return points
}

// Process GeoJSON coordinates into line segments for the globe
function processGeoJSONToLines(
  geoJSON: GeoJSON,
  radius: number,
): THREE.Vector3[][] {
  const lines: THREE.Vector3[][] = []

  const processCoordinates = (coords: number[][], r: number) => {
    const points: THREE.Vector3[] = []
    for (const coord of coords) {
      const lng = coord[0]
      const lat = coord[1]
      points.push(latLngToVector3(lat, lng, r))
    }
    if (points.length > 1) {
      lines.push(points)
    }
  }

  for (const feature of geoJSON.features) {
    const geometry = feature.geometry

    if (geometry.type === 'Polygon') {
      const coords = geometry.coordinates as number[][][]
      for (const ring of coords) {
        processCoordinates(ring, radius)
      }
    } else if (geometry.type === 'MultiPolygon') {
      const coords = geometry.coordinates as number[][][][]
      for (const polygon of coords) {
        for (const ring of polygon) {
          processCoordinates(ring, radius)
        }
      }
    } else if (geometry.type === 'LineString') {
      const coords = geometry.coordinates as number[][]
      processCoordinates(coords, radius)
    } else if (geometry.type === 'MultiLineString') {
      const coords = geometry.coordinates as number[][][]
      for (const line of coords) {
        processCoordinates(line, radius)
      }
    }
  }

  return lines
}

// Globe with real country outlines from GeoJSON
const GlobeWireframe = memo(function GlobeWireframe({
  radius,
  geoData,
  sphereColor,
  lineColor,
}: {
  radius: number
  geoData: GeoJSON | null
  sphereColor: string
  lineColor: string
}) {
  const countryPaths = useMemo(() => {
    if (!geoData) return []
    return processGeoJSONToLines(geoData, radius * 1.001)
  }, [geoData, radius])

  return (
    <group>
      {/* Base sphere - always rendered */}
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial color={sphereColor} />
      </mesh>

      {/* Country outlines - rendered when data loads */}
      {countryPaths.map((points, i) => (
        <Line
          key={`country-${i}`}
          points={points}
          color={lineColor}
          lineWidth={0.8}
        />
      ))}
    </group>
  )
})

// Location marker component
function LocationMarker({
  position,
  country,
  index,
  isHovered,
  isSelected,
  isCurrent,
  onHover,
  onLeave,
  onClick,
  markerColor,
  currentMarkerColor,
  labelColor,
  labelMutedColor,
  markerSize,
  compactLabel,
}: {
  position: THREE.Vector3
  country: JourneyStop
  index: number
  isHovered: boolean
  isSelected: boolean
  isCurrent: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
  markerColor: string
  currentMarkerColor: string
  labelColor: string
  labelMutedColor: string
  markerSize: number
  compactLabel: boolean
}) {
  const markerRef = useRef<THREE.Mesh>(null)
  const pulseRef = useRef<THREE.Mesh>(null)
  const pulseMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    if (!isCurrent) return

    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [isCurrent])

  useFrame((state) => {
    if (markerRef.current) {
      markerRef.current.scale.setScalar(isHovered || isSelected ? 1.5 : 1)
    }

    if (pulseRef.current && pulseMaterialRef.current) {
      const cycle = reduceMotion
        ? 0.35
        : (Math.sin(state.clock.elapsedTime * 2.5 + index) + 1) / 2
      pulseRef.current.scale.setScalar(1.5 + cycle * 1.25)
      pulseMaterialRef.current.opacity = 0.32 - cycle * 0.2
    }
  })

  const formatCoord = (val: number, isLat: boolean) => {
    const dir = isLat ? (val >= 0 ? 'N' : 'S') : val >= 0 ? 'E' : 'W'
    return `${Math.abs(val).toFixed(compactLabel ? 2 : 4)}${dir}`
  }

  return (
    <group position={position}>
      {isCurrent && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[markerSize * 0.75, 20, 20]} />
          <meshBasicMaterial
            ref={pulseMaterialRef}
            color={currentMarkerColor}
            transparent
            opacity={0.24}
            depthWrite={false}
          />
        </mesh>
      )}
      <mesh
        ref={markerRef}
        onPointerOver={onHover}
        onPointerOut={onLeave}
        onClick={onClick}
      >
        {isCurrent ? (
          <sphereGeometry args={[markerSize * 0.65, 20, 20]} />
        ) : (
          <boxGeometry args={[markerSize, markerSize, markerSize]} />
        )}
        <meshStandardMaterial
          color={isCurrent ? currentMarkerColor : markerColor}
        />
      </mesh>

      {(isHovered || isSelected) && (
        <Html
          position={[markerSize * 2.2, markerSize * 1.5, 0]}
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            maxWidth: compactLabel ? '120px' : 'none',
          }}
          distanceFactor={compactLabel ? 3.8 : 3}
        >
          <div className="transition-opacity duration-200">
            <div
              className={`font-mono tracking-wider font-medium uppercase ${compactLabel ? 'text-[11px]' : 'text-sm'}`}
              style={{ color: labelColor }}
            >
              {country.stopName ?? country.name}
            </div>
            <div
              className={`font-mono tracking-wide ${compactLabel ? 'text-[10px]' : 'text-xs'}`}
              style={{ color: labelMutedColor }}
            >
              {formatCoord(country.coordinates[0], true)},
            </div>
            <div
              className={`font-mono tracking-wide ${compactLabel ? 'text-[10px]' : 'text-xs'}`}
              style={{ color: labelMutedColor }}
            >
              {formatCoord(country.coordinates[1], false)}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Arc path component
function ArcPath({
  start,
  end,
  radius,
  color,
  lineWidth,
}: {
  start: THREE.Vector3
  end: THREE.Vector3
  radius: number
  color: string
  lineWidth: number
}) {
  const points = useMemo(
    () => createArc(start, end, radius),
    [start, end, radius],
  )

  return (
    <Line
      points={points}
      color={color}
      lineWidth={lineWidth}
      transparent
      opacity={0.6}
    />
  )
}

// Main scene component
function Scene({
  onSelectCountry,
  selectedCountry,
  geoData,
  theme,
  isMobile,
}: {
  onSelectCountry: (country: JourneyStop | null) => void
  selectedCountry: JourneyStop | null
  geoData: GeoJSON | null
  theme: GlobeTheme
  isMobile: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const resumeRotateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  const radius = isMobile ? 1.75 : 2
  const markerSize = isMobile ? 0.052 : 0.04
  const arcLineWidth = isMobile ? 1.1 : 1.5

  useEffect(() => {
    return () => {
      if (resumeRotateTimeoutRef.current) {
        clearTimeout(resumeRotateTimeoutRef.current)
      }
    }
  }, [])

  // Face the latest route stop when the globe first loads.
  const initialRotation = useMemo(() => {
    const currentLongitude = journeyRoute.at(-1)?.coordinates[1] ?? 0
    return -(currentLongitude + 90) * (Math.PI / 180)
  }, [])

  // Callback ref to set initial rotation when group is created
  const setGroupRef = useCallback(
    (group: THREE.Group | null) => {
      if (group) {
        group.rotation.y = initialRotation
        groupRef.current = group
      }
    },
    [initialRotation],
  )

  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.1
    }
  })

  const locationPositions = useMemo(() => {
    return journeyRoute.map((country) => ({
      country,
      position: latLngToVector3(
        country.coordinates[0],
        country.coordinates[1],
        radius * 1.01,
      ),
    }))
  }, [radius])

  const arcs = useMemo(() => {
    const connections: { start: THREE.Vector3; end: THREE.Vector3 }[] = []

    for (let i = 0; i < journeyRoute.length - 1; i++) {
      const startCountry = journeyRoute[i]
      const endCountry = journeyRoute[i + 1]

      connections.push({
        start: latLngToVector3(
          startCountry.coordinates[0],
          startCountry.coordinates[1],
          radius,
        ),
        end: latLngToVector3(
          endCountry.coordinates[0],
          endCountry.coordinates[1],
          radius,
        ),
      })
    }

    return connections
  }, [radius])

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={isMobile ? 2.6 : 3}
        maxDistance={isMobile ? 6.8 : 8}
        rotateSpeed={isMobile ? 0.8 : 1}
        enableDamping={true}
        dampingFactor={0.08}
        autoRotate={false}
        onStart={() => {
          if (resumeRotateTimeoutRef.current) {
            clearTimeout(resumeRotateTimeoutRef.current)
          }
          setAutoRotate(false)
        }}
        onEnd={() => {
          if (resumeRotateTimeoutRef.current) {
            clearTimeout(resumeRotateTimeoutRef.current)
          }
          resumeRotateTimeoutRef.current = setTimeout(() => {
            setAutoRotate(true)
          }, 1400)
        }}
      />

      <group ref={setGroupRef}>
        <GlobeWireframe
          radius={radius}
          geoData={geoData}
          sphereColor={theme.sphereColor}
          lineColor={theme.lineColor}
        />

        {arcs.map((arc, i) => (
          <ArcPath
            key={i}
            start={arc.start}
            end={arc.end}
            radius={radius}
            color={theme.arcColor}
            lineWidth={arcLineWidth}
          />
        ))}

        {locationPositions.map(({ country, position }, index) => {
          const stopKey = journeyStopKey(country)
          const selectedStopKey = selectedCountry
            ? journeyStopKey(selectedCountry)
            : null

          return (
            <LocationMarker
              key={stopKey}
              position={position}
              country={country}
              index={index}
              isHovered={hoveredCountry === stopKey}
              isSelected={selectedStopKey === stopKey}
              isCurrent={index === locationPositions.length - 1}
              onHover={() => setHoveredCountry(stopKey)}
              onLeave={() => setHoveredCountry(null)}
              onClick={() =>
                onSelectCountry(selectedStopKey === stopKey ? null : country)
              }
              markerColor={theme.markerColor}
              currentMarkerColor={theme.currentMarkerColor}
              labelColor={theme.labelColor}
              labelMutedColor={theme.labelMutedColor}
              markerSize={markerSize}
              compactLabel={isMobile}
            />
          )
        })}
      </group>
    </>
  )
}

// Export the wrapped canvas
export default function GlobeScene({
  onSelectCountry,
  selectedCountry,
  geoData,
  isMobile,
  onReady,
}: {
  onSelectCountry: (country: JourneyStop | null) => void
  selectedCountry: JourneyStop | null
  geoData: GeoJSON | null
  isMobile: boolean
  onReady: () => void
}) {
  const [isMounted, setIsMounted] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [theme, setTheme] = useState<GlobeTheme>(DEFAULT_GLOBE_THEME)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const updateTheme = () => {
      const styles = getComputedStyle(document.documentElement)
      const pick = (name: string, fallback: string) =>
        styles.getPropertyValue(name).trim() || fallback

      setTheme({
        sceneBg: pick(
          '--ui-body-bg',
          pick(
            '--ui-globe-bg',
            pick('--ui-bg-strong', DEFAULT_GLOBE_THEME.sceneBg),
          ),
        ),
        sphereColor: pick(
          '--ui-globe-sphere',
          pick('--ui-bg-elevated', DEFAULT_GLOBE_THEME.sphereColor),
        ),
        lineColor: pick(
          '--ui-globe-line',
          pick('--ui-border-strong', DEFAULT_GLOBE_THEME.lineColor),
        ),
        markerColor: pick('--ui-accent', DEFAULT_GLOBE_THEME.markerColor),
        currentMarkerColor: pick(
          '--ui-current-location',
          DEFAULT_GLOBE_THEME.currentMarkerColor,
        ),
        arcColor: pick('--ui-accent', DEFAULT_GLOBE_THEME.arcColor),
        labelColor: pick('--ui-text-primary', DEFAULT_GLOBE_THEME.labelColor),
        labelMutedColor: pick(
          '--ui-text-muted',
          DEFAULT_GLOBE_THEME.labelMutedColor,
        ),
        loadingTextColor: pick(
          '--ui-text-muted',
          DEFAULT_GLOBE_THEME.loadingTextColor,
        ),
      })
    }

    updateTheme()

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          (mutation.attributeName === 'data-theme' ||
            mutation.attributeName === 'class')
        ) {
          updateTheme()
          break
        }
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setClearColor(theme.sceneBg, 0)
    }
  }, [theme.sceneBg])

  if (!isMounted) {
    return (
      <div
        aria-hidden="true"
        className="w-full h-full flex items-center justify-center bg-[var(--ui-bg-strong)]"
      >
        <span className="font-mono tracking-wider text-sm text-[var(--ui-text-muted)]">
          LOADING GLOBE...
        </span>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      {/* Loading state shown until canvas is ready */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-700 pointer-events-none"
        style={{ background: 'transparent', opacity: isReady ? 0 : 1 }}
      >
        <div
          className="font-mono tracking-wider text-sm"
          style={{ color: theme.loadingTextColor }}
        >
          LOADING GLOBE...
        </div>
      </div>

      <Canvas
        camera={{
          position: [0, 0, isMobile ? 6.9 : 7.6],
          fov: isMobile ? 47 : 45,
        }}
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.7s ease-in-out',
        }}
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        frameloop="always"
        onCreated={({ gl }) => {
          rendererRef.current = gl
          gl.setClearColor(theme.sceneBg, 0)
          // Small delay to ensure first frame is rendered
          requestAnimationFrame(() => {
            setIsReady(true)
            onReady()
          })
        }}
      >
        <Scene
          key="globe-scene"
          onSelectCountry={onSelectCountry}
          selectedCountry={selectedCountry}
          geoData={geoData}
          theme={theme}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  )
}
