var mapBuffer, mapTiles;


function getTile(x, y) {
	return mapTiles[universe.mapWidth * y + x];
}


function setTile(x, y, val) {
	mapTiles[universe.mapWidth * y + x] = val;
}


function cleanupExistingMap()
{
	gravSource.length = 0;
	enemies.length = 0;
	collectables.length = 0;
	bullets.length = 0;
	overlayWords.length = 0;
}


function generateNewMap() {
	universe.mapWidth = 100;
	universe.mapHeight = 100;

	mapBuffer = new ArrayBuffer(universe.mapWidth * universe.mapHeight);
	mapTiles = new Uint8Array(mapBuffer);

	var pois = [];
	var i, x, y, r, px, py;

	// Set whole map to "walls"
	for (i = 0; i < mapTiles.length; ++i) {
		mapTiles[i] = 1;
	}

	// Generate an even number of POIs (point of interest)
	for (i = 0; i < 8; ++i) {
		var x = getRandomInt(10, universe.mapWidth - 20);
		var y = getRandomInt(10, universe.mapHeight - 20);
		var r = getRandomInt(5, 10);

		generateCircle(x, y, r, 0);

		// Need to know distance from the spawn point
		r = Math_pow(px - x, 2) + Math_pow(py - y, 2);

		// Don't spawn everthing right in the middle
		x += getRandomInt(-3, 3);
		y += getRandomInt(-3, 3);

		if (i == 0) {
			px = x;
			py = y;

		} else if (gravSource.length < 2 && r >= 15*15) {
			// Create gravity source - only if far enough from the player
			generateCircle(x, y, 15, 0);
			gravSource.push(new BlackHole(x, y));

		} else if (collectables.length < 1 && r >= 20*20) {
			collectables.push(new Collectable(x, y));

			x += getRandomInt(-3, 3);
			y += getRandomInt(-3, 3);
			enemies.push(new Enemy(x, y, getRandomInt(0, 1)));

		} else {
			enemies.push(new Enemy(x, y, getRandomInt(0, 1)));
		}

		pois.push({ x: x, y: y });
	}

	// Draw lines between pairs of POIs
	for (i = 0; i < pois.length; i += 2) {
		generateLine(pois[i].x, pois[i].y, pois[i+1].x, pois[i+1].y, 0);
	}

	// Find 'orphan' POIs - unaccessable by the player
	var orphans = [];
	var coord = { x: px, y: py };
	for (i = 1; i < pois.length; ++i) {
		var path = astarSearch(coord, pois[i]);
		if (path.length == 0) {
			orphans.push(pois[i]);
		}
	}

	// Draw a line from the player to each orphan in succession
	// Player --> Orph1 --> Orph2 --> Orph3 --> etc
	for (i = 0; i < orphans.length; ++i) {
		generateLine(coord.x, coord.y, orphans[i].x, orphans[i].y, 0);
		coord = orphans[i];
	}

	// Ensure enough enemies
	while (enemies.length < universe.numEnemies) {
		var x = getRandomInt(0, universe.mapWidth);
		var y = getRandomInt(0, universe.mapHeight);
		var t = getTile(x, y);
		if (t == 0) {
			enemies.push(new Enemy(x, y, getRandomInt(0, 1)));
		}
	}

	// Spawn a weapon near the player. They'll feel so lucky!
	if (getRandomInt(1, 100) >= (100 - universe.weaponSpawnChance)) {
		var x, y, t;
		do {
			x = getRandomInt(px - 10, px + 10);
			y = getRandomInt(py - 10, py + 10);
			t = getTile(x, y);
		} while (t != 0);

		if (getRandomInt(1, 10) > 5) {
			collectables.push(new Gun(x, y, getRandomInt(0, 1)));
		} else {
			collectables.push(new Heart(x, y));
		}

		universe.weaponSpawnChance = 2;
	}

	player.spawn(px, py);
	postMapLoad();
}


function generateHeavenMap() {
	universe.mapWidth = 50;
	universe.mapHeight = 50;

	mapBuffer = new ArrayBuffer(universe.mapWidth * universe.mapHeight);
	mapTiles = new Uint8Array(mapBuffer);

	// Set whole map to "walls"
	for (i = 0; i < mapTiles.length; ++i) {
		mapTiles[i] = 1;
	}

	// Create some clouds
	generateCircle(15, 25, 8, 0);
	generateCircle(25, 25, 4, 0);
	generateCircle(35, 25, 8, 0);

	for (var i = 0; i < 4; ++i) {
		generateCircle(getRandomInt(5, 45), getRandomInt(5, 45), 3, 0);
	}
	
	player.spawn(25, 25);

	postMapLoad();
}


/**
 * Brute force circle drawing
 */
function generateCircle(originX, originY, radius, val)
{
	var x, y;
	var radiusSquared = radius * radius;

	for (y = -radius; y <= radius; ++y) {
		for (x = -radius; x <= radius; ++x) {
			if ((x * x + y * y) <= radiusSquared) {
				setTile(originX + x, originY + y, val);
			}
		}
	}
}


function generateRect3x3(x, y, val)
{
	--x; --y; i = 9;
	while (i-- != 0) {
		setTile(x, y, val);
		x++;
		if (i % 3 == 0) { x -= 3; ++y; }
	}
}


/**
 * Bresenham's line algorithm
 */
function generateLine(x0, y0, x1, y1, val) {
	var dx = Math_abs(x1 - x0);
	var dy = Math_abs(y1 - y0);
	var sx = (x0 < x1) ? 1 : -1;
	var sy = (y0 < y1) ? 1 : -1;
	var err = dx - dy;

	while (true) {
		var t = getRandomInt(2, 25);
		if (t >= 4) {
			generateRect3x3(x0, y0, val);
		} else {
			generateCircle(x0, y0, t + 2, val);
		}

		if ((x0 == x1) && (y0 == y1)) {
			break;
		}

		var e2 = 2 * err;
		if (e2 > -dy){
			err -= dy;
			x0 += sx;
		}
		if (e2 < dx) {
			err += dx;
			y0  += sy;
		}
	}
}
