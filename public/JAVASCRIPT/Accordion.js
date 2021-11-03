const Items = document.querySelectorAll(".accordion-items");
const Item = document.querySelectorAll(".accordion-item");
const arrowButton = document.querySelectorAll(".accordion-btn");
const icons = document.querySelectorAll(".icons1");
const contents = document.querySelectorAll(".accordion-hidecontents");

const ItemsLength = Items.length;

for (let i = 0; i < arrowButton.length; i++) {
  arrowButton[i].addEventListener("click", function () {
    arrowButton[i].classList.toggle("btn1");
    Items[i].classList.toggle("accordion-moreItem");
    Item[i].classList.toggle("changeColor");
    icons[i].classList.toggle("displayIcon");
    contents[i].classList.toggle("showcontents");
  });
}
