
let refresh = document.querySelector(".new");
let Round =document.querySelector(".rounds");
let Circle = document.querySelectorAll(".c");


refresh.classList.add("refresher"); 
Round.classList.add("round");
for(let i=0 ; i<Circle.length ; i++){
    Circle[i].classList.add("circle");
}

setTimeout(() => {
    refresh.classList.remove("refresher");  
    Round.classList.remove("round");
    for(let i=0 ; i<Circle.length ; i++){
        Circle[i].classList.remove("circle");
    }
}, 10000);
round