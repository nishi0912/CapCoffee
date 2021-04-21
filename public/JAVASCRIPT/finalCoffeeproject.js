// Refresh page
let button = document.querySelectorAll(".btn");
let profiles = document.querySelectorAll(".profile_info");

const loader = document.querySelector(".loader");
const blurs = document.querySelector(".container-fluid");
const loaderPage = document.querySelector(".loader-page");

for(let i=0 ; i< profiles.length ; i++){
    profiles[i].addEventListener("click" , function(){
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
let arrowRotate = 1;
arrow.addEventListener("click" , function(){
    arrowRotate++;
    for(let i = 0;i<moreItems.length ; i++){
        if(arrowRotate % 2 === 0){
        moreItems[i].classList.add("moreItems");
        yourItem[i].classList.add("dropmenu2");
        arrow.textContent = "⬆";
    }else{
        moreItems[i].classList.remove("moreItems");
        yourItem[i].classList.remove("dropmenu2");
        arrow.textContent = "⬇";
    }
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

// Profile

const hovered = document.querySelector(".profile");
const profile = document.querySelector(".profile_unhovered");
const profileHovered = document.querySelector(".profile_hovered");
hovered.addEventListener("click" , ()=>{   
        hovered.classList.toggle("profile_border");
        profile.classList.toggle("profile_hovered");
});


// Screen Modes
const Mode = document.querySelector(".Dark_mode");
const ModeColor = document.querySelectorAll(".text-color");
const MainMode = document.querySelector(".Main");

const CoffeeMode = document.querySelector(".coffee");
const IconMode = document.querySelector(".arrow-icon");

const ProfileMode = document.querySelector(".profile");
const ProfileTabMode = document.querySelector(".profile_unhovered");

const TransitionMode = document.querySelector(".transitions");
const ServiceMode = document.querySelector(".services");
const SubServiceMode = document.querySelectorAll(".serviceLists");
const SpecialMode = document.querySelector(".specialitems");
const HorizontalMode = document.querySelector(".Horizontal-menus");
const InfraMode = document.querySelector(".Interhead");
const DomainMode = document.querySelectorAll(".domain");


const DropMode = document.querySelectorAll(".dropmenu");
const DropMode2 = document.querySelectorAll(".dropmenu3");
const ImageMode = document.querySelectorAll(".image");

const RotationalMode = document.querySelector(".Rotational-animation");
const RotationalBoxMode = document.querySelectorAll(".Rotatational_Boxes");

let count = 1;
Mode.addEventListener("click" , ()=>{
    count++;
    Mode.classList.toggle("profile_LightMode");
    if(count % 2 === 0){
        Mode.textContent = "Light-Mode";
    }else{
        Mode.textContent = "Dark-Mode"; 
    }
    for(let i=0;i<ModeColor.length;i++){
        ModeColor[i].classList.toggle("new_text_color");
    }
    MainMode.classList.toggle("body-screen");
    CoffeeMode.classList.toggle("coffee_mode");
    IconMode.classList.toggle("icon_mode");
    ProfileMode.classList.toggle("profile_mode");
    ProfileTabMode.classList.toggle("profiletab_mode");
    for(let i =0;i<profiles.length;i++){
        profiles[i].classList.toggle("profiles_mode");
    }
    TransitionMode.classList.toggle("transition_mode");
    ServiceMode.classList.toggle("service_mode");
    for(let i =0;i<SubServiceMode.length;i++){
        SubServiceMode[i].classList.toggle("sub_mode");
    }
    SpecialMode.classList.toggle("special_mode");
    HorizontalMode.classList.toggle("horizontal_mode");
    InfraMode.classList.toggle("infra_mode");
    for(let i=0;i<DomainMode.length;i++){
        DomainMode[i].classList.toggle("domain_mode");
    }
    for(let i=0;i<DropMode.length;i++){
        DropMode[i].classList.toggle("drop_mode");
    }
    for(let i=0;i<DropMode2.length;i++){
        DropMode2[i].classList.toggle("drop_mode2");
    }
    for(let i=0;i<ImageMode.length;i++)
    {
        ImageMode[i].classList.toggle("image_mode");
    }
    RotationalMode.classList.toggle("rotational_mode");
    for(let i=0;i<RotationalBoxMode.length;i++){
        RotationalBoxMode[i].classList.toggle("rotationalbox_mode");
    }
});

// ------------------------------------------
const already_added = document.querySelector(".already_added");
already_added.textContent = "Item already added to cart";
setTimeout(() => {
    already_added.textContent="";
}, 10000);










