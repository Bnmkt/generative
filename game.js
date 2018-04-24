const game = document.querySelector("canvas");
let direction = null;

window.addEventListener("keydown", (e)=>{
    direction=e.keyCode;
}, false);

const update = (ctx, obj)=>{
    ctx.clearRect(0,0, game.width, game.height);

    const random = (min, max)=>{
        return Math.floor(Math.random()*max)+min;
    };
    const isSolid = (what, where, x, y)=>{
        console.log(`x:${x} /y:${y}`);
        return what[where[y][x]].solid;
    }
    const weight = (array)=>{
        return array.map((el)=>{
            if(el.weight>0) {
                let elem = [];
                for (let i = 0; i < el.weight; i++) {
                    elem.push(el.name);
                }
                return elem.toString();
            }
        }).toString().split(",");
    };
    const toObj = (arr, by)=>{
        const obj = {};
        let selector = by?by:"name";
        for(let i=0;i<arr.length;i++){
            if(arr[i]!==undefined) obj[arr[i][selector]] = arr[i];
        }
        return obj;
    };
    const drawSprite = (x, y, image)=>{
        const img = new Image();
        img.src = `./images/${image}.png`;
        ctx.drawImage(img, x, y);
    };
    let vars = {
        "map":[],
        "player":{
            "x":0,
            "y":0,
            "image":"human"
        },
        "game":{
            "generated":false,
            "height":game.height,
            "width":game.width,
        },
        "tiles":{
            "type":[
                {
                    "name":"wall",
                    "weight":0,
                    "solid":1,
                    "color":"#111",
                    "image":"wall",
                    "count":0
                },{
                    "name":"dirt",
                    "weight":0,
                    "solid":0,
                    "color":"#553311",
                    "image":"dirt",
                    "count":0
                },{
                    "name":"grass",
                    "weight":30,
                    "solid":0,
                    "color":"#005521",
                    "image":"grass",
                    "count":0
                },{
                    "name":"water",
                    "weight":0,
                    "solid":1,
                    "color":"#1142aa",
                    "image":"water",
                    "count":0
                },{
                    "name":"lava",
                    "weight":0,
                    "solid":1,
                    "color":"#6a0126",
                    "image":"lava",
                    "count":0
                }
            ],
            "height":48,
            "width":48,
            "stroke":1,
            "strokeColor":"#666",
        }
    };
    if(obj) {
        if (obj.game === undefined) {
            for (let params in obj) {
                vars[params] = obj[params];
            }
        } else {
            if (obj.game.generated === true) {
                vars = obj;
            }
        }
    }
    let map = vars.map;
    let tiles = vars.tiles;
    let player = vars.player;
    if(!vars.game.generated && vars.game.generated!==true) {
        console.log(game.width, game.height)
        // defining other way to find tile
        tiles["typeByName"]=toObj(tiles.type);
        tiles["wtype"]= weight(tiles.type);
        // counting how many tiles can be on the screen
        vars.game["tilesX"] = Math.floor(game.width / tiles.width)-1;
        vars.game["tilesY"] = Math.floor(game.height / tiles.height)-1;

        if (!map[0]) { // If the map is not generated
            for (let y = 0; y <= vars.game.tilesY; y++) { // generating an array, the map
                map[y] = [];
                for (let x = 0; x <= vars.game.tilesX; x++) {
                    let value = "wall"; // default value of all tiles (WALL)
                    if (x !== 0 && x !== vars.game.tilesX && y !== 0 && y !== vars.game.tilesY) { // if we are not on the border
                        const r = random(0, tiles.wtype.length - 1); // we get a random number of weighted blocks
                        const blockN = tiles.wtype[r]; // the id refers to the weighted blocks
                        const block = tiles.typeByName[blockN]?tiles.typeByName[blockN]:tiles.typeByName["dirt"]; // and now we can get the true block element
                        block.count++;
                        value = block.name;
                        if (value === "wall") {
                            console.log("hum");
                        }
                    }
                    map[y][x] = value;
                }
            }
            // player position randomly generated
            let nx = random(1, vars.game.tilesX - 1);
            let ny = random(1, vars.game.tilesY - 1);
            player.x = nx;
            player.y = ny;
        }
        vars.game.generated = true;
    }
    // when the map is generated we have to draw what the array contains
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            let block = tiles.typeByName[map[y][x]];
            if (!block) {
                map[y][x] = "dirt";
                block = tiles.typeByName["dirt"]
            }
                if (block.image) { // if the true block contain an image
                    drawSprite(x * tiles.width, y * tiles.height, block.image); // we draw an image
                } else { // otherwise we draw a square with the block color
                    ctx.fillStyle = block.color;
                    ctx.fillRect(x * tiles.width, y * tiles.height, tiles.width, tiles.height);
                    ctx.strokeStyle = tiles.strokeColor;
                    ctx.strokeRect(x * tiles.width, y * tiles.height, tiles.width, tiles.height);
                }
            // after that we put the player on the top of the map
            if (player.x === x && player.y === y) {
                drawSprite(x * tiles.width, y * tiles.height, player.image);
            }

        }
    }

    if(direction){ // this condition is true web a keyboard event happen
        let bloc = tiles.typeByName;
        let tab = map;

        // tab[player.x][player.y]=0;
        let action = true;
        switch (direction) {
            case 37: //left
                if(!isSolid(bloc, tab, player.x-1, player.y))player.x--;
                break;
            case 38: //up
                if(!isSolid(bloc, tab, player.x, player.y-1))player.y--;
                break;
            case 39: //right
                if(!isSolid(bloc, tab, player.x+1, player.y))player.x++;
                break;
            case 40: //bottom
                if(!isSolid(bloc, tab, player.x, player.y+1))player.y++;
                break;
            case 97: // 1
                tab[player.y][player.x]="dirt";
                break;
            case 98: // 2
                tab[player.y][player.x]="grass";
                break;
            case 99: // 3
                tab[player.y][player.x]="water";
                break;
            case 100: // 4
                tab[player.y][player.x]="lava";
                break;
            case 111: // divide
                console.log(vars);
                break;
            case 106: // star
                console.log(vars.tiles.type);
                break;
            default:
                action = false;
        }
        direction=null; // and we reset the direction
    }

    window.requestAnimationFrame(()=>{update(ctx, vars)});
};
const init = (ctx)=>{
    update(ctx);
};

if(game.getContext) {
    const ctx = game.getContext("2d");
    game.height = window.innerHeight;
    game.width  = window.innerWidth;
    init(ctx)
}