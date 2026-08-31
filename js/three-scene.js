/**
 * Three.js 3D Background Scene
 * Kazi Emon — Digital Growth Architect
 * 
 * Features:
 * - Particle field (2000+ glowing dots)
 * - Wireframe data globe (hero section)
 * - Floating geometric shapes
 * - Mouse-reactive parallax & light trails
 * - Scroll-driven camera movement
 */

(function () {
    'use strict';

    if (typeof THREE === 'undefined') return;

    const CONFIG = {
        colors: {
            primary: 0x7000FF,
            primaryLight: 0x9B4DFF,
            secondary: 0x00C2FF,
            background: 0x030014,
            white: 0xffffff
        },
        particles: {
            count: window.innerWidth < 768 ? 800 : 2000,
            size: window.innerWidth < 768 ? 1.5 : 2.0,
            spread: 120,
            speed: 0.0003
        },
        globe: {
            radius: 8,
            segments: 28,
            rotationSpeed: 0.002,
            pulseSpeed: 0.003
        },
        geometries: {
            count: window.innerWidth < 768 ? 4 : 8,
            spread: 60,
            rotationSpeed: 0.003
        },
        mouse: {
            sensitivity: 0.00008,
            smoothing: 0.05
        },
        scroll: {
            sensitivity: 0.0004
        }
    };

    let scene, camera, renderer, clock;
    let particleSystem, globeGroup, geometryGroup;
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    let scrollProgress = 0;
    let animationId;
    let isVisible = true;

    function init() {
        const canvas = document.getElementById('three-canvas');
        if (!canvas) return;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(CONFIG.colors.background, 0.008);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 50);

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(CONFIG.colors.background, 1);

        clock = new THREE.Clock();

        createLighting();
        createParticles();
        createGlobe();
        createFloatingGeometries();
        createAmbientGlow();

        window.addEventListener('resize', onResize, { passive: true });
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });

        document.addEventListener('visibilitychange', function () {
            isVisible = !document.hidden;
            if (isVisible) {
                clock.getDelta();
                animate();
            }
        });

        animate();
    }

    function createLighting() {
        var ambient = new THREE.AmbientLight(0x1a0030, 0.6);
        scene.add(ambient);

        var dirLight1 = new THREE.DirectionalLight(CONFIG.colors.primary, 0.8);
        dirLight1.position.set(20, 30, 20);
        scene.add(dirLight1);

        var dirLight2 = new THREE.DirectionalLight(CONFIG.colors.secondary, 0.4);
        dirLight2.position.set(-20, -10, 30);
        scene.add(dirLight2);

        var pointLight1 = new THREE.PointLight(CONFIG.colors.primary, 1.5, 100);
        pointLight1.position.set(-30, 20, 20);
        scene.add(pointLight1);

        var pointLight2 = new THREE.PointLight(CONFIG.colors.secondary, 1.0, 80);
        pointLight2.position.set(30, -15, 15);
        scene.add(pointLight2);
    }

    function createParticles() {
        var count = CONFIG.particles.count;
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array(count * 3);
        var colors = new Float32Array(count * 3);
        var sizes = new Float32Array(count);

        var colorPrimary = new THREE.Color(CONFIG.colors.primary);
        var colorSecondary = new THREE.Color(CONFIG.colors.secondary);
        var colorWhite = new THREE.Color(CONFIG.colors.white);

        for (var i = 0; i < count; i++) {
            var i3 = i * 3;
            var spread = CONFIG.particles.spread;
            var radius = Math.random() * spread;
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            var colorMix = Math.random();
            var particleColor;
            if (colorMix < 0.45) {
                particleColor = colorPrimary.clone().lerp(colorSecondary, Math.random());
            } else if (colorMix < 0.85) {
                particleColor = colorSecondary.clone().lerp(colorWhite, Math.random() * 0.3);
            } else {
                particleColor = colorWhite.clone();
                particleColor.multiplyScalar(0.5 + Math.random() * 0.5);
            }
            colors[i3] = particleColor.r;
            colors[i3 + 1] = particleColor.g;
            colors[i3 + 2] = particleColor.b;

            sizes[i] = CONFIG.particles.size * (0.3 + Math.random() * 1.2);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        var material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
            },
            vertexShader: [
                'attribute float size;',
                'varying vec3 vColor;',
                'uniform float uTime;',
                'uniform float uPixelRatio;',
                'void main() {',
                '    vColor = color;',
                '    vec3 pos = position;',
                '    pos.x += sin(uTime * 0.3 + position.y * 0.1) * 0.5;',
                '    pos.y += cos(uTime * 0.2 + position.x * 0.1) * 0.5;',
                '    pos.z += sin(uTime * 0.25 + position.z * 0.1) * 0.3;',
                '    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);',
                '    gl_PointSize = size * uPixelRatio * (80.0 / -mvPosition.z);',
                '    gl_Position = projectionMatrix * mvPosition;',
                '}'
            ].join('\n'),
            fragmentShader: [
                'varying vec3 vColor;',
                'void main() {',
                '    float dist = length(gl_PointCoord - vec2(0.5));',
                '    if (dist > 0.5) discard;',
                '    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);',
                '    alpha *= 0.7;',
                '    gl_FragColor = vec4(vColor, alpha);',
                '}'
            ].join('\n'),
            transparent: true,
            vertexColors: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);
    }

    function createGlobe() {
        globeGroup = new THREE.Group();
        globeGroup.position.set(18, 2, -10);

        var radius = CONFIG.globe.radius;
        var segments = CONFIG.globe.segments;

        var sphereGeo = new THREE.SphereGeometry(radius, segments, segments);
        var sphereMat = new THREE.MeshBasicMaterial({
            color: CONFIG.colors.primary,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        var sphere = new THREE.Mesh(sphereGeo, sphereMat);
        globeGroup.add(sphere);

        var innerGeo = new THREE.SphereGeometry(radius * 0.95, 16, 16);
        var innerMat = new THREE.MeshBasicMaterial({
            color: CONFIG.colors.primary,
            transparent: true,
            opacity: 0.03,
            side: THREE.BackSide
        });
        var innerSphere = new THREE.Mesh(innerGeo, innerMat);
        globeGroup.add(innerSphere);

        for (var i = 0; i < 3; i++) {
            var ringGeo = new THREE.RingGeometry(radius + 0.5 + i * 1.5, radius + 0.7 + i * 1.5, 64);
            var ringMat = new THREE.MeshBasicMaterial({
                color: i === 1 ? CONFIG.colors.secondary : CONFIG.colors.primary,
                transparent: true,
                opacity: 0.08 - i * 0.02,
                side: THREE.DoubleSide
            });
            var ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2 + (i * 0.3 - 0.3);
            ring.rotation.z = i * 0.4;
            globeGroup.add(ring);
        }

        var dotCount = window.innerWidth < 768 ? 30 : 60;
        var dotGeometry = new THREE.BufferGeometry();
        var dotPositions = new Float32Array(dotCount * 3);
        var dotColors = new Float32Array(dotCount * 3);

        for (var j = 0; j < dotCount; j++) {
            var j3 = j * 3;
            var phi2 = Math.acos(2 * Math.random() - 1);
            var theta2 = Math.random() * Math.PI * 2;
            var r = radius + 0.2;
            dotPositions[j3] = r * Math.sin(phi2) * Math.cos(theta2);
            dotPositions[j3 + 1] = r * Math.sin(phi2) * Math.sin(theta2);
            dotPositions[j3 + 2] = r * Math.cos(phi2);

            var dotColor = Math.random() > 0.5
                ? new THREE.Color(CONFIG.colors.secondary)
                : new THREE.Color(CONFIG.colors.primaryLight);
            dotColors[j3] = dotColor.r;
            dotColors[j3 + 1] = dotColor.g;
            dotColors[j3 + 2] = dotColor.b;
        }

        dotGeometry.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
        dotGeometry.setAttribute('color', new THREE.BufferAttribute(dotColors, 3));

        var dotMaterial = new THREE.PointsMaterial({
            size: 0.25,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        var dots = new THREE.Points(dotGeometry, dotMaterial);
        globeGroup.add(dots);

        var lineCount = Math.min(dotCount, 20);
        var lineMat = new THREE.LineBasicMaterial({
            color: CONFIG.colors.secondary,
            transparent: true,
            opacity: 0.06,
            blending: THREE.AdditiveBlending
        });

        for (var k = 0; k < lineCount; k++) {
            var idx1 = Math.floor(Math.random() * dotCount) * 3;
            var idx2 = Math.floor(Math.random() * dotCount) * 3;
            var lineGeo = new THREE.BufferGeometry();
            var linePositions = new Float32Array(6);
            linePositions[0] = dotPositions[idx1];
            linePositions[1] = dotPositions[idx1 + 1];
            linePositions[2] = dotPositions[idx1 + 2];
            linePositions[3] = dotPositions[idx2];
            linePositions[4] = dotPositions[idx2 + 1];
            linePositions[5] = dotPositions[idx2 + 2];
            lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
            var line = new THREE.Line(lineGeo, lineMat);
            globeGroup.add(line);
        }

        scene.add(globeGroup);
    }

    function createFloatingGeometries() {
        geometryGroup = new THREE.Group();

        var geometryTypes = [
            function () { return new THREE.IcosahedronGeometry(1.5, 0); },
            function () { return new THREE.OctahedronGeometry(1.2, 0); },
            function () { return new THREE.TetrahedronGeometry(1.3, 0); },
            function () { return new THREE.TorusGeometry(1.0, 0.3, 8, 16); },
            function () { return new THREE.DodecahedronGeometry(1.1, 0); },
            function () { return new THREE.BoxGeometry(1.4, 1.4, 1.4); },
            function () { return new THREE.ConeGeometry(0.8, 1.8, 6); },
            function () { return new THREE.TorusKnotGeometry(0.8, 0.25, 48, 8); }
        ];

        var count = CONFIG.geometries.count;
        var spread = CONFIG.geometries.spread;

        for (var i = 0; i < count; i++) {
            var geoFn = geometryTypes[i % geometryTypes.length];
            var geo = geoFn();

            var useSecondary = Math.random() > 0.6;
            var mat = new THREE.MeshPhongMaterial({
                color: useSecondary ? CONFIG.colors.secondary : CONFIG.colors.primary,
                wireframe: true,
                transparent: true,
                opacity: 0.12 + Math.random() * 0.08,
                emissive: useSecondary ? CONFIG.colors.secondary : CONFIG.colors.primary,
                emissiveIntensity: 0.15
            });

            var mesh = new THREE.Mesh(geo, mat);

            var angle = (i / count) * Math.PI * 2;
            var dist = 20 + Math.random() * spread;
            mesh.position.set(
                Math.cos(angle) * dist * (0.5 + Math.random() * 0.5),
                (Math.random() - 0.5) * spread * 0.6,
                (Math.random() - 0.5) * spread * 0.4 - 10
            );

            mesh.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );

            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * CONFIG.geometries.rotationSpeed * 2,
                    y: (Math.random() - 0.5) * CONFIG.geometries.rotationSpeed * 2,
                    z: (Math.random() - 0.5) * CONFIG.geometries.rotationSpeed * 2
                },
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.3 + Math.random() * 0.5,
                floatAmplitude: 1 + Math.random() * 2,
                originalY: mesh.position.y
            };

            geometryGroup.add(mesh);
        }

        scene.add(geometryGroup);
    }

    function createAmbientGlow() {
        var glowPositions = [
            { x: -40, y: 20, z: -30, color: CONFIG.colors.primary, size: 15, opacity: 0.04 },
            { x: 35, y: -25, z: -20, color: CONFIG.colors.secondary, size: 12, opacity: 0.03 },
            { x: 0, y: 30, z: -40, color: CONFIG.colors.primaryLight, size: 18, opacity: 0.025 },
            { x: -25, y: -15, z: -25, color: CONFIG.colors.primary, size: 10, opacity: 0.035 }
        ];

        glowPositions.forEach(function (g) {
            var geo = new THREE.SphereGeometry(g.size, 16, 16);
            var mat = new THREE.MeshBasicMaterial({
                color: g.color,
                transparent: true,
                opacity: g.opacity,
                side: THREE.BackSide
            });
            var mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(g.x, g.y, g.z);
            scene.add(mesh);
        });
    }

    function animate() {
        if (!isVisible) return;
        animationId = requestAnimationFrame(animate);

        var elapsed = clock.getElapsedTime();

        mouseX += (targetMouseX - mouseX) * CONFIG.mouse.smoothing;
        mouseY += (targetMouseY - mouseY) * CONFIG.mouse.smoothing;

        if (particleSystem) {
            particleSystem.material.uniforms.uTime.value = elapsed;
            particleSystem.rotation.y = elapsed * CONFIG.particles.speed;
            particleSystem.rotation.x = mouseY * 0.3;
            particleSystem.position.x = mouseX * 5;
            particleSystem.position.y = -mouseY * 3;
        }

        if (globeGroup) {
            globeGroup.rotation.y = elapsed * CONFIG.globe.rotationSpeed + mouseX * 0.5;
            globeGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.1 + mouseY * 0.3;

            var pulse = 1 + Math.sin(elapsed * CONFIG.globe.pulseSpeed * 10) * 0.02;
            globeGroup.scale.set(pulse, pulse, pulse);

            var globeOpacity = Math.max(0, 1 - scrollProgress * 3);
            globeGroup.position.y = 2 - scrollProgress * 30;
            globeGroup.children.forEach(function (child) {
                if (child.material) {
                    child.material.opacity = child.material._baseOpacity !== undefined
                        ? child.material._baseOpacity * globeOpacity
                        : child.material.opacity;
                }
            });
        }

        if (geometryGroup) {
            geometryGroup.children.forEach(function (mesh) {
                var ud = mesh.userData;
                mesh.rotation.x += ud.rotationSpeed.x;
                mesh.rotation.y += ud.rotationSpeed.y;
                mesh.rotation.z += ud.rotationSpeed.z;
                mesh.position.y = ud.originalY +
                    Math.sin(elapsed * ud.floatSpeed + ud.floatOffset) * ud.floatAmplitude;
            });
        }

        camera.position.y = -scrollProgress * 15;
        camera.position.z = 50 - scrollProgress * 10;
        camera.rotation.x = -scrollProgress * 0.05;
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;

        renderer.render(scene, camera);
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if (particleSystem) {
            particleSystem.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
        }
    }

    function onMouseMove(e) {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    function onScroll() {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress = docHeight > 0 ? window.scrollY / docHeight : 0;
    }

    function storeBaseOpacities() {
        if (globeGroup) {
            globeGroup.children.forEach(function (child) {
                if (child.material && child.material.opacity !== undefined) {
                    child.material._baseOpacity = child.material.opacity;
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            init();
            storeBaseOpacities();
        });
    } else {
        init();
        storeBaseOpacities();
    }

})();
