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
    const weight = (array)=>{
        return array.map((el)=>{
            let elem = [];
            if(el.weight<0) el.weight=1;
            for(let i=0;i<el.weight;i++){
                elem.push(el.name);
            }
            return elem.toString();
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

    let vars = obj||{
        "game":{
            "height":game.height,
            "width":game.width,
            "tab":[],
            "player":{
                "x":0,
                "y":0,
                "image":"human"
            }
        },
        "tiles":{
            "type":[
                {
                    "name":"wall",
                    "weight":8,
                    "solid":1,
                    "color":"#111",
                    "image":"wall"
                },{
                    "name":"dirt",
                    "weight":20,
                    "solid":0,
                    "color":"#553311",
                    "image":"dirt"
                },{
                    "name":"grass",
                    "weight":20,
                    "solid":0,
                    "color":"#005521",
                    "image":"grass"
                },{
                    "name":"water",
                    "weight":14,
                    "solid":1,
                    "color":"#1142aa",
                    "image":"water"
                },{
                    "name":"lava",
                    "weight":2,
                    "solid":1,
                    "color":"#6a0126",
                    "image":"lava"
                }
            ],
            "height":48,
            "width":48,
            "stroke":1,
            "strokeColor":"#666",
        }
    };
    if(!vars.game.tab[0]) { // If not generated
        console.log("generating");
        // defining other way to find tile
        vars.tiles["typeByName"]=toObj(vars.tiles.type);
        vars.tiles["wtype"]= weight(vars.tiles.type);
        // counting how many tiles can be on the screen
        vars.game["tilesX"] = Math.floor(vars.game.width / vars.tiles.width);
        vars.game["tilesY"] = Math.floor(vars.game.height / vars.tiles.height);

        for (let x = 0; x <= vars.game.tilesX; x++) { // generating an array, the map
            vars.game.tab[x] = [];
            for (let y = 0; y <= vars.game.tilesY; y++) {
                let value = 0; // default value of all tiles (WALL)
                if (x !== 0 && x !== vars.game.tilesX && y !== 0 && y !== vars.game.tilesY) { // if we are not on the border
                    const r = random(0, vars.tiles.wtype.length-1); // we get a random number of weighted blocks
                    value = r;
                }
                vars.game.tab[x][y] = value;
            }
        }
        // player position randomly generated
        let nx = random(1, vars.game.tilesX - 1);
        let ny = random(1, vars.game.tilesY - 1);
        vars.game.player.x = nx;
        vars.game.player.y = ny;
    }
    // when the map is generated we have to draw what the array contains
    for (let x = 0; x < vars.game.tab.length; x++) {
        for (let y = 0; y < vars.game.tab[x].length; y++) {
            const r = vars.game.tab[x][y]; // getting an id
            const blockN = vars.tiles.wtype[r]; // the id refers to the weighted blocks
            const block = vars.tiles.typeByName[blockN]; // and now we can get the true block element
            if(block.image){ // if the true block contain an image
                drawSprite(x *vars.tiles.width, y *vars.tiles.height, block.image); // we draw an image
            }else { // otherwise we draw a square with the block color
                ctx.fillStyle = block.color;
                ctx.fillRect(x * vars.tiles.width, y * vars.tiles.height, vars.tiles.width, vars.tiles.height);
                ctx.strokeStyle = vars.tiles.strokeColor;
                ctx.strokeRect(x * vars.tiles.width, y * vars.tiles.height, vars.tiles.width, vars.tiles.height);
            }
            // after that we put the player on the top of the map
            if(vars.game.player.x === x && vars.game.player.y === y){
                drawSprite(x*vars.tiles.width, y*vars.tiles.height, vars.game.player.image);
            }
        }
    }

    if(direction){ // this condition is true web a keyboard event happen
        let blocks = vars.tiles.wtype;
        let bloc = vars.tiles.typeByName;
        let tab = vars.game.tab;
        let player = vars.game.player;

        // tab[player.x][player.y]=0;
        let action = true;
        switch (direction) {
            case 37: //left
                if(!bloc[blocks[tab[player.x-1][player.y]]].solid)player.x--;
                break;
            case 38: //up
                if(!bloc[blocks[tab[player.x][player.y-1]]].solid)player.y--;
                break;
            case 39: //right
                if(!bloc[blocks[tab[player.x+1][player.y]]].solid)player.x++;
                break;
            case 40: //bottom
                if(!bloc[blocks[tab[player.x][player.y+1]]].solid)player.y++;
                break;
            default:
                action = false;
        }
        if (action) { // if the key pressed is a game key, we redefine the map and the player
            vars.game.tab = tab;
            vars.game.player = player;
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