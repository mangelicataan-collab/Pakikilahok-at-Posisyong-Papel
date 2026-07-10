var elem = document.getElementById("bird");
var score = 0;
var gameOver = false;

// ---------- pipe randomization ----------

function randomizePipes(){
    var pipe1_hg = Math.floor(Math.random()*10)+30;
    var hole1_hg = Math.floor(Math.random()*20)+20;
    document.getElementById("pipe1").style.height = pipe1_hg+"%";
    document.getElementById("pipe2").style.top = (pipe1_hg+hole1_hg)+"%";
    document.getElementById("pipe2").style.height = (100-(pipe1_hg+hole1_hg))+"%";
}

// run once immediately so pipes aren't blank for the first 4 seconds
randomizePipes();
var pipeInterval = setInterval(randomizePipes, 4000);

// ---------- gravity ----------

var gravityInterval = setInterval(() => {
    if(gameOver) return;
    var x = parseInt(window.getComputedStyle(elem).getPropertyValue("top"));
    if(x <= 510){
        elem.style.top = (x+3)+"px";
    } else {
        loseGame();
    }
}, 30);

// ---------- fly / jump ----------

function jump(){
    if(gameOver) return;
    var fly = parseInt(window.getComputedStyle(elem).getPropertyValue("top"));
    if(fly >= 40){
        elem.style.top = (fly-40)+"px";
    } else {
        elem.style.top = "0px";
    }
}

document.addEventListener('keyup', event => {
    if(event.code === 'Space'){
        jump();
    }
});

// ---------- score ----------

var scoreInterval = setInterval(() => {
    if(gameOver) return;
    score++;
    document.getElementById("scr").innerHTML = score;
}, 500);

// ---------- collision ----------

function checkcollision(elm1, elm2){
    var elm1Rect = elm1.getBoundingClientRect();
    var elm2Rect = elm2.getBoundingClientRect();

    return (elm1Rect.right >= elm2Rect.left && elm1Rect.left <= elm2Rect.right) &&
           (elm1Rect.bottom >= elm2Rect.top && elm1Rect.top <= elm2Rect.bottom);
}

var collisionInterval = setInterval(() => {
    if(gameOver) return;
    var bird = document.getElementById("bird");
    if(checkcollision(bird, document.getElementById("pipe1")) ||
       checkcollision(bird, document.getElementById("pipe2"))){
        loseGame();
    }
}, 100);

// ---------- game over (single source of truth, so we never double-alert) ----------

function loseGame(){
    if(gameOver) return;
    gameOver = true;

    clearInterval(pipeInterval);
    clearInterval(gravityInterval);
    clearInterval(scoreInterval);
    clearInterval(collisionInterval);

    setTimeout(() => {
        alert("You Lost !! Your Score Is: "+score);
        window.location.reload();
    }, 10);
}