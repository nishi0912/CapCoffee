const more = document.querySelector(".more");
const container = document.querySelector(".more-container");
const hover = document.querySelector(".hover");
let count = 0;

const btn1 = document.querySelector(".btn1");

[more  , btn1 ].forEach(item =>{
item.addEventListener("click" , function(){
    if(item === btn1){
        item.classList.add("pressbtn");
        setTimeout(() => {
            item.classList.remove("pressbtn");
        }, 200);
    }else{
        count++;
        console.log(count);
        more.classList.toggle("close");
        
        if(more.textContent && count % 2!=0){
            hover.classList.add("hoverme");
        }

        container.classList.add("upper-container-mobile");
        more.addEventListener("mouseover" , function(){
            container.classList.toggle("upper-container");
            hover.classList.remove("hoverme");
        });
    }
    container.classList.remove("upper-container");
});
});
