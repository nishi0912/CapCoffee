let auth = document.querySelector(".other");
let main = document.querySelector(".others");
let high = document.querySelector(".thirdParty");
auth.textContent = "OTHER";
auth.addEventListener("click" , function(){
main.classList.toggle("others1");
high.classList.toggle("displayThirdParty");
});