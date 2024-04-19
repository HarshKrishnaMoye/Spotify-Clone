let currentSong = new Audio();
let songs;
let currFloder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder)
{
    currFloder = folder;
    let a = await fetch(`http://127.0.0.1:5501/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs=[];
    console.log(as);

    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}`)[1]);
        }
        
    }
    

    //Show all the songs in the library / Playlist
    let songUl=  document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML=" ";
    for (const song of songs) {

        songUl.innerHTML = songUl.innerHTML + `<li> 
                    <img class="invert" src="Images/music.svg" alt="music"> 
                    <div class="info">
                        <div class="songName">${song.replaceAll("%20"," ").replaceAll("/","")} 
                        </div>
                        <div class="artist"> Harsh Moye</div>
                    </div>
                    <img class="invert" src="Images/play2.svg" alt="play"></li>`;
    }

    //Attach event listner to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    });

    return songs;
}


const playMusic= (track , pause=false)=>{
    currentSong.src=`/${currFloder  }/` + track; 
    if(!pause)
    {
        currentSong.play();
        play.src="Images/pause.svg"

    }

    document.querySelector(".songInfo").innerHTML=decodeURI(track.replaceAll("/",""));
    document.querySelector(".songTime").innerHTML="00:00 / 00:00"

}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5501/Songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
        
        
        if(e.href.includes("/Songs/")){
           let folder =e.href.split("/").slice(-1)[0];
        //    console.log(folder);

           //Get metadata of the folder
           let a = await fetch(`http://127.0.0.1:5501/Songs/${folder}/info.json`);
           let response = await a.json();
           cardContainer.innerHTML= cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
           <div class="play">
               <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" >
                   <circle cx="12" cy="12" r="10" fill="#1ed760" stroke="#1ed760" stroke-width="1.5" style="background-color: #1ed760;"/>
                   <path d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z" fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linejoin="round"/>
                 </svg>
           </div>
             
           <img src="/Songs/${folder}/cover.jpeg" alt="albumImage">
           <h3>${response.title}</h3>
           <p>${response.Description}</p>
       </div>`
        }
    }

     //Load the playlist whenever card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            // console.log(e);
            console.log("Fetching Songs")
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
            
        })
     })
}

async function main()
{

   

    //Get the list of songs
    await getSongs("Songs/English");
    playMusic(songs[0],true)

    //Display all the albums on the page
    displayAlbums();    
    
    

    
    //Attach an event listner to play , next and previous 

    play.addEventListener("click",()=>{

        if(currentSong.paused)
        {
            currentSong.play();
            play.src="Images/pause.svg"
         
        }
        else{
            currentSong.pause();
            play.src="Images/play.svg"
         
        }

    });


    //Listen for timeupdate event 

    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML=  `${secondsToMinutesSeconds(currentSong.currentTime)}/ ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left= (currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    //Add an event listner to seekbar

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) *100;
        document.querySelector(".circle").style.left= percent + "%";
        currentSong.currentTime= (currentSong.duration * percent) / 100; 
    })

    //Add an event listner for menu button

    document.querySelector(".menu").addEventListener("click",()=>{

        document.querySelector(".left").style.left="-17px";

    })

    //Add an event listner for close button

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-130%";
    })

     //Add an event listner for next button 

     next.addEventListener("click",()=>{

        console.log("next clicked");
        // currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs,index);

        if((index + 1) < songs.length)
        {

            playMusic(songs[index + 1]);
        }
     })


     //Add an event listner for previous button 

     previous.addEventListener("click",()=>{

        console.log("previous clicked");
        // console.log(currentSong.src.split("/").slice(-1)[0]);
        // currentSong.src.split("/").slice(-1)[0];
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        
        console.log(songs,index);

        if((index - 1) > 0 ){

            playMusic(songs[index - 1]);
        }

     })

     //Add an event to volume

     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("Setting Volume To "+ e.target.value +" / 100" );
        currentSong.volume=parseInt(e.target.value)/100; 
     })

     //Add event listner to mute the track

     document.querySelector(".volume>img").addEventListener("click",(e)=>{
        console.log(e.target.src);
        if(e.target.src.includes("Images/volume.svg")){
            console.log("muted")
            e.target.src = e.target.src.replace("Images/volume.svg","Images/mute.svg");
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value= 0;
        }
        else{
            console.log("unmuted")
            e.target.src = e.target.src.replace("Images/mute.svg","Images/volume.svg");
            currentSong.volume= .1;
            document.querySelector(".range").getElementsByTagName("input")[0].value= 10;
        }
     })
     

    


}



main();




