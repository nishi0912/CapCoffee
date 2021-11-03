
const remove = document.querySelectorAll(".removeItem");

for(let i = 0;i<remove.length ; i++){
    remove[i].addEventListener("click" , function(){
        remove[i].textContent = "Deleting...";
        remove[i].classList.add("movebutton");
        setTimeout(() => {
            remove[i].classList.remove("movebutton");
        }, 100);
        });
}

const likes = document.querySelectorAll(".like");
for(let i = 0;i<likes.length;i++){
    likes[i].addEventListener("click",() =>{
        likes[i].classList.toggle("likes");
    })
}



