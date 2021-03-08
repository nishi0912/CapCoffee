let auth = document.querySelector(".other");
let main = document.querySelector(".others");
let high = document.querySelector(".thirdParty");
let tick = document.querySelector(".tick");

let pass = document.getElementById("pass");
let password = document.querySelector(".password");



auth.textContent = "OTHER";

// Password length validation.
function change(){
    if(pass.value.length >= 6 && pass.value.length <= 12){
        password.classList.remove("red");
        password.classList.add("green");
        tick.classList.remove("untick");
        tick.textContent = "✔";  
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