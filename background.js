// background.js

let timerInterval;
let running = false;
let minutes = 25;
let seconds = 0;
let windowOpen;
let savePort;

chrome.runtime.onInstalled.addListener(() => {
  // Perform initialization tasks here if needed.
});

chrome.runtime.onStartup.addListener(() => {
  setNewDefaultTime(25);
});

// * Open listener to handle requests from popup
const chromeOnConnectListener = chrome.runtime.onConnect.addListener(function (
  port
) {
  savePort = port;
  port.onMessage.addListener(function (msg) {
    if (msg.status == "start") {
      setNewDefaultTime(msg.minutes);
      toggleTimer();
    } else if (msg.status == "refresh") {
      fetchAndSendUpdatedTime();
    } else if (msg.status == "reset") {
      resetTimer();
    }
  });
});
function setTimeLeft(min, sec) {
  chrome.storage.local.set({ timeLeft: { minutes: min, seconds: sec } });
}
function sendUpdatedTime(min = 25, sec = 0) {
  if (windowOpen) {
    var timeObj = {
      minutes: min.toString(),
      seconds: sec.toString(),
    };
    savePort.postMessage({ status: "time update", time: timeObj });
    updateBrowserBadge(min, sec);
  }
}

function updateBrowserBadge(min, sec) {
  if (min == 0) {
    chrome.action.setBadgeText({ text: "< 1" });
  } else {
    chrome.action.setBadgeText({
      text: `${min}`,
    });
  }
}

function ifFinished(min, sec) {
  if (min <= 0 && sec <= 0) {
    clearInterval(interval);
    clearBrowserBadge();
    alert("Timer finished. Time for a break!");
  }
}

function setNewDefaultTime(min) {
  chrome.storage.local.set({ savedTime: { minutes: min, seconds: 0 } });
  chrome.storage.local.set({ timeLeft: { minutes: min, seconds: 0 } });
  sendUpdatedTime();
}

function updateButtonStatus(paused) {
  if (windowOpen) {
    savePort.postMessage({ status: "button status", paused: paused });
  }
}

//* Decrement time left by 1 second
function decrementTimeLeft() {
  chrome.storage.local.get("timeLeft", (data) => {
    var timeLeftObj = data.timeLeft;
    var newSeconds = timeLeftObj.seconds - 1;

    var minutes = timeLeftObj.minutes;
    if (newSeconds < 0 && minutes == 0) {
      setTimeLeft(0, 0);
    } else if (newSeconds < 0) {
      setTimeLeft(minutes - 1, 59);
    } else {
      setTimeLeft(minutes, newSeconds);
    }
  });
}

function toggleTimer() {
  updateButtonStatus(running);
  if (running) {
    running = false;
    clearInterval(interval);
  } else {
    running = true;
    interval = setInterval(() => {
      chrome.storage.local.get("timeLeft", (data) => {
        sendUpdatedTime(data.timeLeft.minutes, data.timeLeft.seconds);
        decrementTimeLeft();
        ifFinished(data.timeLeft.minutes, data.timeLeft.seconds);
      });
    }, 1000);
  }
}

chrome.runtime.onConnect.addListener(function (externalPort) {
  externalPort.onDisconnect.addListener(function () {
    //* onDisconnect
    windowOpen = false;
  });
  //* onConnect
  windowOpen = true;
  updateButtonStatus(!running);
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'startTimer') {
//     startTimer();
//   } else if (message.action === 'resetTimer') {
//     resetTimer();
//   }
// });

// function startTimer() {
//   if (!timerRunning) {
//     timerInterval = setInterval(updateTimer, 1000);
//     timerRunning = true;
//   }
// }

// function resetTimer() {
//   clearInterval(timerInterval);
//   timerRunning = false;
//   minutes = 25;
//   seconds = 0;
//   chrome.runtime.sendMessage({ action: 'updateTimerDisplay', time: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}` });
// }

// function updateTimer() {
//   if (minutes === 0 && seconds === 0) {
//     // Timer finished, implement break or other logic here
//     resetTimer();
//     chrome.runtime.sendMessage({ action: 'timerCompleted' });
//     return;
//   }

//   if (seconds === 0) {
//     minutes--;
//     seconds = 59;
//   } else {
//     seconds--;
//   }

//   chrome.runtime.sendMessage({ action: 'updateTimerDisplay', time: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}` });
// }

// // Call resetTimer on extension startup
// resetTimer();
