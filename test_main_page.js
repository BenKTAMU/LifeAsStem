//life is stem main page
playerAge = 10

heightOfPlant = 0
document.addEventListener('DOMContentLoaded', ()=>{
    let btn = document.getElementById('new');
    btn.addEventListener("click", (evt)=>{ 
        playerAge += 1
        document.getElementById("playerScore").innerHTML = "Age: " +playerAge
        console.info("playerAge: " + playerAge)
        document.getElementById("computerInput").innerHTML.visibility = "visible"
        document.getElementById("computerInput").innerHTML = "Question: How tall is the plant?"
        //if btn and all the questions are answered, increase the age again
        //if not, ask another question from bank of questions
        
    })
})



