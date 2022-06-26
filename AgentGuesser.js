var agentID = "dade69b4-4f5a-8528-247b-219e5a1facd6"
const agentsUrl = "https://valorant-api.com/v1/agents/"
const allAgentsUrl = "https://valorant-api.com/v1/agents"
var agentName;
var url;
var randomLanguage;
const langs = ["de-DE", 
"en-US", "es-ES", "es-MX", "fr-FR", "tr-TR", "pl-PL", "pt-BR", "ru-RU", "it-IT", "ar-AE", "ja-JP", "ko-KR", "th-TH", "vi-VN", "id-ID", "zh-CN", 
"zh-TW"];
var score = 0;

var currentRound = 1;
var maxRounds = 10;

var interval;
var resetTime;
var isHintActive = false;

var volumePressed = false;

//UI Variables
const scoreText = document.querySelector("#score-text");
const agentNameText = document.querySelector("#agent-name");
const voicelineText = document.querySelector("#voiceline-language");
const agentImage = document.querySelector("#agent-image");
const agentVoicelineAudio = document.querySelector("#agent-voiceline");
const audioDurationTime = document.querySelector("#duration-text");
const agentsSelect = document.querySelector("#agents");
const languagesSelect = document.querySelector("#languages");

const roundsContainer = document.querySelector("#rounds-container");
const roundsCounter = document.querySelector("#rounds-counter");

const audioPlayer = document.querySelector("#audio-player");
const playBtn = document.querySelector("#play-button");
const progressBar = document.querySelector("#audio-progress");
const progress = progressBar.querySelector(".progress");

const volumeBtn = document.querySelector("#volume-button");
const volumeContainer = document.querySelector(".volume-container");
const volumeBar = document.querySelector("#volume-progress");
const volumeProgress = volumeBar.querySelector(".progress");

const rulesBtn = document.querySelector("#info-icon");
const infoContainer = document.querySelector("#info-container");


async function GetAllAgents()
{
    clearTimeout(interval);

    randomLanguage = langs[Math.floor(Math.random() * 10)]
    let url = allAgentsUrl + "?language=" + randomLanguage;
    fetch(url,{
        method: 'GET'
      })
        .then(response => response.json()
            .then(json => init(json))
            .catch(jsonError => console.log(jsonError))
            )
        .catch(error => console.log(error));
    
}

function getFlagEmoji(countryCode) {
    const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}
function init(json)
{
    isHintActive = true
    UpdateRounds();
    let jsonData = json.data[Math.floor(Math.random() * json.data.length)];
    console.log(jsonData.displayName);
    console.log(randomLanguage);

    scoreText.innerHTML = score;
    agentNameText.innerHTML = "???";
    voicelineText.innerHTML = "???";

    agentName = jsonData.displayName;
    
    
    if(isHintActive == false)
    {
        agentImage.classList.add("hide-element");
    }
    agentImage.src = jsonData.displayIcon;
    agentImage.style.filter = "contrast(0)";
    
    agentVoicelineAudio.src = jsonData.voiceLine.mediaList[0].wave;
}
function GuessAgent()
{
    var guessedName = agentsSelect.value;
    var guessedLanguage = languagesSelect.value;

    if(isHintActive == false)
    {
        if(guessedName.toLowerCase() == agentName.toLowerCase() && guessedLanguage.toLowerCase() == randomLanguage.toLowerCase())
        {
            score += 6;
            agentName = agentName.toLowerCase();
            agentName = agentName.charAt(0).toUpperCase() + agentName.slice(1);
            
            
            scoreText.innerHTML = score;
            agentNameText.innerHTML = agentName;
            voicelineText.innerHTML = getFlagEmoji(randomLanguage.slice(3));
            agentImage.style.filter = "contrast(1)";
        }
        if(guessedName.toLowerCase() == agentName.toLowerCase() && guessedLanguage.toLowerCase() != randomLanguage.toLowerCase() ||
        guessedName.toLowerCase() != agentName.toLowerCase() && guessedLanguage.toLowerCase() == randomLanguage.toLowerCase())
        {
            score += 2;
            agentName = agentName.toLowerCase();
            agentName = agentName.charAt(0).toUpperCase() + agentName.slice(1);
            
            
            scoreText.innerHTML = score;
            agentNameText.innerHTML = agentName;
            voicelineText.innerHTML = getFlagEmoji(randomLanguage.slice(3));
            agentImage.style.filter = "contrast(1)";
        }
        else{
            console.log("Wrong guess!");
        }
    }
    else
    {
        if(guessedName.toLowerCase() == agentName.toLowerCase() && guessedLanguage.toLowerCase() != randomLanguage.toLowerCase() ||
        guessedName.toLowerCase() != agentName.toLowerCase() && guessedLanguage.toLowerCase() == randomLanguage.toLowerCase())
        {
            score += 1;
            agentName = agentName.toLowerCase();
            agentName = agentName.charAt(0).toUpperCase() + agentName.slice(1);
            
            
            scoreText.innerHTML = score;
            agentNameText.innerHTML = agentName;
            voicelineText.innerHTML = getFlagEmoji(randomLanguage.slice(3));
            agentImage.style.filter = "contrast(1)";
        }
        else{
            console.log("Wrong guess!");
        }
    }
    agentImage.classList.remove("hide-element");
    NextAgent();
}

