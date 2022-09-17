const personalDataTab = document.querySelector("#data-tab")
const membershipTab = document.querySelector("#membership-tab")
const referredTab = document.querySelector("#referred-tab")

const setHash = (tab) => {
    window.location.hash = tab;
}

window.addEventListener("load", () =>{
    let hash = window.location.hash;
    console.log(hash)
    switch (hash) {
        case "#data": 
            personalDataTab.classList.add("active");
            break;
        case "#membership":
            membershipTab.classList.add("active");
            break;
        case "#referred":
            referredTab.classList.add("active");
            break;
        default:
            break;
    }
})

