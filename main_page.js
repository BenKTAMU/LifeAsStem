//life is stem main page
playerAge = 0

heightOfPlant = 0
document.addEventListener('DOMContentLoaded', ()=>{
    let btn = document.getElementById('new');
    btn.addEventListener("click", (evt)=>{ 
        playerAge += 1
        document.getElementById("playerScore").innerHTML = "Age: " +playerAge
        //console.info("created")
    })
})



