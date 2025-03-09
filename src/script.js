const btnPlay = document.querySelector('#btn-play');
const btnPause = document.querySelector('#btn-pause');
const btnReset = document.querySelector('#btn-reset');
const btnSetting = document.querySelector('#btn-setting');
const btnSettingLg = document.querySelector('#btn-setting-lg');
const btnConfirm = document.querySelector('#btn-confirm');
const btnBell = document.querySelector('#btn-bell');
const btnChart = document.querySelector('#btn-chart');
const btnUser = document.querySelector('#btn-user');
const btnBellLg = document.querySelector('#btn-bell-lg');
const btnUserLg = document.querySelector('#btn-user-lg');
const settingMenu = document.querySelector('#setting-menu');
const alert = document.querySelector('#alert');
const closeAlertBtn = alert.querySelector('svg');
const alertComingSoon = document.querySelector('#alert-comming-soon');
const closeAlertComingSoonBtn = alertComingSoon.querySelector('svg');
const overlay = document.querySelector('#overlay');
const customInputPomodoro = document.querySelector('#custom-input-pomodoro');
const customInputShort = document.querySelector('#custom-input-short');
const customInputLong = document.querySelector('#custom-input-long');
const pomodoroSection = document.querySelector('#pomodoro');
const shortBreakSection = document.querySelector('#short-break');
const longBreakSection = document.querySelector('#long-break');
const timerValue = document.querySelector('#timer-value');
const progressCircle = document.querySelector("#progress-circle");
const timerSound = new Audio("src/audio/alarm.mp3");

let timerLeft = 1500;
let timerInterval;
let timerDefault = 1500;

let pomodoroTime = 1500;
let shortBreakTime = 300;
let longBreakTime = 600;

let alertTimeout;

function saveTimerState() {
    localStorage.setItem("timerStart", Date.now()); 
    localStorage.setItem("timerDefault", timerDefault);
    localStorage.setItem("timerLeft", timerLeft);
    localStorage.setItem("timerRunning", "true");
}

function loadTimerState() {
    const timerStart = localStorage.getItem("timerStart");
    const savedDefault = localStorage.getItem("timerDefault");
    const savedLeft = localStorage.getItem("timerLeft");
    const isRunning = localStorage.getItem("timerRunning");

    if (timerStart && savedDefault && savedLeft && isRunning === "true") {
        const elapsedTime = Math.floor((Date.now() - parseInt(timerStart)) / 1000);
        timerDefault = parseInt(savedDefault);
        let remainingTime = parseInt(savedLeft) - elapsedTime;

        timerLeft = Math.max(remainingTime, 0);
        updateTimer();
        updateProgress();

        if (timerLeft > 0) {
            timerStartFunction();
        }
    }
}

function customTime() {

    let customPomodoro = parseInt(customInputPomodoro.value);
    let customShort = parseInt(customInputShort.value);
    let customLong = parseInt(customInputLong.value);

    if (isNaN(customPomodoro) || isNaN(customShort) || isNaN(customLong)) {
        showAlert();
        highlightInvalidInputs()
        return;
    }

    if(customPomodoro < 1 || customPomodoro > 60 || customShort < 1 || customShort > 60 || customLong < 1 || customLong > 60){
        showAlert();
        highlightInvalidInputs()
        return;
    }

    pomodoroTime = customPomodoro * 60;
    shortBreakTime = customShort * 60;
    longBreakTime = customLong * 60;

    timerPause();
    
    if (pomodoroSection.classList.contains('section-active')) {
        timerDefault = pomodoroTime;
    } else if (shortBreakSection.classList.contains('section-active')) {
        timerDefault = shortBreakTime;
    } else if (longBreakSection.classList.contains('section-active')) {
        timerDefault = longBreakTime;
    }

    timerLeft = timerDefault;
    updateTimer();
    updateProgress();

    resetInputBorders();

    return true;
}

function highlightInvalidInputs() {
    const inputs = [customInputPomodoro, customInputShort, customInputLong];

    inputs.forEach(input => {
        if (!input.value || isNaN(parseInt(input.value)) || input.value < 1 || input.value > 60) {
            input.classList.add("border-2", "border-red-500");
        } else {
            input.classList.remove("border-2", "border-red-500");
        }
    });
}

function resetInputBorders() {
    document.querySelectorAll("input[type='number']").forEach(input => {
        input.classList.remove("border-2", "border-red-500");
    });
}

function showAlert(){
    alert.classList.add('warning-active');
    alert.classList.remove('warning');

    alertTimeout = setTimeout(() => {
        hideAlert();
    }, 6000);
}

function hideAlert(){
    alert.classList.add('warning');

    alertTimeout = setTimeout(() => {
        alert.classList.remove('warning-active');
    }, 500);
    
}

closeAlertBtn.addEventListener('click', hideAlert);

function showAlertComingSoon(){
    alertComingSoon.classList.add('warning-active');
    alertComingSoon.classList.remove('warning');

    alertTimeout = setTimeout(() => {
        hideAlertComingSoon();
    }, 6000);
}

function hideAlertComingSoon(){
    alertComingSoon.classList.add('warning');

    alertTimeout = setTimeout(() => {
        alertComingSoon.classList.remove('warning-active');
    }, 500);
    
}

closeAlertComingSoonBtn.addEventListener('click', hideAlertComingSoon);

