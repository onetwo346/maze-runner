<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maze Runner - Game</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background: #000;
            font-family: 'Orbitron', sans-serif;
        }
        canvas {
            display: block;
        }
        #controls {
            position: absolute;
            top: 10px;
            left: 10px;
            color: #00ffcc;
            text-shadow: 0 0 5px #00ffcc;
            font-size: 1.2em;
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron&display=swap" rel="stylesheet">
</head>
<body>
    <div id="controls">Swipe or use arrows to move</div>
    <canvas id="gameCanvas"></canvas>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
    <script>
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Player
        const player = { x: 1, y: 1, angle: 0 };
        camera.position.set(player.x, 1.5, player.y);
        camera.rotation.order = 'YXZ';

        // Maze generation (10x10 grid)
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

        // Core Exit (goal)
        const exitGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const exitMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        const exit = new THREE.Mesh(exitGeometry, exitMaterial);
        exit.position.set(mazeSize - 2, 0.5, mazeSize - 2);
        scene.add(exit);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        // Controls
        let moveForward = false, moveBackward = false, turnLeft = false, turnRight = false;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') moveForward = true;
            if (e.key === 'ArrowDown') moveBackward = true;
            if (e.key === 'ArrowLeft') turnLeft = true;
            if (e.key === 'ArrowRight') turnRight = true;
        });
        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowUp') moveForward = false;
            if (e.key === 'ArrowDown') moveBackward = false;
            if (e.key === 'ArrowLeft') turnLeft = false;
            if (e.key === 'ArrowRight') turnRight = false;
        });

        // Touch controls for iPhone
        let touchStartX = 0, touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        document.addEventListener('touchmove', (e) => {
            const deltaX = e.touches[0].clientX - touchStartX;
            const deltaY = e.touches[0].clientY - touchStartY;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                player.angle -= deltaX * 0.005;
            } else if (deltaY < -20) {
                moveForward = true;
            } else if (deltaY > 20) {
                moveBackward = true;
            }
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        document.addEventListener('touchend', () => {
            moveForward = false;
            moveBackward = false;
        });

        // Maze generation function
        function generateMaze(width, height) {
            const maze = Array(width).fill().map(() => Array(height).fill(1));
            function carve(x, y) {
                maze[x][y] = 0;
                const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]];
                directions.sort(() => Math.random() - 0.5);
                for (let [dx, dy] of directions) {
                    const nx = x + dx, ny = y + dy;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height && maze[nx][ny] === 1) {
                        maze[x + dx / 2][y + dy / 2] = 0;
                        carve(nx, ny);
                    }
                }
            }
            carve(1, 1);
            return maze;
        }

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            // Movement
            const speed = 0.05;
            if (moveForward || moveBackward) {
                const direction = moveForward ? 1 : -1;
                const newX = player.x + Math.sin(player.angle) * speed * direction;
                const newZ = player.y + Math.cos(player.angle) * speed * direction;
                if (!collides(newX, newZ)) {
                    player.x = newX;
                    player.y = newZ;
                }
            }
            if (turnLeft) player.angle += 0.05;
            if (turnRight) player.angle -= 0.05;

            camera.position.set(player.x, 1.5, player.y);
            camera.rotation.y = player.angle;

            // Check win condition
            if (Math.hypot(player.x - (mazeSize - 2), player.y - (mazeSize - 2)) < 0.5) {
                alert('You escaped the cosmic labyrinth!');
                window.location.reload();
            }

            renderer.render(scene, camera);
        }
        animate();

        // Collision detection
        function collides(x, z) {
            const gridX = Math.floor(x);
            const gridZ = Math.floor(z);
            return gridX < 0 || gridX >= mazeSize || gridZ < 0 || gridZ >= mazeSize || maze[gridX][gridZ] === 1;
        }

        // Resize handler
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });
    </script>
</body>
</html>
