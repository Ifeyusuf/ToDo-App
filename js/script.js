const forms= document.getElementById("form");
const inputs= document.getElementById("input");
const submitBtn= document.getElementById("submit");
const containers= document.querySelector(".containers");
const articles= document.querySelector(".article");
const alert= document.querySelector(".alert");
const clearbtn= document.querySelector(".clear");
const modalYes= document.querySelector(".modal__yes");
const cancelModal= document.querySelector(".cancel");
const modalWrapper= document.querySelector(".wrapper");


editElement=""
editFlag= false;
editId=" "

document.addEventListener("DOMContentLoaded", ()=>{
    let localList=getFromLocalStorage();

    if(localList.length > 0){
        localList.forEach( (x)=>{
            createTask(x.id, x.values)
        });
        articles.classList.add("show-article")
    }
});

forms.addEventListener("submit", (e)=>{
    e.preventDefault();

    const values= inputs.value;
    console.log(values);


if(values && !editFlag){
    const id = new Date().getTime().toString();
    
    createTask(id, values)

    displayAlert("Value added", "success");

    addToLocalStorage(id, values);

    backToDefault();

        articles.classList.add("show-article")
}

else if(values && editFlag){
    console.log("editing ");

    editElement.innerHTML=values;

    editFromLocalStorage(editId, values);

    backToDefault();
}

else{
    displayAlert("value empty", "danger")

    backToDefault()
    console.log("nothin");
}

});


// ========== create Task ==========
function createTask(id, values) {
    
    let element= document.createElement
    ("article");
    element.classList.add("list__container");
    
    let attr= document.createAttribute("data-id");
    attr.value=id
    element.setAttributeNode(attr)
    
    element.innerHTML=
                `
                    <li class="font-16">${values}</li>
            <div class="buttons">
                <button class="edit">
                <i class="fas fa-edit"></i>
                </button>

                <button class="del">
                <i class="fas fa-trash"></i>
                </button>
            </div>
            `
        containers.appendChild(element);

        document.querySelectorAll(".edit").forEach(list => {
            list.addEventListener( "click", editHandler)
        });

        element.querySelector(".del").addEventListener( "click", deleteHandler)
}

// ========== edit value ==========
const editHandler= (e)=>{
    const element= e.currentTarget.parentElement.parentElement;

    editElement=e.currentTarget.parentElement.previousElementSibling;

    inputs.value= editElement.innerHTML
    editFlag=true;
    editId=element.dataset.id;
    submitBtn.textContent="edit"

}


// ==========  delete each value =========
const deleteHandler= (e) =>{
    const element= e.currentTarget.parentElement.parentElement;


    // console.log(containers);
    containers.removeChild(element);

    if(containers.children.length === 0){

            articles.classList.remove("show-article");

            backToDefault();

            displayAlert("value empty", "danger");
    }

    let id=element.dataset.id
    console.log(id);

    removeFromLocalStorage(id)

};


//  ============  clear values  ========
clearbtn.addEventListener( "click", ()=>{

    modalWrapper.classList.add("show__wrapper")

});


//  ============  clear modal  ========
modalYes.addEventListener( "click", ()=>{
    const lists= document.querySelectorAll(".list__container");
    
    if(lists.length > 0){
        lists.forEach(  (item)=>{
            containers.removeChild(item)
        })
    }

    articles.classList.remove("show-article");

    articles.classList.remove("show-article");

    modalWrapper.classList.remove("show__wrapper");

    displayAlert("value empty", "danger");

    localStorage.removeItem("lists")

    backToDefault()

});

//  ========== cancel modal ===========
cancelModal.addEventListener("click", (e)=>{
        modalWrapper.classList.remove("show__wrapper");
})

//  ========== close modal ===========
modalWrapper.addEventListener("click", (e)=>{
    if(e.target !== containers){
        modalWrapper.classList.remove("show__wrapper");
    }
})


//  ========== display alert ===========
function displayAlert(text, action) {
    alert.textContent= text;
    alert.classList.add(`alert-${action}`)

    // ======= remove alert =======
    setTimeout( ()=>{
        alert.textContent= " ";
        alert.classList.remove(`alert-${action}`)
    }, 2000)
};


// ========  back To default ==========
const backToDefault= ()=>{
    inputs.value=""
    editFlag= false;
    editId=""
    submitBtn.innerHTML= "submit"
};


// ========  add To LocalStorage ===========
const addToLocalStorage = (id, values) =>{
let items= {id, values};

let basket= getFromLocalStorage();

basket.push(items)

localStorage.setItem("lists", JSON.stringify(basket));
};


// ==========  remove From LocalStorage =======
const removeFromLocalStorage = (id) =>{
    let basket= getFromLocalStorage();

    basket = basket.filter( (x)=> {
        if(x.id !== id){
            return basket
        }
    
    })
    localStorage.setItem("lists", JSON.stringify(basket));
};


// ==========  get From LocalStorage =======
function getFromLocalStorage() {
    return (
        localStorage.getItem("lists") 
        ? JSON.parse( localStorage.getItem("lists")) 
        : []
    )
}


// ========  edit From LocalStorage ========
const editFromLocalStorage = (id, values)=>{
    let basket= getFromLocalStorage();

    basket = basket.map( (x)=>{
        if(x.id === id){
            x.values= values
        }
        return basket
    })
    localStorage.setItem("lists", JSON.stringify(basket));
}