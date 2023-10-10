// Pomodoro Timer
let timerInterval;
let timerRunning = false;
let minutes = 0;
let seconds = 3;

document.getElementById("startBtn").addEventListener("click", startTimer);
document.getElementById("resetBtn").addEventListener("click", resetTimer);

function startTimer() {
  if (!timerRunning) {
    timerInterval = setInterval(updateTimer, 1000);
    timerRunning = true;
    document.getElementById("startBtn").innerText = "Pause";
  } else {
    clearInterval(timerInterval);
    timerRunning = false;
    document.getElementById("startBtn").innerText = "Start";
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  minutes = 25;
  seconds = 0;
  updateTimerDisplay();
  document.getElementById("startBtn").innerText = "Start";
}

function updateTimer() {
  if (minutes === 0 && seconds === 0) {
    // Timer finished, implement break or other logic here
    resetTimer();
    showNotification();
    playNotificationSound();
    showPopup();
    return;
  }

  if (seconds === 0) {
    minutes--;
    seconds = 59;
  } else {
    seconds--;
  }

  updateTimerDisplay();
}

function updateTimerDisplay() {
  const timerDisplay = document.getElementById("timer");
  timerDisplay.innerText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
function showNotification() {
  const options = {
    body: "Take a 5-minute break",
    icon: "images\notif.png" // Replace with the path to your notification icon
  };

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Timer Completed", options);
  }
}

// Function to play a notification sound
function playNotificationSound() {
  const audio = new Audio("audio/iphone_14_notification.mp3"); // Replace with the path to your notification sound
  audio.play();
}

// Call the function to request notification permission on page load
document.addEventListener("DOMContentLoaded", () => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
});
function showPopup() {
  const options = {
    body: "Take a 5-minute break",
    icon: "images\notif.png" // Replace with the path to your notification icon
  };

  // Check if the browser supports notifications
  if ("Notification" in window) {
    // Request permission if not granted
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Timer Completed", options);
        }
      });
    } else {
      new Notification("Timer Completed", options);
    }
  }
}


// Function to close the popup
function closePopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "none";
}

// Event listener for the Close button
document.getElementById("closePopup").addEventListener("click", closePopup);


// To-Do List
const inputBox = document.getElementById("input-box");
const listcontainer = document.getElementById("list-container");

function addTask(){
    if(inputBox.value === ''){
        alert("You must write something!");
    }
    else{
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listcontainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    inputBox.value = "";
    saveData();
}

listcontainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveData();
    }
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
},  false);

function saveData(){
    localStorage.setItem("data", listcontainer.innerHTML);
}
function showTask(){
    listcontainer.innerHTML = localStorage.getItem("data");
}
showTask();


// Array of quotes
const quotes = [
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "The best way to predict the future is to create it. - Peter Drucker",
  "In the middle of every difficulty lies opportunity. - Albert Einstein",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "You miss 100% of the shots you don't take. - Wayne Gretzky",
  "The only thing standing between you and your goal is the story you keep telling yourself as to why you can't achieve it. - Jordan Belfort",
  "The only place where success comes before work is in the dictionary. - Vidal Sassoon",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  "I find that the harder I work, the more luck I seem to have. - Thomas Jefferson",
  "It's not whether you get knocked down, it's whether you get up. - Vince Lombardi",
  "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "The only way to do great work is to love what you do. - Steve Jobs"
  // Add more quotes here
];

// Function to select a random quote from the array
function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

// Function to set a random quote on page load
function setRandomQuote() {
  const quoteElement = document.getElementById('quote');
  const randomQuote = getRandomQuote();
  quoteElement.textContent = randomQuote;
}

// Event listener to call setRandomQuote on page load
window.addEventListener('load', setRandomQuote);




