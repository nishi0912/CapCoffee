
const remove = document.querySelectorAll(".removeItem");
const item  = document.querySelector(".message");


for(let i = 0;i<remove.length ; i++){
    remove[i].addEventListener("click" , function(){
        item.classList.add("Deleted");
        item.textContent = "Deleting...";
        remove[i].classList.add("movebutton");
        setTimeout(() => {
            remove[i].classList.remove("movebutton");
        }, 100);
        });
}


