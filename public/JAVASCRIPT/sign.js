let auth = document.querySelector(".other");
let main = document.querySelector(".others");
let high = document.querySelector(".thirdParty");
let tick = document.querySelector(".tick");
let button = document.querySelector(".btn");
let info = document.querySelectorAll(".userdetails");

let pass = document.getElementById("pass");
let password = document.querySelector(".password");

for(let i=0;i<info.length; i++){
    info[i].addEventListener("click",()=>{
        info[i].classList.toggle("Label_up");
        if(i>0 && i<info.length){
            info[i-1].classList.remove("Label_up");
        }
        });
}

button.addEventListener("click" , function(event){
let count=0;
for(let i=0;i<info.length;i++){ 
    if(info[i].value.length!=0){
        count++;
        if(count === info.length-1){
            button.classList.add("zoomin");
            setTimeout(() => {
                button.classList.remove("zoomin");
                button.textContent = "Loading.";
            }, 200);
            setTimeout(() => {
                button.textContent = "Loading..";
            }, 1000);
            setTimeout(() => {
                button.textContent = "Loading...";
            }, 2000);
        }else{
            button.textContent = "SUBMIT";
        }
    }
}
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


// // validity
// let input = document.querySelector("#firstName");                                       
// input.oninvalid =(event)=>{
//     event.target.setCustomValidity("Username is required");
// }