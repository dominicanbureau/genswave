import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import './HeroVisual.css';

function HeroVisual({ isDarkMode }) {
  const containerRef = useRef(null);
  const meshRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);
  const textElementsRef = useRef([]);
  const activeTextsRef = useRef([]);

  const texts = [
    'INNOVACIÓN',
    'DISEÑO',
    'TECNOLOGÍA',
    'CREATIVIDAD',
    'EXPERIENCIA',
    'CALIDAD',
    'ESTRATEGIA',
    'DESARROLLO'
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance",
      precision: "lowp"
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(2, 2);
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        hover: { value: 0 },
        isDark: { value: isDarkMode ? 1.0 : 0.0 }
      },
      vertexShader: `
        uniform float time;
        uniform float hover;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vec3 pos = position;
          
          float noise1 = snoise(pos * 0.6 + time * 0.4);
          float noise2 = snoise(pos * 1.2 + time * 0.6);
          
          float displacement = (noise1 * 0.3 + noise2 * 0.2);
          displacement *= (0.3 + hover * 0.4);
          pos += normal * displacement;
          
          float pulse = sin(time * 1.8) * 0.035 + 1.0;
          pos *= pulse;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float hover;
        uniform float isDark;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          vec3 light = normalize(vec3(1.0, 1.0, 1.0));
          float dProd = max(0.0, dot(vNormal, light));
          vec3 baseColor = mix(vec3(1.0), vec3(0.0), isDark);
          float lightIntensity = isDark > 0.5 ? 0.5 : 0.4;
          vec3 color = baseColor * (lightIntensity + dProd * 0.5);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), 2.5);
          color += fresnel * baseColor * 0.6;
          float rim = pow(1.0 - max(0.0, dot(vNormal, viewDirection)), 1.5);
          color += rim * baseColor * 0.5;
          float glow = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
          color += glow * 0.6 * hover * baseColor;
          if (isDark > 0.5) {
            color += vec3(0.15);
          }
          gl_FragColor = vec4(color, 0.95);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    const wireframeGeometry = new THREE.IcosahedronGeometry(2.05, 2);
    const wireframeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        hover: { value: 0 },
        isDark: { value: isDarkMode ? 1.0 : 0.0 }
      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float hover;
        uniform float isDark;
        void main() {
          float baseAlpha = isDark > 0.5 ? 0.12 : 0.08;
          float hoverAlpha = isDark > 0.5 ? 0.25 : 0.15;
          float alpha = baseAlpha + hover * hoverAlpha;
          vec3 color = mix(vec3(1.0), vec3(0.0), isDark);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      wireframe: true,
      transparent: true
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframeMesh);

    const handleMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      gsap.to(material.uniforms.hover, { value: 1, duration: 0.8, ease: 'power2.out' });
      gsap.to(wireframeMaterial.uniforms.hover, { value: 1, duration: 0.8, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      gsap.to(material.uniforms.hover, { value: 0, duration: 1, ease: 'power2.out' });
      gsap.to(wireframeMaterial.uniforms.hover, { value: 0, duration: 1, ease: 'power2.out' });
      targetRef.current = { x: 0, y: 0 };
    };

    const handleClick = () => {
      gsap.to(mesh.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.4, ease: 'elastic.out(1, 0.5)', yoyo: true, repeat: 1 });
      gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2, duration: 1.5, ease: 'power2.inOut' });
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    containerRef.current.addEventListener('click', handleClick);

    let startTime = Date.now();
    const animate = () => {
      const elapsedTime = (Date.now() - startTime) / 1000;
      targetRef.current.x += (mouseRef.current.x - targetRef.current.x) * 0.08;
      targetRef.current.y += (mouseRef.current.y - targetRef.current.y) * 0.08;
      
      material.uniforms.time.value = elapsedTime;
      
      const rotationSpeed = isHoveredRef.current ? 0.18 : 0.12;
      mesh.rotation.x = Math.sin(elapsedTime * 0.35) * 0.2 + targetRef.current.y * 0.35;
      mesh.rotation.y = elapsedTime * rotationSpeed + targetRef.current.x * 0.35;
      wireframeMesh.rotation.x = mesh.rotation.x;
      wireframeMesh.rotation.y = mesh.rotation.y;
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
        containerRef.current.removeEventListener('click', handleClick);
        if (renderer.domElement) containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      renderer.dispose();
    };
  }, [isDarkMode]);

  // Liquid text absorption animation using Blotter.js
  // DISABLED: Uncomment to reactivate liquid text effect
  /*
  useEffect(() => {
    // Load Blotter.js scripts dynamically
    const loadBlotter = () => {
      return new Promise((resolve, reject) => {
        if (window.Blotter && window.Blotter.LiquidDistortMaterial) {
          resolve();
          return;
        }

        const script1 = document.createElement('script');
        script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/Blotter/0.1.0/blotter.min.js';
        script1.onload = () => {
          const script2 = document.createElement('script');
          script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/Blotter/0.1.0/materials/liquidDistortMaterial.js';
          script2.onload = () => resolve();
          script2.onerror = reject;
          document.head.appendChild(script2);
        };
        script1.onerror = reject;
        document.head.appendChild(script1);
      });
    };

    let isAnimating = false;
    let currentBlotter = null;

    const createFloatingText = async () => {
      if (isAnimating || activeTextsRef.current.length > 0) return;

      try {
        await loadBlotter();
        
        if (!window.Blotter || !window.Blotter.LiquidDistortMaterial) {
          console.error('Blotter.js not loaded properly');
          return;
        }

        isAnimating = true;
        const textContent = texts[Math.floor(Math.random() * texts.length)];
        
        const textEl = document.createElement('div');
        textEl.className = 'floating-text-liquid';
        
        // Calculate distance based on container size to keep texts visible
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const maxDistance = Math.min(containerWidth, containerHeight) * 0.35;
        
        const angle = Math.random() * Math.PI * 2;
        const distance = maxDistance * 0.7 + Math.random() * maxDistance * 0.3;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        textEl.style.left = `calc(50% + ${x}px)`;
        textEl.style.top = `calc(50% + ${y}px)`;

        if (!containerRef.current) return;
        
        containerRef.current.appendChild(textEl);
        textElementsRef.current.push(textEl);
        activeTextsRef.current.push(textEl);

        // Create Blotter text with liquid distortion
        const text = new window.Blotter.Text(textContent, {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          size: 40,
          fill: isDarkMode ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)',
          weight: 500,
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 15,
          paddingBottom: 15
        });

        const material = new window.Blotter.LiquidDistortMaterial();
        material.uniforms.uSpeed.value = 0.4;
        material.uniforms.uVolatility.value = 0.1;
        material.uniforms.uSeed.value = 0.1;

        const blotter = new window.Blotter(material, { texts: text });
        currentBlotter = blotter;
        
        const scope = blotter.forText(text);
        scope.appendTo(textEl);

        // Ensure only one canvas is visible
        const canvases = textEl.querySelectorAll('canvas');
        if (canvases.length > 1) {
          for (let i = 1; i < canvases.length; i++) {
            canvases[i].remove();
          }
        }

        gsap.fromTo(textEl, 
          { 
            opacity: 0, 
            scale: 0.7
          },
          { 
            opacity: 1, 
            scale: 1,
            duration: 1.2,
            ease: 'power2.out',
            onComplete: () => {
              setTimeout(() => {
                absorbText(textEl);
              }, 2000);
            }
          }
        );
      } catch (error) {
        console.error('Error creating liquid text:', error);
        isAnimating = false;
      }
    };

    const absorbText = (textEl) => {
      if (!textEl || !containerRef.current) {
        isAnimating = false;
        return;
      }

      const rect = textEl.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      const currentX = rect.left + rect.width / 2 - containerRect.left;
      const currentY = rect.top + rect.height / 2 - containerRect.top;

      // Calculate direction to center
      const deltaX = centerX - currentX;
      const deltaY = centerY - currentY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Stop at a proportional distance from center (before reaching the element)
      const containerSize = Math.min(containerRect.width, containerRect.height);
      const stopDistance = containerSize * 0.15; // 15% of container size
      const ratio = stopDistance / distance;
      const targetX = deltaX * ratio;
      const targetY = deltaY * ratio;

      gsap.to(textEl, {
        x: targetX,
        y: targetY,
        opacity: 0,
        duration: 1.8,
        ease: 'power2.in',
        onComplete: () => {
          if (textEl && textEl.parentNode) {
            textEl.remove();
          }
          activeTextsRef.current = activeTextsRef.current.filter(t => t !== textEl);
          textElementsRef.current = textElementsRef.current.filter(t => t !== textEl);
          currentBlotter = null;
          isAnimating = false;
        }
      });
    };

    const initialTimeout = setTimeout(() => {
      createFloatingText();
    }, 1000);

    const checkInterval = setInterval(() => {
      if (!isAnimating && activeTextsRef.current.length === 0) {
        createFloatingText();
      }
    }, 500);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(checkInterval);
      currentBlotter = null;
      textElementsRef.current.forEach(el => {
        if (el && el.parentNode) {
          el.remove();
        }
      });
      textElementsRef.current = [];
      activeTextsRef.current = [];
    };
  }, [isDarkMode, texts]);
  */

  return (
    <div ref={containerRef} className="hero-visual-webgl" />
  );
}

export default HeroVisual;
