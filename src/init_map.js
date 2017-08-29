var init_map = '\
1100000000001111111111111111111111111000001111111\
1000000000000111111111111111111111110000000111111\
0000000000000011111111111111111110000000000001111\
0000000000000011111111111111111100000000000000111\
0000000000000000000000000000000000000000000000011\
0000000000000000000000000000000000000000000000011\
0000000000000000000000000000000000000000000000011\
0000000000000000000000000000000000011111000000011\
0000000000000011111111111111111111111110000000011\
0000000000000011111111111111111111111000000000011\
1000000000000111111111111111111111000000000000011\
1100000000001111111111111111111111000000000000111\
1111111111111111111111111111111111100000000001111\
1111111111111111111111111111111111100000000011111\
1111111111111111111111111111111111100000111111111\
1111111111111111111111111111111111100000111111111\
1111111111111111111111111111111110000001111111111\
1111111111111111111111111111111111000000001111111\
1111111111111111111111111111111100000000000000011\
1111111111111111111111111111111111100000000000001\
1111111111111111111111111111111111111111000000000\
1111111111111111111111111111111111111100000000001\
1111111111111111111111111111111111110000000001111\
1111111111111111111111111111111111111100000001111\
1111111111111111111111111111111111111100000001111\
1111111111111111111111111111111111111000000001111\
1111111111111111111111111111111111111000000001111\
1111111111111111111111111111111111110000000001111\
1100000000000000000000011111111111111110000000111\
1000000000000000000000111111111111111100000001111\
1100000000000000000000011111111111111100000000111\
1000000000000000000000111111111111100000000001111\
1000000000000000000000111111111111100000000001111\
1000000000000000000000111111111111100000001111111\
1100000000000000000001111111111111000000000000001\
1100000000000000000000000000000000000000000000001\
1100000000000000000000000000000000000000000000111\
1110000000000000000000000000000000000000000001111\
1111111111111111111100000000000000111111111111111';

function loadInitMap() {
	player.spawn(6, 7);
	gravSource.push(new BlackHole(12, 34));
	enemies.push(new Enemy(26, 7, ENEMY_BEHAVE_VERT));
	enemies.push(new Enemy(30, 5, ENEMY_BEHAVE_VERT));
	enemies.push(new Enemy(41, 26, ENEMY_BEHAVE_HORIZ));
	collectables.push(new Collectable(47, 35));

	universe.mapWidth = 49;
	universe.mapHeight = 39;

	for (i = 0; i < init_map.length; ++i) {
		var c = init_map.charAt(i);
		var val = parseInt(c, 10);
		if (!isNaN(val)) {
			mapTiles.push({ type: val });
		}
	}

	setupTutorial();

	postMapLoad();
}


function setupTutorial() {
	window.setTimeout(function() {
		overlayWords.push({ x: player.x - 30, y: player.y - 30, lift: 0, text: 'W/A/S/D = move' });
	}, 1000);

	window.setTimeout(function() {
		overlayWords.push({ x: player.x - 30, y: player.y - 30, lift: 0, text: 'Mouse = aim' });
	}, 2500);

	window.setTimeout(function() {
		overlayWords.push({ x: player.x - 30, y: player.y - 30, lift: 0, text: 'Click = shoot' });
	}, 3500);

	var zone = window.setInterval(function() {
		console.log(player.x, player.y);
		if (player.x >= 1000 && player.y >= 330) {
			window.clearInterval(zone);
			setupTutorialTwo();
		}
	}, 500);
}


function setupTutorialTwo() {
	overlayWords.push({ x: player.x - 40, y: player.y - 30, lift: 0, text: 'Collect electronics' });

	window.setTimeout(function() {
		overlayWords.push({ x: player.x - 40, y: player.y - 30, lift: 0, text: 'Repair teleporter' });
	}, 1000);

	window.setTimeout(function() {
		overlayWords.push({ x: player.x - 40, y: player.y - 30, lift: 0, text: 'Find a way home' });
	}, 2000);
}
