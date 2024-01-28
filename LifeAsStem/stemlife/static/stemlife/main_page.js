//life is stem main page
playerAge = 10

heightOfPlant = 0
document.addEventListener('DOMContentLoaded', ()=>{
    let btn = document.getElementById('new');
    btn.addEventListener("click", (evt)=>{ 
        
        document.getElementById("playerScore").innerHTML = "Age: " +playerAge
        console.info("playerAge: " + playerAge)
        document.getElementById("computerInput").innerHTML.visibility = "visible"
        
        fetch('/questions')
        .then(response => response.json())
        .then(question => {
            question.forEach(element => {
                currentQS = element
                if (currentQS.age == playerAge){
                    console.log(currentQS)
                    document.getElementById("computerInput").innerHTML = currentQS.text
                    
                    if (currentQS.answer1.length>1){
                        document.getElementById("ans_one").innerHTML = currentQS.answer1
                    }
                    if (currentQS.answer2.length>1){
                        document.getElementById("ans_two").innerHTML = currentQS.answer2
                    }
                    if (currentQS.answer3.length>1){
                        document.getElementById("ans_three").innerHTML = currentQS.answer3
                    }
                    if (currentQS.answer4.length>1){
                        document.getElementById("ans_four").innerHTML = currentQS.answer4
                    }
                }
            })
                    });
        playerAge+=1

    })
        //if btn and all the questions are answered, increase the age again
        //if not, ask another question from bank of questions
        
    
})



