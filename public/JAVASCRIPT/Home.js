
let refresh = document.querySelector(".new");
let Round =document.querySelector(".rounds");
let Circle = document.querySelectorAll(".c");
let Mug = document.querySelector(".mug_hidden");


refresh.classList.add("refresher"); 
Round.classList.add("round");
Mug.classList.add("mug_displayed");
for(let i=0 ; i<Circle.length ; i++){
    Circle[i].classList.add("circle");
}

setTimeout(() => {
    refresh.classList.remove("refresher");  
    Round.classList.remove("round");
    Mug.classList.remove("mug_displayed");
    for(let i=0 ; i<Circle.length ; i++){
        Circle[i].classList.remove("circle");
    }
}, 12000);

const audio = new Audio()
