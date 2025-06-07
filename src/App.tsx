import React from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import './App.css'

function App() {
  return (
    <div className="app">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }} onCreated={({ gl }) => {
          gl.domElement.addEventListener('mousedown', (e) => e.stopPropagation())
          gl.domElement.addEventListener('touchstart', (e) => e.stopPropagation())
        }}>
          <Scene />
        </Canvas>
      </div>
      <div className="content">
        <h1>Interactive 3D Clothing Models</h1>
        <p>Use the arrows to switch between models. Click on a model to customize it!</p>
      </div>
    </div>
  )
}

export default App 