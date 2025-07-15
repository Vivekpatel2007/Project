let number=null;
function verifylimits(event)
{

let low = document.getElementById("Lower");
let high = document.getElementById("Upper");

let lowVal = parseInt(low.value, 10);
let highVal = parseInt(high.value, 10);

    if (isNaN(highVal)) {
        alert("Upper limit must be an integer");
    }
    if (isNaN(lowVal)) {
        alert("Lower limit must be an integer");
    }
    if (lowVal >= highVal) {
        alert("Lower limit must be less than upper limit");
        return;
    }
number = Math.floor(Math.random() * (highVal- lowVal + 1)) + lowVal;
  console.log("Target Number (Debug):", number);
  document.getElementById("Limit").textContent = "Limits confirmed! Now guess the number.";
}
let count=0;
let correct=0;
function reset()
{
    number = null;
    count = 0;
    correct = 0;
    document.getElementById("guess-input").value = "";
    document.getElementById("result-text").textContent = "";
    document.getElementById("count").textContent = "";

    document.getElementById("Lower").value = "";
    document.getElementById("Upper").value = "";
    document.getElementById("Lower").focus();
    console.log("Game reset. Target number cleared.");
}
function play()
{
    if(correct > 0) {
        alert("You have already guessed the number correctly. Please reset to play again.");
        return;
    }
if (number === null) {
    alert("Please set the limits first.");
   
    return;
}
let guess=document.getElementById("guess-input");
let g_number=guess.value;
if(isNaN(g_number) || g_number.trim() === "")
{
    alert("Please enter a valid number");
    return;
}
document.getElementById("Limit").textContent="";
count++;
document.getElementById("count").textContent = "Trials to guess correct: " +count;
if(g_number<number)
{
     document.getElementById("result-text").textContent = "Number is Smaller";
}
else if(g_number>number)
{
    document.getElementById("result-text").textContent = "Number is bigger";
}
else{
     document.getElementById("result-text").textContent = "Congratulations. You Guess it Correctly";
     correct++;
}
}


