document.addEventListener("DOMContentLoaded", () => {

const resources = {
    energy: 100,
    oxygen: 100,
    food: 100
};

const events = [
    "🌪 Песчаная буря повредила солнечные панели!",
    "🛰 Получен сигнал с Земли.",
    "👨‍🚀 Экипаж обнаружил новые ресурсы.",
    "⚠ Перегрев системы охлаждения!",
    "🔋 Найдены дополнительные батареи.",
    "☄ Рядом пролетел метеорит."
];

/* ===== UI ===== */

const log = document.getElementById("log");

const energyBar = document.getElementById("energyBar");
const oxygenBar = document.getElementById("oxygenBar");
const foodBar = document.getElementById("foodBar");

const energyText = document.getElementById("energyText");
const oxygenText = document.getElementById("oxygenText");
const foodText = document.getElementById("foodText");

const cards = {
    energy: document.getElementById("energyCard"),
    oxygen: document.getElementById("oxygenCard"),
    food: document.getElementById("foodCard")
};

/* ===== QUIZ ===== */

const overlay = document.getElementById("quizOverlay");
const quizText = document.getElementById("quizQuestion");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

/* ===== EVAC ===== */

const evacScreen = document.getElementById("evacScreen");

let quizStep = 0;
let answers = [];
let currentResource = null;
let evacActive = false;

/* ===== SOUND (опционально) ===== */
let alarmStarted = false;

/* ===== UPDATE ===== */

function updateUI(){

    energyBar.style.width = resources.energy + "%";
    oxygenBar.style.width = resources.oxygen + "%";
    foodBar.style.width = resources.food + "%";

    energyText.textContent = resources.energy + "%";
    oxygenText.textContent = resources.oxygen + "%";
    foodText.textContent = resources.food + "%";

    checkWarnings();
    checkCriticalWarnings();
}

/* ===== LOG ===== */

function addLog(text){
    const li = document.createElement("li");
    li.textContent = text;
    log.prepend(li);

    if(log.children.length > 8){
        log.removeChild(log.lastChild);
    }
}

/* ===== WARNINGS (30%) ===== */

function checkWarnings(){

    Object.values(cards).forEach(card => card.classList.remove("warning"));

    if(resources.energy < 30) cards.energy.classList.add("warning");
    if(resources.oxygen < 30) cards.oxygen.classList.add("warning");
    if(resources.food < 30) cards.food.classList.add("warning");
}

/* ===== CRITICAL (10%) ===== */

function checkCriticalWarnings(){

    const danger =
        resources.energy <= 10 ||
        resources.oxygen <= 10 ||
        resources.food <= 10;

    if(danger){

        document.body.classList.add("alert");

        if(!alarmStarted){
            addLog("🔴 КРИТИЧЕСКИЙ УРОВЕНЬ РЕСУРСОВ!");
            alarmStarted = true;
        }

    } else {
        document.body.classList.remove("alert");
    }
}

/* ===== EVAC ===== */

function checkEvac(){

    const danger =
        resources.energy <= 0 ||
        resources.oxygen <= 0 ||
        resources.food <= 0;

    if(danger && !evacActive){

        evacActive = true;

        document.body.classList.add("alert");

        if(evacScreen){
            evacScreen.classList.remove("hidden");
        }

        addLog("🚨 СРОЧНАЯ ЭВАКУАЦИЯ АКТИВИРОВАНА!");

    }
}

/* ===== QUIZ ===== */

function openQuiz(resource){

    currentResource = resource;
    quizStep = 0;
    answers = [];

    overlay.classList.remove("hidden");

    if(resource === "energy")
        quizText.textContent = "⚡ Реактор: стабилен ли он?";

    if(resource === "oxygen")
        quizText.textContent = "🫁 Кислород: система активна?";

    if(resource === "food")
        quizText.textContent = "🍕 Гидропоника: растения живы?";
}

function closeQuiz(){
    overlay.classList.add("hidden");
}

function handleAnswer(value){

    answers.push(value);
    quizStep++;

    if(quizStep === 1){

        if(currentResource === "energy")
            quizText.textContent = "⚡ Панели работают стабильно?";

        if(currentResource === "oxygen")
            quizText.textContent = "🫁 Давление в норме?";

        if(currentResource === "food")
            quizText.textContent = "🍕 Почва питательная?";

        return;
    }

    closeQuiz();

    if(answers[0] && answers[1]){

        resources[currentResource] =
            Math.min(100, resources[currentResource] + 20);

        addLog("✅ " + currentResource + " восстановлен!");

    } else {

        addLog("⚠ Ошибка проверки " + currentResource);

    }

    updateUI();
    checkEvac();
}

/* ===== EVENTS ===== */

yesBtn.addEventListener("click", () => handleAnswer(true));
noBtn.addEventListener("click", () => handleAnswer(false));

/* ===== BUTTONS ===== */

document.getElementById("energyBtn").addEventListener("click", () => {
    openQuiz("energy");
});

document.getElementById("oxygenBtn").addEventListener("click", () => {
    openQuiz("oxygen");
});

document.getElementById("foodBtn").addEventListener("click", () => {
    openQuiz("food");
});

document.getElementById("missionBtn").addEventListener("click", () => {

    const randomEvent =
        events[Math.floor(Math.random() * events.length)];

    document.getElementById("missionText").textContent = randomEvent;

    addLog(randomEvent);

});

/* ===== AUTO (30 sec drain) ===== */

setInterval(() => {

    resources.energy = Math.max(0, resources.energy - 3);
    resources.oxygen = Math.max(0, resources.oxygen - 2);
    resources.food = Math.max(0, resources.food - 2);

    updateUI();
    checkEvac();

}, 1000);

/* ===== START ===== */

updateUI();

});
