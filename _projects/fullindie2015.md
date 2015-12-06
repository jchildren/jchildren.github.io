---
layout: project
title:  "Full Indie Games Jam"
thumbnail: "game-jam.png"
alttext: "A screenshot"
---

A Unity card based action game built in a weekend with [Julien Collée][julien] and Thomas Paterson


<img src="https://jchildren.github.io/image/projects/main_title_02.png" />


<div class="row">
  <div class="col-xs-12 col-md-4">
  <a data-toggle="lightbox" href="#tiltedSprites" class="thumbnail">
  <img src="https://jchildren.github.io/image/projects/tilted-sprites.png" />
  </a>
  </div>
  <div class="col-xs-12 col-md-4">
  <a data-toggle="lightbox" href="#generatedMap" class="thumbnail">
  <img src="https://jchildren.github.io/image/projects/generated-map.png" />
  </a>
  </div>
  <div class="col-xs-12 col-md-4">
  <a data-toggle="lightbox" href="#fullMap" class="thumbnail">
  <img src="https://jchildren.github.io/image/projects/full-map.png" />
  </a>
  </div>
</div>

<div id="tiltedSprites" class="lightbox hide fade"  tabindex="-1" role="dialog" aria-hidden="true">
	<div class='lightbox-content'>
		<img src="https://jchildren.github.io/image/projects/tilted-sprites.png">
		<div class="lightbox-caption"><p>Overview of a single player level</p></div>
	</div>
</div>
<div id="generatedMap" class="lightbox hide fade"  tabindex="-1" role="dialog" aria-hidden="true">
	<div class='lightbox-content'>
		<img src="https://jchildren.github.io/image/projects/generated-map.png" />
		<div class="lightbox-caption"><p>The viewport</p></div>
	</div>
</div>
<div id="fullMap" class="lightbox hide fade"  tabindex="-1" role="dialog" aria-hidden="true">
	<div class='lightbox-content'>
		<img src="https://jchildren.github.io/image/projects/full-map.png" />
		<div class="lightbox-caption"><p>A full singleplayer map</p></div>
	</div>
</div>

~~~cs
public class Generator : MonoBehaviour {

	public static Generator instance;

	public List<Room> rooms = new List<Room>();
	public Dictionary<int,int> map = new Dictionary<int,int>();
	public GeneratorConfig config;
	public Dictionary<int, bool> enemyLocations = new Dictionary<int, bool>();
	public Dictionary<int, bool> manaGenerators = new Dictionary<int, bool>();
	public Dictionary<int, int> obstacles = new Dictionary<int, int>();
	public List<Vector2> spawns = new List<Vector2>();
	public Vector2 end = new Vector2();

	private System.Random rand = new System.Random();
}
~~~

~~~cs
for (int r = 0; r <= config.maxRooms; r++) {

	int w = rand.Next (config.minRoomSize, config.maxRoomSize);
	int h = rand.Next (config.minRoomSize, config.maxRoomSize);

	float u1 = (float)rand.NextDouble(); //these are uniform(0,1) random doubles
	float u2 = (float)rand.NextDouble();
	float randStdNormal = Mathf.Sqrt(-2.0f * Mathf.Log(u1)) *
		Mathf.Sin(2.0f * Mathf.PI * u2); //random normal(0,1)
	float randNormal =
		(float)(config.mapWidth /2) + config.standardDeviation * randStdNormal; //random normal(mean,stdDev^2)
	
	int x = (int)randNormal;

	u1 = (float)rand.NextDouble(); //these are uniform(0,1) random doubles
	u2 = (float)rand.NextDouble();
	randStdNormal = Mathf.Sqrt(-2.0f * Mathf.Log(u1)) *
		Mathf.Sin(2.0f * Mathf.PI * u2); //random normal(0,1)
	randNormal =
		(float)(config.mapHeight /2) + config.standardDeviation * randStdNormal; //random normal(mean,stdDev^2)

	int y = (int)randNormal;

	Room newRoom = new Room();
	newRoom.SetSize (x, y, w, h);
	
}
~~~

~~~cs
bool failed = false;
foreach (Room otherRoom in rooms) {
	if (newRoom.IsIntersecting (otherRoom)) {
		failed = true;
		r--;
		failCount++;
		break;
	} else if (newRoom.x1 < 0 || newRoom.x2 >= config.mapWidth){
		failed = true;
		r--;
		failCount++;
		break;
	} else if (newRoom.y1 < 0 || newRoom.y2 >= config.mapHeight){
		failed = true;
		r--;
		failCount++;
		break;
	}
}
~~~


