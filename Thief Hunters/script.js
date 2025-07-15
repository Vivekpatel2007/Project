let play = document.querySelector(".btn-secondary");
play.addEventListener("click", () => {
    let get = document.querySelector(".instructions");
    const originalColor = get.style.border; // Store original color
    
    // Change to lightblue
    get.style.border = "5px solid lightgreen";
    
    // Revert after 2 seconds (2000 milliseconds)
    setTimeout(() => {
        get.style.border = originalColor || ""; // Revert to original or default
    }, 3000);
});