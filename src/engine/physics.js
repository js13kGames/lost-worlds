var accel = { x: 0, y: 0 };


function physics(delta) {
	universeRot += universeRotDir * delta;
	if (universe.spinLimit > 0.2 && Math_abs(universeRot) >= universe.spinLimit) {
		universeRotDir = 0 - universeRotDir;
	}

	for (var i = 0; i < enemies.length; ++i) {
		enemies[i].update(delta);
	}

	if (player) {
		var force = { x: 0.0, y: 0.0 }
		if (universe.orientation == 1) {
			movePlayer_TopView(force, delta);
		}
		if (universe.orientation == 2) {
			movePlayer_SideView(force, delta);
		}
		applyGravityPull(force, delta);
		
		player.x += force.x;
		player.y += force.y;

		checkCollide(player);

		var thresh = Math_pow(250, 2);
		for (var i = 0; i < enemies.length; ++i) {
			var distSq = Math_pow(player.x - enemies[i].x, 2) + Math_pow(player.y - enemies[i].y, 2);
			if (distSq < enemies[i].hitDistSq) {
				enemies[i].hitPlayer();
			}
		}
	}
}


function movePlayer_TopView(force, delta)
{
	// Point player towards the mouse
	if (mouse.x && mouse.y) {
		player.rot = Math_atan2(
			(mouse.y - canvas.height/2), (mouse.x - canvas.width/2)
		) + Math_PI;
	}

	// Forwards and backwards
	if (keys.y != 0) {
		accel.y += (keys.y * universe.unitAccel * delta);
		if (accel.y > universe.unitMax) accel.y = universe.unitMax;
		if (accel.y < 0 - universe.unitMax) accel.y = 0 - universe.unitMax;
	} else {
		accel.y /= universe.unitDeccel;
	}
	force.x += Math_cos(player.rot) * accel.y * delta;
	force.y += Math_sin(player.rot) * accel.y * delta;

	// Strafe
	if (keys.x != 0) {
		accel.x += (keys.x * universe.unitAccel * delta);
		if (accel.x > universe.unitMax) accel.x = universe.unitMax;
		if (accel.x < 0 - universe.unitMax) accel.x = 0 - universe.unitMax;
	} else {
		accel.x /= universe.unitDeccel;
	}
	force.x += Math_cos(player.rot - Math_PI/2) * accel.x * delta;
	force.y += Math_sin(player.rot - Math_PI/2) * accel.x * delta;
}


function movePlayer_SideView(force, delta)
{
	// Point player in movement direction
	if (keys.x == 1) player.rot = Math_PI;
	if (keys.x == -1) player.rot = 0;

	// Horizontal movement
	if (keys.x != 0) {
		accel.x += (keys.x * universe.unitAccel * delta);
		if (accel.x > universe.unitMax) accel.x = universe.unitMax;
		if (accel.x < 0 - universe.unitMax) accel.x = 0 - universe.unitMax;
	} else {
		accel.x /= universe.unitDeccel;
	}
	force.x += accel.x * delta;

	if (keys.jump == 1) {
		force.y = -500.0 * delta;
	} else {
		force.y = 350.0 * delta;
	}
}


function applyGravityPull(force, delta)
{
	for (var i = 0; i < gravSource.length; ++i) {
		var src = gravSource[i];
		src.dist = Math_sqrt(Math_pow(player.x - src.x, 2) + Math_pow(player.y - src.y, 2));

		if (src.dist < 30) {
			newUniverse();
		} else if (src.dist < 750) {
			src.strength = 1.0 / (src.dist * src.dist);
			src.strength *= 2000.0;
			force.x -= ((player.x - src.x) / 1.0 * src.strength);
			force.y -= ((player.y - src.y) / 1.0 * src.strength);
		}
	}
}



function checkCollide(entity, hit) {
	collidePlayer(entity, -1.0, 0.0, hit);
	collidePlayer(entity, +1.0, 0.0, hit);
	collidePlayer(entity, 0.0, -1.0, hit);
	collidePlayer(entity, 0.0, +1.0, hit);
}

function collidePlayer(entity, xSign, ySign, hit) {
	var tileX = Math_floor((entity.x + HALF_PLAYER_SIZE * xSign) / universe.tileSize);
	var tileY = Math_floor((entity.y + HALF_PLAYER_SIZE * ySign) / universe.tileSize);

	var tileType = getTile(tileX, tileY);

	if (tileType > 0) {
		if (xSign != 0) {
			var tileXpx = tileX * universe.tileSize;
			if (xSign < 0) tileXpx += universe.tileSize;
			entity.x =  tileXpx - (HALF_PLAYER_SIZE * xSign);
			hit && hit('x', xSign);
		}

		if (ySign != 0) {
			var tileYpx = tileY * universe.tileSize;
			if (ySign < 0) tileYpx += universe.tileSize;
			entity.y =  tileYpx - (HALF_PLAYER_SIZE * ySign);
			hit && hit('y', ySign);
		}
	}
}
