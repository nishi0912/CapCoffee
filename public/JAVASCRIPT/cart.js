
const remove = document.querySelector(".removeItem");
const item  = document.querySelector(".message");

remove.addEventListener("click" , function(){
item.classList.add("Deleted");
item.textContent = "Deleting...";
});

