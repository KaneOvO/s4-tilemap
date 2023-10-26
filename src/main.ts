import "./style.css";

//setting up the multiple canvases
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

const selectCanvas = document.getElementById(
  "selectCanvas"
) as HTMLCanvasElement;
const selectCtx = selectCanvas.getContext("2d") as CanvasRenderingContext2D;

//defining the textures to use
const imageUrls = [
  "/tile1.png",
  "/tile2.png",
  "/tile3.png",
  "/tile4.png",
  "/tile5.png",
  "/tile6.png",
  "/tile7.png",
  "/tile8.png",
];

//defining the size of the main grid
const numTiles = 32;
const tileSize = gridCanvas.width / numTiles;

//defining the size of the select grid
const numSelectables = imageUrls.length;
const selectHeight = selectCanvas.height / numSelectables;

class TileStrorage {
  private tiles: {
    [key: string]: HTMLImageElement;
  } = {};

  getTile(url: string): HTMLImageElement {
    if (!this.tiles[url]) {
      const img = new Image();
      img.src = url;
      this.tiles[url] = img;
    }
    return this.tiles[url];
  }
}

//creating the tilemap nested array
let tilemap: string[][] = Array.from({ length: numTiles }, () =>
  Array.from({ length: numTiles }, () => "/tile1.png")
);

const tileStorage = new TileStrorage();

//track the selected tile
let currentTile = "/tile1.png";

function preloadAllImages(urls: string[], callback: () => void) {
  let loadedCount = 0;

  urls.forEach((url) => {
    const img = new Image();
    img.onload = () => {
      loadedCount++;
      if (loadedCount === urls.length) {
        callback();
      }
    };
    img.src = url;
  });
}

preloadAllImages(imageUrls, () => {
  redrawTilemap();
  drawSelectCanvas();
});

//Function that draws a texture to a specific canvas ctx
function drawTexture(
  row: number,
  col: number,
  ctx: CanvasRenderingContext2D,
  url: string,
  width: number,
  height: number,
  cellSize: number
) {
  const tile = tileStorage.getTile(url);
  ctx.drawImage(tile, row * cellSize, col * cellSize, width, height);
}

// ----- Interacting with the main tilemap -----

function redrawTilemap() {
  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  for (let i = 0; i < numTiles; i++) {
    for (let j = 0; j < numTiles; j++) {
      drawTexture(
        i,
        j,
        gridCtx,
        tilemap[i][j],
        gridCanvas.width / numTiles,
        gridCanvas.height / numTiles,
        tileSize
      );
    }
  }
}

gridCanvas.addEventListener("click", (e) => {
  const coordX = Math.trunc(e.offsetX / tileSize);
  const coordY = Math.trunc(e.offsetY / tileSize);
  tilemap[coordX][coordY] = currentTile;
  redrawTilemap();
});

// ----- Interacting with the selectable tilemap -----

// Loop through the selectable tiles and draw textures in each cell
function drawSelectCanvas() {
  for (let i = 0; i < numSelectables; i++) {
    drawTexture(
      0,
      i,
      selectCtx,
      imageUrls[i],
      selectCanvas.width,
      selectHeight,
      64
    );
  }
}

// selectCanvas.addEventListener("click", (e) => {
//   const coordY = Math.trunc(e.offsetY / selectHeight);
//   currentTile = imageUrls[coordY];
// });

let isDraw = false;

gridCanvas.addEventListener("mousedown", () => {
  isDraw = true;
});

gridCanvas.addEventListener("mousemove", (e) => {
  if (isDraw) {
    const coordX = Math.trunc(e.offsetX / tileSize);
    const coordY = Math.trunc(e.offsetY / tileSize);
    tilemap[coordX][coordY] = currentTile;
    redrawTilemap();
  }
});

gridCanvas.addEventListener("mouseup", () => {
  isDraw = false;
});

// ... 

selectCanvas.addEventListener("click", (e) => {
  const coordY = Math.trunc(e.offsetY / selectHeight);
  currentTile = imageUrls[coordY];
});
