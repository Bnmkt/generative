const game = document.querySelector("canvas");
game.height = window.innerHeight;
game.width  = window.innerWidth;
const update = (ctx, obj)=>{
    ctx.clearRect(0,0, game.width, game.height);
    let vars = obj||{

    };
    window.requestAnimationFrame(()=>{update(ctx, vars)});
};
const init = (ctx)=>{
    update(ctx);
};

if(game.getContext) {
    const ctx = game.getContext("2d");
    init(ctx)
}else{
    document.write("Bande de laids");
}