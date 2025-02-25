<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Maze Runner - Game</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background: #000;
            font-family: 'Orbitron', sans-serif;
            touch-action: none;
        }
        canvas {
            display: block;
            width: 100vw;
            height: 100vh;
        }
        #controls {
            position: absolute;
            top: 10px;
            left: 10px;
            color: #00ffcc;
            text-shadow: 0 0 5px #00ffcc;
            font-size: 1.2em;
            z-index: 1;
        }
        #joystick {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 120px;
            height: 120px;
            background: rgba(0, 255, 204, 0.3);
            border-radius: 50%;
            border: 2px solid #00ffcc;
            z-index: 2;
            display: none;
        }
        #joystick-knob {
            position: absolute;
            width: 50px;
            height: 50px;
            background: #00ffcc;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 10px #00ffcc;
        }
        @media (max-width: 768px) {
            #joystick { display: block; }
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap" rel="stylesheet">
</head>
<body>
    <div id="controls">WASD/Arrows or Joystick to move</div>
    <div id="joystick">
        <div id="joystick-knob"></div>
    </div>
    <canvas id="gameCanvas"></canvas>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
    <script>
        console.log('Script started');

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas'), antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000);
        console.log('Renderer initialized');

        // Player (Third-person)
        const player = {
            x: 1,
            z: 1,
            angle: 0,
            velocityX: 0,
            velocityZ: 0,
            speed: 0.15,
            turnSpeed: 0.08
        };
        const characterGeometry = new THREE.CapsuleGeometry(0.3, 1, 32);
        const characterMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
        const character = new THREE.Mesh(characterGeometry, characterMaterial);
        character.position.set(player.x, 1, player.z);
        scene.add(character);
        console.log('Character added');

        // Camera
        const cameraOffset = new THREE.Vector3(0, 3, -4);
        updateCamera();

        // Maze setup
        const mazeSize = 10;
        const maze = generateMaze(mazeSize, mazeSize);
        const wallHeight = 3;
        const wallGeometry = new THREE.BoxGeometry(1, wallHeight, 1);
        const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.7 });
        const floorGeometry = new THREE.PlaneGeometry(mazeSize * 2, mazeSize * 2);
        const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x1a0b3d, side: THREE.DoubleSide });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = Math.PI / 2;
        floor.position.y = -0.5;
        scene.add(floor);
        console.log('Floor added');

        // Build maze walls
        const walls = [];
        for (let x = 0; x < mazeSize; x++) {
            for (let z = 0; z < mazeSize; z++) {
                if (maze[x][z] === 1) {
                    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                    wall.position.set(x, wallHeight / 2, z);
                    scene.add(wall);
                    walls.push(wall);
                }
            }
        }
        console.log('Walls added:', walls.length);

        // Exit
        const exitGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const exitMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        const exit = new THREE.Mesh(exitGeometry, exitMaterial);
        exit.position.set(mazeSize - 2, 0.5, mazeSize - 2);
        scene.add(exit);
        console.log('Exit added');

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        console.log('Lighting added');

        // Desktop controls
        let moveForward = false, moveBackward = false, turnLeft = false, turnRight = false;
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'w': case 'arrowup': moveForward = true; break;
                case 's': case 'arrowdown': moveBackward = true; break;
                case 'a': case 'arrowleft': turnLeft = true; break;
                case 'd': case 'arrowright': turnRight = true; break;
            }
        });
        document.addEventListener('keyup', (e) => {
            switch (e.key.toLowerCase()) {
                case 'w': case 'arrowup': moveForward = false; break;
                case 's': case 'arrowdown': moveBackward = false; break;
                case 'a': case 'arrowleft': turnLeft = false; break;
                case 'd': case 'arrowright': turnRight = false; break;
            }
        });

        // Joystick controls
        const joystick = document.getElementById('joystick');
        const knob = document.getElementById('joystick-knob');
        let joystickActive = false, joystickX = 0, joystickY = 0;
        let touchId = null;

        document.addEventListener('touchstart', (e) => {
            for (let touch of e.changedTouches) {
                const rect = joystick.getBoundingClientRect();
                if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
                    touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
                    e.preventDefault();
                    joystickActive = true;
                    touchId = touch.identifier;
                    updateJoystick(touch);
                    break;
                }
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (joystickActive) {
                for (let touch of e.changedTouches) {
                    if (touch.identifier === touchId) {
                        e.preventDefault();
                        updateJoystick(touch);
                        break;
                    }
                }
            }
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            for (let touch of e.changedTouches) {
                if (touch.identifier === touchId) {
                    joystickActive = false;
                    touchId = null;
                    knob.style.left = '50%';
                    knob.style.top = '50%';
                    joystickX = 0;
                    joystickY = 0;
                    break;
                }
            }
        });

        function updateJoystick(touch) {
            const rect = joystick.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            let dx = touch.clientX - centerX;
            let dy = touch.clientY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = rect.width / 2 - 25; // Adjust for knob size
            if (distance > maxDistance) {
                dx *= maxDistance / distance;
                dy *= maxDistance / distance;
            }
            knob.style.left = `${50 + (dx / maxDistance) * 50}%`;
            knob.style.top = `${50 + (dy / maxDistance) * 50}%`;
            joystickX = dx / maxDistance;
            joystickY = dy / maxDistance;
        }

        // Simplified maze generation
        function generateMaze(width, height) {
            const maze = Array(width).fill().map(() => Array(height).fill(1));
            function carve(x, z) {
                maze[x][z] = 0;
                const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]];
                directions.sort(() => Math.random() - 0.5);
                for (let [dx, dz] of directions) {
                    const nx = x + dx, nz = z + dz;
                    if (nx >= 0 && nx < width && nz >= 0 && nz < height && maze[nx][nz] === 1) {
                        maze[x + dx / 2][z + dz / 2] = 0;
                        carve(nx, nz);
                    }
                }
            }
            carve(1, 1);
            // Thin out walls
            for (let x = 1; x < width - 1; x++) {
                for (let z = 1; z < height - 1; z++) {
                    if (maze[x][z] === 1 && Math.random() > 0.6) {
                        maze[x][z] = 0;
                    }
                }
            }
            return maze;
        }

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            // Movement
            player.velocityX *= 0.9;
            player.velocityZ *= 0.9;

            // Desktop input
            if (moveForward) {
                player.velocityX += Math.sin(player.angle) * player.speed;
                player.velocityZ += Math.cos(player.angle) * player.speed;
            }
            if (moveBackward) {
                player.velocityX -= Math.sin(player.angle) * player.speed;
                player.velocityZ -= Math.cos(player.angle) * player.speed;
            }
            if (turnLeft) player.angle += player.turnSpeed;
            if (turnRight) player.angle -= player.turnSpeed;

            // Joystick input
            if (joystickActive) {
                player.velocityX += Math.sin(player.angle) * player.speed * -joystickY;
                player.velocityZ += Math.cos(player.angle) * player.speed * -joystickY;
                player.angle -= joystickX * player.turnSpeed * 1.5; // Extra turn sensitivity
            }

            // Update position
            const newX = player.x + player.velocityX;
            const newZ = player.z + player.velocityZ;
            if (!collides(newX, newZ, 0.25)) {
                player.x = newX;
                player.z = newZ;
            } else {
                if (!collides(newX, player.z, 0.25)) player.x = newX;
                if (!collides(player.x, newZ, 0.25)) player.z = newZ;
            }

            character.position.set(player.x, 1, player.z);
            character.rotation.y = -player.angle;
            updateCamera();

            // Win condition
            if (Math.hypot(player.x - (mazeSize - 2), player.z - (mazeSize - 2)) < 0.5) {
                alert('You escaped the cosmic labyrinth!');
                window.location.reload();
            }

            renderer.render(scene, camera);
        }
        animate();

        // Update camera
        function updateCamera() {
            const offset = cameraOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), player.angle);
            camera.position.set(player.x + offset.x, offset.y, player.z + offset.z);
            camera.lookAt(character.position);
        }

        // Collision detection
        function collides(x, z, radius = 0.25) {
            const gridX = Math.floor(x);
            const gridZ = Math.floor(z);
            const offset = radius;
            return (
                gridX < 0 || gridX >= mazeSize || gridZ < 0 || gridZ >= mazeSize ||
                maze[gridX][gridZ] === 1 ||
                (x - gridX < offset && gridX > 0 && maze[gridX - 1][gridZ] === 1) ||
                (gridX + 1 - x < offset && gridX < mazeSize - 1 && maze[gridX + 1][gridZ] === 1) ||
                (z - gridZ < offset && gridZ > 0 && maze[gridX][gridZ - 1] === 1) ||
                (gridZ + 1 - z < offset && gridZ < mazeSize - 1 && maze[gridX][gridZ + 1] === 1)
            );
        }

        // Resize handler
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });

        console.log('Setup complete');
    </script>
</body>
</html>
