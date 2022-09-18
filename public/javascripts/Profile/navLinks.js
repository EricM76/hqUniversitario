const personalDataLink = document.querySelector("#data-tab");
const membershipLink = document.querySelector("#membership-tab");
const referredLink = document.querySelector("#referred-tab");
const personalDataTab = document.querySelector("#datosPersonales-tab-pane");
const membershipTab = document.querySelector("#membresia-tab-pane");
const referredTab = document.querySelector("#referidos-tab-pane");

const setHash = (tab) => {
    window.location.hash = tab;
}

const deleteAllActiveClass = () => {
    let allActiveElements = document.querySelectorAll(".active");
    allActiveElements.forEach(element => element.classList.remove("active", "show"));
}

window.addEventListener("load", () =>{
    let hash = window.location.hash;
   
    switch (hash) {
        case "#data": 
            deleteAllActiveClass();
            personalDataLink.classList.add("active");
            personalDataTab.classList.add("active");
            personalDataTab.classList.add("show");
            break;
        case "#membership":
            deleteAllActiveClass();
            membershipLink.classList.add("active");
            membershipTab.classList.add("active");
            membershipTab.classList.add("show");
            break;
        case "#referred":
            deleteAllActiveClass();
            referredLink.classList.add("active");
            referredTab.classList.add("active");
            referredTab.classList.add("show");
            break;
        default:
            personalDataLink.classList.add("active");
            personalDataTab.classList.add("active");
            personalDataTab.classList.add("show");
            break;
    }
})

