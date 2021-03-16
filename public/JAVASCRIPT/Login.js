const buttonClick = document.querySelector(".btn");
const loader = document.querySelector(".loader");
const blurs = document.querySelector(".homepage");
const loaderPage = document.querySelector(".loader-page");

buttonClick.addEventListener("click" , function(){ 
    loader.classList.add("loading");
    blurs.classList.add("blur");
    loaderPage.classList.toggle("flex1");
});