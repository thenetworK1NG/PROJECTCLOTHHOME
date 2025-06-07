import React, { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'

const Scene: React.FC = () => {
  // Load the models
  const tshirt = useGLTF('/TSHIRT.glb')
  const hoodie = useGLTF('/HOODIE.glb')
  
  // State for hover and animation
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [activeModel, setActiveModel] = useState<'tshirt' | 'hoodie'>('tshirt')
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)
  
  // References for rotation animation
  const tshirtRef = useRef<THREE.Group>(null)
  const hoodieRef = useRef<THREE.Group>(null)
  const tshirtRotation = useRef(0)
  const hoodieRotation = useRef(0)
  const tshirtScale = useRef(3)
  const hoodieScale = useRef(3)

  // Click handlers for models
  const handleTshirtClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    setSelectedModel('tshirt')
    setTimeout(() => {
      window.open('https://thenetwork1ng.github.io/TshirtPC/', '_blank')
      setSelectedModel(null)
    }, 1000)
  }

  const handleHoodieClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    setSelectedModel('hoodie')
    setTimeout(() => {
      window.open('https://thenetwork1ng.github.io/Hoodie/', '_blank')
      setSelectedModel(null)
    }, 1000)
  }

  // Carousel navigation
  const nextModel = () => {
    setActiveModel('hoodie')
  }

  const prevModel = () => {
    setActiveModel('tshirt')
  }

  // Animation loop
  useFrame((_: THREE.Clock, delta: number) => {
    // Update rotation values
    tshirtRotation.current += delta * 0.5
    hoodieRotation.current += delta * 0.5

    // Apply rotation to T-shirt
    if (tshirtRef.current) {
      tshirtRef.current.rotation.y = tshirtRotation.current
      
      // Position based on active model
      const targetX = activeModel === 'tshirt' ? 0 : -8
      tshirtRef.current.position.x = THREE.MathUtils.lerp(
        tshirtRef.current.position.x,
        targetX,
        0.1
      )

      // Hover animation
      const targetScale = hoveredModel === 'tshirt' ? 3.2 : 3
      tshirtScale.current = THREE.MathUtils.lerp(tshirtScale.current, targetScale, 0.1)
      tshirtRef.current.scale.setScalar(tshirtScale.current)
    }

    // Apply rotation to Hoodie
    if (hoodieRef.current) {
      hoodieRef.current.rotation.y = hoodieRotation.current
      
      // Position based on active model
      const targetX = activeModel === 'hoodie' ? 0 : 8
      hoodieRef.current.position.x = THREE.MathUtils.lerp(
        hoodieRef.current.position.x,
        targetX,
        0.1
      )

      // Hover animation
      const targetScale = hoveredModel === 'hoodie' ? 3.2 : 3
      hoodieScale.current = THREE.MathUtils.lerp(hoodieScale.current, targetScale, 0.1)
      hoodieRef.current.scale.setScalar(hoodieScale.current)
    }
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" />
      
      {/* Navigation Arrows */}
      <Html position={[-3, 0, 0]}>
        <button
          onClick={prevModel}
          style={{
            display: activeModel === 'tshirt' ? 'none' : 'block',
            padding: '15px 25px',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '28px',
            transition: 'all 0.3s ease',
            transform: 'translateX(-50px)'
          }}
        >
          ←
        </button>
      </Html>
      
      <Html position={[3, 0, 0]}>
        <button
          onClick={nextModel}
          style={{
            display: activeModel === 'hoodie' ? 'none' : 'block',
            padding: '15px 25px',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '28px',
            transition: 'all 0.3s ease',
            transform: 'translateX(50px)'
          }}
        >
          →
        </button>
      </Html>

      {/* Models */}
      <group>
        {/* T-Shirt Model */}
        <group
          ref={tshirtRef}
          position={[0, -0.5, 0]}
        >
          <primitive 
            object={tshirt.scene}
            onClick={handleTshirtClick}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer'
              setHoveredModel('tshirt')
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default'
              setHoveredModel(null)
            }}
          />
        </group>

        {/* Hoodie Model */}
        <group
          ref={hoodieRef}
          position={[8, -0.5, 0]}
        >
          <primitive 
            object={hoodie.scene}
            onClick={handleHoodieClick}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer'
              setHoveredModel('hoodie')
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default'
              setHoveredModel(null)
            }}
          />
        </group>
      </group>
    </>
  )
}

// Pre-load models
useGLTF.preload('/TSHIRT.glb')
useGLTF.preload('/HOODIE.glb')

export default Scene 