function updateProgress() {
    let progress = (timerLeft / timerDefault) * 360;
    progressCircle.style.background = `conic-gradient(#6366f1 ${progress}deg, #e5e7eb ${progress}deg)`;
}

function updateTimer() {
    let minutes = Math.floor(timerLeft/60);
    let seconds = (timerLeft%60);
    timerValue.textContent = `${minutes.toString().padStart(2,0)}:${seconds.toString().padStart(2,0)}`
}

function pomodoro(){
    timerPause();
    timerDefault = pomodoroTime;
    timerLeft = timerDefault;
    updateTimer();
    updateProgress();
}

function timerStart() {
    saveTimerState();

    timerInterval = setInterval(() => {
        timerLeft--;
        updateTimer();
        updateProgress();
        if(timerLeft === 0){
            timerSound.play();
            clearInterval(timerInterval);
            btnPause.addEventListener('click', timerReset);
            localStorage.setItem("timerRunning", "false");
        }
    }, 1000);
}

function timerPause() {
    clearInterval(timerInterval);
}

function shortBreak() {
    timerPause();
    timerSound.pause();
    timerDefault = shortBreakTime;
    timerLeft = timerDefault;
    updateTimer();
    updateProgress();
    if(timerLeft === 0){
        timerSound.play();
        btnPause.addEventListener('click', timerReset);
    }
}

function longBreak() {
    timerPause();
    timerSound.pause();
    timerDefault = longBreakTime;
    timerLeft = timerDefault;
    updateTimer();
    updateProgress();
    if(timerLeft === 0){
        timerSound.play();
        btnPause.addEventListener('click', timerReset);
    }
}

function timerReset(){
    timerPause();
    timerLeft = timerDefault;
    updateTimer();
    updateProgress();

    localStorage.removeItem("timerStart");
    localStorage.removeItem("timerDefault");
    localStorage.removeItem("timerLeft");
    localStorage.removeItem("timerRunning");

    timerSound.pause();
    timerSound.currentTime = 0;
}

updateTimer();



btnPlay.addEventListener('click', timerStart);
btnPause.addEventListener('click', timerPause);
btnReset.addEventListener('click', timerReset);


pomodoroSection.addEventListener('click', pomodoro);
shortBreakSection.addEventListener('click', shortBreak);
longBreakSection.addEventListener('click', longBreak);


btnPlay.addEventListener('click', function(){
    btnPlay.classList.add('play-btn');
    btnPause.classList.remove('pause-btn');
})

btnPause.addEventListener('click', function(){
    btnPause.classList.add('pause-btn');
    btnPlay.classList.remove('play-btn');
})

btnReset.addEventListener('click', function(){
    btnPause.classList.add('pause-btn');
    btnPlay.classList.remove('play-btn');
})

btnSetting.addEventListener('click', function(){
    settingMenu.classList.add('setting-active');
    settingMenu.classList.remove('setting');
    overlay.classList.add('overlay-active');
    btnPause.classList.add('pause-btn');
    btnPlay.classList.remove('play-btn');
});

btnSettingLg.addEventListener('click', function(){
    settingMenu.classList.add('setting-active');
    settingMenu.classList.remove('setting');
    btnPause.classList.add('pause-btn');
    btnPlay.classList.remove('play-btn');
    overlay.classList.add('overlay-active');
});

btnConfirm.addEventListener('click', function(){
    if(customTime()){
        settingMenu.classList.remove('setting-active');
        settingMenu.classList.add('setting');
        btnPause.classList.add('pause-btn');
        btnPlay.classList.remove('play-btn');
        overlay.classList.remove('overlay-active');
    }
});

btnConfirm.addEventListener('click',customTime);

btnBell.addEventListener('click',function(){
    showAlertComingSoon();
})

btnChart.addEventListener('click',function(){
    showAlertComingSoon();
})

btnUser.addEventListener('click',function(){
    showAlertComingSoon();
})

btnBellLg.addEventListener('click',function(){
    showAlertComingSoon();
})

btnUserLg.addEventListener('click',function(){
    showAlertComingSoon();
})

shortBreakSection.addEventListener('click', function(){
    shortBreakSection.classList.add('section-active');
    shortBreakSection.classList.remove('section');
    pomodoroSection.classList.remove('section-active');
    pomodoroSection.classList.add('section');
    longBreakSection.classList.remove('section-active');
    btnPause.classList.add('pause-btn');
    btnPlay.classList.remove('play-btn');
})

pomodoroSection.addEventListener('click', function(){
    pomodoroSection.classList.add('section-active');
    pomodoroSection.classList.remove('section');
    shortBreakSection.classList.remove('section-active');
    shortBreakSection.classList.add('section');
    longBreakSection.classList.remove('section-active');
    longBreakSection.classList.add('section');
    btnPause.classList.add('pause-btn');
    btnPlay.classList.remove('play-btn');
})

longBreakSection.addEventListener('click', function(){
    longBreakSection.classList.add('section-active');
    longBreakSection.classList.remove('section');
    pomodoroSection.classList.remove('section-active');
    pomodoroSection.classList.add('section');
    shortBreakSection.classList.remove('section-active');
    shortBreakSection.classList.add('section');
    btnPause.classList.add('pause-btn');
    btnPlay.classList.remove('play-btn');
})


window.addEventListener("load", loadTimerState);