~~~cs
private int PlaceRectangle (int x1, int x2, int y1, int y2)
{
	int smallX = Mathf.Min (x1, x2);
	int bigX = Mathf.Max (x1, x2);

	int smallY = Mathf.Min (y1, y2);
	int bigY = Mathf.Max (y1, y2);

	for (int x = smallX; x <= bigX; x++) {
		for (int y = smallY; y <= bigY; y++) {
			map[x + y * config.mapWidth] = 0;
		}
	}

	return 0;
}
~~~

<div class="row">
  <div class="col-xs-12 col-md-4">
  <a href="#" class="thumbnail">
  <img src="https://jchildren.github.io/image/projects/nt/no-corridors.png" />
  </a>
  </div>
  <div class="col-xs-12 col-md-4">
  <a href="#" class="thumbnail">
  <img src="https://jchildren.github.io/image/projects/nt/no-corridors-low-sd.png" />
  </a>
  </div>
  <div class="col-xs-12 col-md-4">
  <a href="#" class="thumbnail">
  <img src="https://jchildren.github.io/image/projects/nt/no-corridors-many.png" />
  </a>
  </div>
</div>

~~~cs
if (!failed) {
	// places a rectangular room on the map
	PlaceRectangle(newRoom.x1, newRoom.x2, newRoom.y1, newRoom.y2);

	foreach (Room otherRoom in rooms){
		int corridorWidth = rand.Next (config.minCorridorWidth, config.maxCorridorWidth);
		int halfCorridorWidth = Mathf.Min(2, corridorWidth / 2);
		// carve out corridors between rooms based on centers
		// randomly start with horizontal or vertical corridors
		// plots from previous center to new center
		int corridorChance;
		if (otherRoom.connections == 0){
			corridorChance = rand.Next (0, 1);
			otherRoom.connections++;
		} else {
			corridorChance = rand.Next (0, otherRoom.connections * 50);
		}



		if (corridorChance == 0) {
			// vertical
			PlaceRectangle((int)newRoom.center.x - halfCorridorWidth, (int)newRoom.center.x + halfCorridorWidth,
							(int)newRoom.center.y, (int)otherRoom.center.y);
			// horizontal
			PlaceRectangle((int)newRoom.center.x, (int)otherRoom.center.x, 
							(int)otherRoom.center.y - halfCorridorWidth, (int)otherRoom.center.y + halfCorridorWidth);
			otherRoom.connections++;
		}else if (corridorChance == 1){
			// horizontal
			PlaceRectangle((int)newRoom.center.x, (int)otherRoom.center.x, 
							(int)newRoom.center.y - halfCorridorWidth, (int)newRoom.center.y + halfCorridorWidth);
			// vertical
			PlaceRectangle((int)otherRoom.center.x - halfCorridorWidth, (int)otherRoom.center.x + halfCorridorWidth,
							(int)newRoom.center.y, (int)otherRoom.center.y);
			otherRoom.connections++;
		} else if (corridorChance == 3){
			// horizontal
			PlaceRectangle(0, 0, 
							(int)newRoom.center.y - halfCorridorWidth, (int)newRoom.center.y + halfCorridorWidth);
			// vertical
			PlaceRectangle((int)otherRoom.center.x - halfCorridorWidth, (int)otherRoom.center.x + halfCorridorWidth,
							0, 0);
		}

	}
	// add newRoom to end of rooms list
	rooms.Add (newRoom);
}

if (failCount >= config.errorLimit)
	break;
}
~~~

<div class="row">
  <div class="col-xs-12 col-md-4">
  <a href="#" class="thumbnail">
  <img src="https://jchildren.github.io/image/projects/nt/basic-map-1.png" />
  </a>
  </div>
  <div class="col-xs-12 col-md-4">
  <a href="#" class="thumbnail">
  <img src="https://jchildren.github.io/image/projects/nt/basic-map-2.png" />
  </a>
  </div>
  <div class="col-xs-12 col-md-4">
  <a href="#" class="thumbnail">
  <img src="https://jchildren.github.io/image/projects/nt/high-room-number.png" />
  </a>
  </div>
</div>


~~~cs
// add noise
foreach (int x in width) {
	foreach (int y in height) {
		if (Mathf.PerlinNoise((float)x / 5.0f, (float)y / 5.0f) >= 0.55f)
			map[x + y * config.mapWidth] = 1;
	}
}
~~~

