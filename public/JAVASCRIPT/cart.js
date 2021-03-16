
const remove = document.querySelectorAll(".removeItem");
const item  = document.querySelector(".message");


for(let i = 0;i<remove.length ; i++){
    remove[i].addEventListener("click" , function(){
        
        remove[i].textContent = "Deleting...";
        remove[i].classList.add("movebutton");
        setTimeout(() => {
            remove[i].classList.remove("movebutton");
        }, 100);
        });
}


