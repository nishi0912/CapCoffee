
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







