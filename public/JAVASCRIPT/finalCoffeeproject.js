// Refresh page
let button = document.querySelectorAll(".btn");

const loader = document.querySelector(".loader");
const blurs = document.querySelector(".container-fluid");
const loaderPage = document.querySelector(".loader-page");

for(let i=0 ; i< button.length ; i++){
    button[i].addEventListener("click" , function(){ 
        loader.classList.add("loading");
        blurs.classList.add("blur");
        loaderPage.classList.toggle("flex1");
    });
}

// Scroll
window.addEventListener("scroll" , function(){
if(window.scrollY > 800){
    let specialText = document.querySelector(".specialtexts");
    specialText.classList.add("specialtext");
    specialText.textContent = "Today's Special Flavors";
}
});

// Hamburger function
document.querySelector(".hamburger").addEventListener("click",function(){
    document.querySelector(".l1").classList.toggle("line1");
    document.querySelector(".l2").classList.toggle("line2");
    document.querySelector(".l3").classList.toggle("line3");
    document.querySelector(".hamlists").classList.toggle("menu");
});

// Get time.
let time = 0;
setInterval(() => {
    getTime();
}, 1000);

function getTime(){
    time = new Date().toLocaleTimeString();
    document.querySelector(".nodescription").textContent = time;
}

// company listing.
const Domain = document.querySelector(".domains");
const chevronClick = document.querySelector(".swipe");
chevronClick.addEventListener("click" , ()=>{
    Domain.classList.toggle("companyDomains");
});

// Service section

let service = document.querySelectorAll(".service-icon");
let subService = document.querySelectorAll(".sub-services");
console.log(service.length);
for(let i=0 ; i<service.length ; i++){
    service[i].addEventListener("click" , ()=>{
        let serviceName = document.querySelector(".serviceName"+[i]);
        serviceName.classList.toggle("vouchers");
        if(i>=1){
            document.querySelector(".serviceName"+[i-1]).classList.remove("vouchers");
        }
        if(i==1){
            document.querySelector(".serviceName"+[i-1]).classList.remove("vouchers");
            document.querySelector(".serviceName"+[i+1]).classList.remove("vouchers");
        }
        if(i==0){
            document.querySelector(".serviceName"+[i+1]).classList.remove("vouchers");
            document.querySelector(".serviceName"+[i+2]).classList.remove("vouchers");
        }
        if(i==2){
            document.querySelector(".serviceName"+[i-1]).classList.remove("vouchers");
            document.querySelector(".serviceName"+[i-2]).classList.remove("vouchers");
        }

        });
}

// Items
const yourItem = document.querySelectorAll(".dropmenu");
const moreItems = document.querySelectorAll(".moreItem");
console.log(yourItem.length , moreItems.length);
const arrow = document.querySelector(".arrow-down");
const ordered = document.querySelector(".order");
arrow.textContent = "⬇";
arrow.addEventListener("click" , function(){
for(let i = 0;i<moreItems.length ; i++){
    moreItems[i].classList.toggle("moreItems");
    yourItem[i].classList.toggle("dropmenu2");
    arrow.textContent = "⬆";
    console.log(ordered.value);
}
});

// message
const message = document.querySelector(".message");
const text = document.querySelector(".texts");
message.addEventListener("click" , function(){
text.classList.toggle("text");
});

// like
const likes = document.querySelectorAll(".like");
for(let i=0 ; i<likes.length ; i++){
    likes[i].addEventListener("click" , () =>{
    likes[i].classList.toggle("likes");
});
        
}