function NextAgent() 
{
    currentRound ++;
    UpdateRounds();
    interval = setTimeout(GetAllAgents, 3000);    
}

function UpdateRounds()
{
    roundsCounter.innerHTML = currentRound + "/" + maxRounds;
}

function ActiveHints()
{
    isHintActive = true;
    agentImage.classList.remove("hide-element");
}


function PlayAudio() {
    clearTimeout(resetTime);
    audioPlayer.classList.add("play");
    playBtn.querySelector("i.fas").classList.remove("fa-play");
    playBtn.querySelector("i.fas").classList.add("fa-pause");

    agentVoicelineAudio.play();
}
function PauseAudio() 
{
    audioPlayer.classList.remove("play");
    playBtn.querySelector("i.fas").classList.remove("fa-pause");
    playBtn.querySelector("i.fas").classList.add("fa-play");
    agentVoicelineAudio.pause();
}

function UpdateProgress(e) 
{
    const {duration, currentTime} = e.srcElement;
    let progressPercent = (currentTime/duration) * 100;

    progress.style.width = `${progressPercent}%`;

    audioDurationTime.innerHTML = formatTime(currentTime)
    + "/" + formatTime(duration);

    function formatTime(time)
    {
        return new Date(time * 1000).toISOString().slice(14,22);
    }
}
function SetProgress(e) 
{
    const width = this.clientWidth;
    const clickPositionX = e.offsetX;
    const duration = agentVoicelineAudio.duration;

    agentVoicelineAudio.currentTime = (clickPositionX / width) * duration;
}
function ResetPlayer(e) 
{
    
    playBtn.querySelector('i.fas').classList.remove("fa-pause");
    playBtn.querySelector('i.fas').classList.add("fa-play");
    
    resetTime = setTimeout(function(){
        progress.style.width = `0%`;
    }, 250);
        
}

function SetVolume(e) 
{
    const height = this.clientHeight;
    const clickPositionY = e.offsetY;

    var rawVolume = (clickPositionY / height);
    agentVoicelineAudio.volume = rawVolume;
    var volumePercent = rawVolume * 100;
    volumeProgress.style.height = `${volumePercent}%`;
}

//Event Listeners
playBtn.addEventListener('click', () =>{
    const isPlaying = audioPlayer.classList.contains("play");

    if(isPlaying)
    {
        PauseAudio();
    }
    else
    {
        PlayAudio();
    }
});

agentVoicelineAudio.addEventListener('timeupdate', UpdateProgress);
agentVoicelineAudio.addEventListener('ended', ResetPlayer);

progressBar.addEventListener('click', SetProgress);

volumeBtn.addEventListener('click', () => {
    volumePressed = !volumePressed;

    if(volumePressed)
    {
        volumeContainer.classList.remove('hide-element');
        volumeBtn.style.color = "var(--highlight-color)";
    }
    else
    {
        volumeContainer.classList.add('hide-element');
        volumeBtn.style.color = "inherit";
    }
});

volumeBar.addEventListener('click', SetVolume);

rulesBtn.addEventListener('mouseover', () => {
    infoContainer.classList.remove("hide-element");
});
rulesBtn.addEventListener('mouseleave', () => {
    infoContainer.classList.add("hide-element");
});
GetAllAgents();
