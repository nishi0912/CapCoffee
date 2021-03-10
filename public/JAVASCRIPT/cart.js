
const remove = document.querySelector(".removeItem");
const item  = document.querySelector(".message");

remove.addEventListener("click" , function(){
item.classList.add("Deleted");
item.textContent = "Deleting...";
remove.classList.add("movebutton");
setTimeout(() => {
    remove.classList.remove("movebutton");
}, 100);
});

