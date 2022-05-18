const audio = new Audio();
let PauseFlag = true;
let play = document.querySelector('.play_btn');
let next = document.querySelector('.next');
let prew = document.querySelector('.prew');
let background = document.querySelector('.background-img');
let audioImage = document.querySelector('.audio-img');
let audioDuration =  document.querySelector('.music-duration');
let timer = document.querySelector('.timer-music');
let progressBar = document.querySelector('.progress-bar');
let volumeSlider = document.querySelector(".volumeSlider");
let songName = document.querySelector('.song-name');
let sub_name = document.querySelector('.sub_name');
let error = document.querySelector('.error')
let search_button = document.querySelector('.search_btn')
let search_inp = document.querySelector('.search')
let spinner = document.querySelector('.lds-spinner')
let timeOfSong = 0;
let namePersons = [];
let songNames = [];
let backgroundImages = [];
let music = [];
let counter = 1;
let errorFlag = true;

function loadPage(name = 'eminem') {
    getData(name)
    writeData()

}


async function getData(name) {
    try{
        let data = {}
        if(name.length != 0){
            data = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${name}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
                    "x-rapidapi-key": "e82341cd12mshdaa5b0ef471596bp1a54cejsn21c700147458"
                }})
        }else{
            data = await fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=eminem`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
                    "x-rapidapi-key": "e82341cd12mshdaa5b0ef471596bp1a54cejsn21c700147458"
                }})
        }

    let result = await data.json();
    music.length = 0;
    namePersons.length = 0;
    songNames.length = 0;
    backgroundImages.length = 0;
    
    for (let a of result.data){
        music.push(a.preview)
        backgroundImages.push(a.artist.picture_big)
        songNames.push(a.album.title)
        namePersons.push(a.artist.name)
    }
    errorFlag = false
    spinner.style.display = 'none'
    error.textContent = '';
    writeData()
    }catch(errors){
        spinner.style.display = 'block'
     error.textContent = 'Не удалось получить данные с cервера. Пожалуйста, обновите страницу или поиск несколько раз';
     errorFlag = true;
    }

}


function writeData(){
    background.src = backgroundImages[0]
    songName.textContent = namePersons[0]
    sub_name.textContent = songNames[0]
    audioImage.style.backgroundImage = `url(${backgroundImages[0]})`
    audio.src = `${music[0]}`
}



function playAudio() {
  audio.src = `${music[counter-1]}`
  if(PauseFlag){
      
    audio.currentTime = timeOfSong
        audio.play(); 
        play.src = './assets/svg/pause.png'
        PauseFlag = false
        
  }else if(!PauseFlag){
    audio.currentTime = timeOfSong
        audio.pause()
        play.src = './assets/svg/play.png'
        PauseFlag = true
    }
}

function nextAudio(nameSong) {
    audio.src = `${nameSong}`
    audio.currentTime = 0;
    audio.play(); 
    play.src = './assets/svg/pause.png'
    PauseFlag = false
}

function formatTime(seconds) {
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    if(s<10){
        return `${m}:0${s}`
    }else{
        return `${m}:${s}`
    }
}

let progressTime = setInterval(() => {
    let current = audio.currentTime
    let duration = audio.duration
    let procent = current/duration*100
    progressBar.value = Math.floor(procent)
}, 1000);


play.addEventListener('click' ,  () => {
playAudio()
})

search_button.addEventListener('click' , function () {
    let value = search_inp.value;
    
    getData(String(value))

})

next.addEventListener('click', ()=> {
    if(counter == music.length){
        counter = 1
    }else{
        counter++
    }
    nextAudio(music[counter-1])
    background.src = `${backgroundImages[counter-1]}`
    audioImage.style.backgroundImage = `url(${backgroundImages[counter-1]})`
    songName.textContent = namePersons[counter-1]
    sub_name.textContent = songNames[counter-1]
})

prew.addEventListener('click', ()=> {
    if(counter == 1){
        counter = music.length
    }else{
        counter--
    }
    nextAudio(music[counter-1])
    background.src = `${backgroundImages[counter-1]}`
    audioImage.style.backgroundImage = `url(${backgroundImages[counter-1]}`
    songName.textContent = namePersons[counter-1]
    sub_name.textContent = songNames[counter-1]
})

progressBar.addEventListener('change' , (event) => {
    let duration = audio.duration
    console.log(duration)
    console.log(audio.currentTime)
    let result = event.target.value*Math.floor(duration)/100
    audio.currentTime = result
    
})

audio.onloadeddata = () => {
    audioDuration.textContent = formatTime(audio.duration)
    setInterval(() => {
        timer.textContent = formatTime(audio.currentTime)
        timeOfSong = audio.currentTime
    }, 1000); 
  }

  volumeSlider.addEventListener("input", () => {
	audio.volume = parseFloat(volumeSlider.value)
}, false)


loadPage()


