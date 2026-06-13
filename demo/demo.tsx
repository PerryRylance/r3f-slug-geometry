import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import * as THREE from 'three';
import { Canvas, useThree, extend, useFrame } from '@react-three/fiber';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SlugLoader } from 'three-slug';
import { SlugText } from '../src/slugGeometry'; // Ensure slugGeometry and types are extended

// Register OrbitControls with React Three Fiber
extend({ OrbitControls });

// Declare custom JSX elements for TypeScript
declare global {
	namespace JSX {
		interface IntrinsicElements {
			orbitControls: any;
		}
	}
}

// Custom controls component
function Controls() {
	const { camera, gl } = useThree();
	const controlsRef = React.useRef<any>();

	useFrame(() => {
		if (controlsRef.current) {
			controlsRef.current.update();
		}
	});

	return <orbitControls ref={controlsRef} args={[camera, gl.domElement]} enableDamping dampingFactor={0.05} />;
}

// Custom 3D Text component utilizing slugGeometry
interface Text3DProps {
	text: string;
	slugData: any;
	color?: string;
}

function Text3D({ text, slugData, color = '#00ffcc' }: Text3DProps) {
	return (
		<SlugText text={text} slugData={slugData} castShadow receiveShadow scale={[0.12, 0.12, 0.12]}>
			<meshStandardMaterial
				color={color}
				roughness={0.1}
				metalness={0.1}
				side={THREE.DoubleSide}
			/>
		</SlugText>
	);
}

function Demo() {
	const [slugData, setSlugData] = React.useState<any>(null);
	const text = 'R3F Slug Geometry';

	// Load slug font data
	React.useEffect(() => {
		const loader = new SlugLoader();
		loader.load(
			"DejaVuSansMono.sluggish",
			(data) => {
				setSlugData(data);
			},
			undefined,
			(err) => {
				console.error('Failed to load sluggish font:', err);
			}
		);
	}, []);

	return (
		<div style={{ width: '100%', height: '100%', position: 'relative' }}>
			<Canvas
				shadows
				camera={{ position: [0, 0, 100], fov: 45, near: 1, far: Math.pow(2, 15) }}
				style={{ width: '100%', height: '100%' }}
			>
				<color attach="background" args={['#07070c']} />
				<ambientLight intensity={0.9} />
				{slugData && (
					<group position={[-30, 10, 0]}>
						<Text3D text={text} slugData={slugData} color="#00ffcc" />
					</group>
				)}
				<Controls />
			</Canvas>
		</div>
	);
}

const container = document.getElementById('root');
if (container) {
	const root = ReactDOM.createRoot(container);
	root.render(<Demo />);
}
