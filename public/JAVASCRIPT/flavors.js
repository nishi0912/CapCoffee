const more = document.querySelector(".more");
const container = document.querySelector(".more-container");
const hover = document.querySelector(".hover");
const input = document.querySelector(".userInput");
const order = document.querySelector(".order_result");
const Ingredients = document.querySelector(".ingredient");
// input.value="";

const btn1 = document.querySelector(".btn1");
let count = 1;

[more  , btn1 ].forEach(item =>{
item.addEventListener("click" , function(){
    if(item === btn1){
        console.log("I am the problem");
        if(input.value.length === 0){
            order.classList.add("orders");
            order.textContent = "Please enter the quantity."
            input.classList.add("order_notplaced_border");
        }else if(input.value.length >= 2){
            order.classList.add("orders");
            order.textContent ="Maximum of 10 orders are available for this item."
            input.classList.add("order_moreplaced_border");
        }
        else{
            order.textContent ="✔ Success"
            input.classList.add("order_placed_border");
            order.classList.add("orders");
        }
        item.classList.add("pressbtn");
        setTimeout(() => {
            item.classList.remove("pressbtn");
        }, 2000);
        setTimeout(() => {
            order.textContent="";
            order.classList.remove("orders");
        }, 5000);
    }else{ 
        console.log("I am not the problem");
        count++;
            if(count % 2 === 0){
                console.log("Add-"+count)
                more.classList.add("close");
                Ingredients.classList.add("ingredients");
            }else{
                console.log("Remove - "+count)
                more.classList.remove("close");
                Ingredients.classList.remove("ingredients");
            }
    }
    
});
});

// ----------------------- Questions section ------------------
const edit_question = document.querySelectorAll(".edit_icon");
const show_input = document.querySelectorAll(".question_hidden");
const show_post = document.querySelectorAll(".post_hidden");
for(let i=0;i<edit_question.length;i++){
    edit_question[i].addEventListener("click" , ()=>{
        show_input[i].classList.toggle("question_input");
        show_post[i].classList.toggle("post_show");
    });
    
}
const mobileButton= document.querySelector(".mobile_hidden");
const mobileQuestion = document.querySelector(".desktop_question_container");
mobileButton.addEventListener("click" , ()=>{
    mobileQuestion.classList.toggle("mobile_question_container");
});
