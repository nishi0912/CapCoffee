let auth = document.querySelector(".other");
let main = document.querySelector(".others");
let high = document.querySelector(".thirdParty");
let tick = document.querySelector(".tick");
let button = document.querySelector(".btn");

let pass = document.getElementById("pass");
let password = document.querySelector(".password");


button.addEventListener("click" , function(){
    button.textContent = "Loading..";
});

auth.textContent = "OTHER";

// Password length validation.
function change(){
    if(pass.value.length >= 6 && pass.value.length <= 12){
        password.classList.remove("red");
        password.classList.add("green");
        tick.classList.remove("untick");
        tick.textContent = "✔";
        setTimeout(() => {
            password.classList.remove("green");
            tick.textContent = "";
        }, 2000);  
    }else{
        password.classList.remove("green");
        tick.textContent = "✖";
        password.classList.add("red");
        tick.classList.add("untick");
    }   
}

auth.addEventListener("click" , function(){
main.classList.toggle("others1");
high.classList.toggle("displayThirdParty");
});