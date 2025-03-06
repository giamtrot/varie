import axios from "axios";
import { Jimp } from "jimp";
import fs from "fs";

// Google Static Maps API Key (Replace with your key)
const API_KEY = "AIzaSyA9Ft1vRsvUIuJEyA75nw63iBiapEYiTi0";

// Coordinates (bounding box)
const coords = {
    topLeft: { lat: 45.5409, lon: 8.9967 },
    topRight: { lat: 45.5409, lon: 9.0021 },
    bottomLeft: { lat: 45.5380, lon: 8.9967 },
    bottomRight: { lat: 45.5380, lon: 9.0021 },
};

// Settings
const zoom = 18;
const size = 640; // Max per tile (scale=2 gives 1280x1280)
const scale = 2; // High-DPI scaling (1x = 640px, 2x = 1280px)
const rows = 3; // Grid rows
const cols = 3; // Grid columns
const xOver = 1280 - 1008
const yOver = 1280 - 772;
const outputFile = "stitched_map.jpg";

// Generate tile URLs
function getTileUrl(lat, lon) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=${zoom}&size=${size}x${size}&scale=${scale}&maptype=satellite&key=${API_KEY}`;
}

// Generate grid of coordinates
function getGridCoords() {
    const latStep = (coords.topLeft.lat - coords.bottomLeft.lat) / (rows - 1);
    const lonStep = (coords.topRight.lon - coords.topLeft.lon) / (cols - 1);

    let grid = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let lat = coords.topLeft.lat - r * latStep;
            let lon = coords.topLeft.lon + c * lonStep;
            grid.push({ r, c, lat, lon });
        }
    }
    return grid;
}

// Download an image from URL
async function downloadImage(url, filename) {
    // const response = await axios({ url, responseType: "arraybuffer" });
    // fs.writeFileSync(filename, response.data);
    return filename;
}

// Download and stitch images
async function stitchImages() {
    const grid = getGridCoords();
    const tileSize = size * scale;
    const finalWidth = tileSize * cols - xOver * (cols - 1);
    const finalHeight = tileSize * rows - yOver * (rows - 1) - 50;
    let stitchedImage = new Jimp({ width: finalWidth, height: finalHeight });

    for (let i = 0; i < grid.length; i++) {
        const { r, c, lat, lon } = grid[i];
        // console.log(grid[i])
        const url = getTileUrl(lat, lon);
        const filename = `tile_${r}x${c}.jpg`;

        console.log(`Downloading tile ${i + 1}/${grid.length}...`);
        await downloadImage(url, filename);

        // Load tile
        const image = await Jimp.read(filename);
        let x = (i % cols) * tileSize - xOver * c;
        let y = Math.floor(i / cols) * tileSize - yOver * r;
        console.log(r, c, x, y)
        // Composite tile into final image
        stitchedImage.composite(image, x, y);
    }

    // Save stitched image
    await stitchedImage.write(outputFile);
    console.log(`✅ Stitched map saved as ${outputFile}`);
}

// Run script
stitchImages().catch(console.error);