~~~cs
// add noise
foreach (int x in width) {
	foreach (int y in height) {
		if (Mathf.PerlinNoise((float)x / 8.0f, (float)y / 8.0f) >= 0.6f){
			map[x + y * config.mapWidth] = 2;
			if(rand.Next (0, 10) == 0){
				obstacles[x + y * config.mapWidth] = 1;
			}
		}
	}
}
~~~

~~~cs
// add noise
foreach (int x in width) {
	foreach (int y in height) {
		if (Mathf.PerlinNoise((float)x / 6.0f, (float)y / 6.0f) >= 0.65f){

			map[x + y * config.mapWidth] = 3;
		}
	}
}
~~~

~~~cs
// add noise
foreach (int x in width) {
	foreach (int y in height) {
		if (Mathf.PerlinNoise((float)x / 5.0f, (float)y / 5.0f) >= 0.7f) {
			map[x + y * config.mapWidth] = 0;

			if(rand.Next (0, 10) == 0){
				obstacles[x + y * config.mapWidth] = 3;
			}
		}
	}
}
~~~

<div class="row">
  <div class="col-xs-12 col-md-4">
  <a href="#" class="thumbnail">
  <img src="https://jchildren.github.io/image/projects/nt/noise-1.png" />
  </a>
  </div>
  <div class="col-xs-12 col-md-4">
  <a href="#" class="thumbnail">
  <img src="https://jchildren.github.io/image/projects/nt/noise-2.png" />
  </a>
  </div>
  <div class="col-xs-12 col-md-4">
  <a href="#" class="thumbnail">
  <img src="https://jchildren.github.io/image/projects/nt/obstacles.png" />
  </a>
  </div>
</div>

~~~cs
Vector2 mapCenter = new Vector2 (config.mapWidth / 2, config.mapHeight / 2);

// generate enemy information
foreach (Room room in rooms) {
	room.difficulty = (int)Vector2.Distance (mapCenter, room.center);
	int enemies = rand.Next(2, Mathf.Max(3, room.difficulty / 5));
	for (int e = 0; e < enemies; e++){
		int enemyX = rand.Next (room.x1, room.x2);
		int enemyY = rand.Next (room.y1, room.y2);

		enemyLocations[enemyX + enemyY * config.mapWidth] = true;
	
	}
}
~~~

~~~cs

List<Room> orderedRooms = rooms.OrderBy(r=>r.difficulty).ToList();

spawns.Add (orderedRooms.First ().center - Vector2.down);
spawns.Add (orderedRooms.First ().center - Vector2.up);
spawns.Add (orderedRooms.First ().center - Vector2.left);
spawns.Add (orderedRooms.First ().center - Vector2.right);
end = orderedRooms.Last ().center;

for (int x = orderedRooms.First ().x1; x < orderedRooms.First ().x2; x++) {
	for (int y = orderedRooms.First ().y1; y < orderedRooms.First ().y2; y++) {
		map[x + y * config.mapWidth] = 0;
	}
}
~~~

~~~cs
for (int x = orderedRooms.Last ().x1; x < orderedRooms.Last ().x2; x++) {
	for (int y = orderedRooms.Last ().y1; y < orderedRooms.Last ().y2; y++) {
		map[x + y * config.mapWidth] = 0;
	}
}
~~~

~~~cs
foreach (Room room in rooms) {
	int genX = rand.Next (room.x1, room.x2);
	int genY = rand.Next (room.y1, room.y2);

	manaGenerators[genX + genY * config.mapWidth] = true;
}
~~~


~~~cs
public int SpawnMonsters () {

	for (int x = 0; x < config.mapWidth; x++) {
		for (int y = 0; y < config.mapHeight; y++) {
			if (this.enemyLocations[x + y * config.mapWidth] == true){
				int monsterType = rand.Next (0, 4); // set second argument to monster number - 1
				Vector3 location = new Vector3(1.5f * ((float)x - (float)config.mapWidth / 2), 2.0f, 1.5f * ((float)y - (float)config.mapHeight / 2));
				GameObject enemy = (GameObject) Instantiate(LevelManager.instance.monsters[monsterType], location, Quaternion.identity);
				enemy.GetComponent<Character>().faction = 4;
			}
		}
	}
	return 0;
}
~~~


[julien]:	https://ca.linkedin.com/in/juliencollee