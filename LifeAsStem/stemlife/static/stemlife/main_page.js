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
                        document.getElementById("ans_one").style.color = "white";
                        document.getElementById("ans_one").style.display = "inline";
                        document.getElementById("ans_one").innerHTML = currentQS.answer1
                    }
                    else{
                        document.getElementById("ans_one").innerHTML = ""
                        document.getElementById("ans_one").style.display = "none";
                    }
                    if (currentQS.answer2.length>1){
                        document.getElementById("ans_two").style.color = "white";
                        document.getElementById("ans_two").style.display = "inline";
                        document.getElementById("ans_two").innerHTML = currentQS.answer2
                    }
                    else{
                        document.getElementById("ans_two").innerHTML = ""
                        document.getElementById("ans_two").style.display = "none";
                    }
                    if (currentQS.answer3.length>1){
                        document.getElementById("ans_three").style.color = "white";
                        document.getElementById("ans_three").style.display = "inline";
                        document.getElementById("ans_three").innerHTML = currentQS.answer3
                    }
                    else{
                        document.getElementById("ans_three").innerHTML = ""
                        document.getElementById("ans_three").style.display = "none";
                    }
                    if (currentQS.answer4.length>1){
                        document.getElementById("ans_four").style.color = "white";
                        document.getElementById("ans_four").style.display = "inline";
                        document.getElementById("ans_four").innerHTML = currentQS.answer4
                    }
                    else{
                        document.getElementById("ans_four").innerHTML = ""
                        document.getElementById("ans_four").style.display = "none";
                    }
                }
            })
                    });
        playerAge+=1
        if (playerAge==19){
            document.getElementById("computerInput").innerHTML = "You have reached adulthood! You have completed the game!"
            document.getElementById("ans_one").style.display = "none";
            document.getElementById("ans_two").style.display = "none";
            document.getElementById("ans_three").style.display = "none";
            document.getElementById("ans_four").style.display = "none";
            document.getElementById("ans_five").style.display = "block";
        }

    })
    let ans1 = document.getElementById('ans_one');
    let ans2 = document.getElementById('ans_two');
    let ans3 = document.getElementById('ans_three');
    let ans4 = document.getElementById('ans_four');

    ans1.addEventListener("click", (evt)=>{
        ans1.style.color = "red";
        evt.preventDefault();
        console.log("ans1 clicked");
        fetch('/update/' + '1' + '/' + playerAge)
        .then(response => response.json())

    })

    ans2.addEventListener("click", (evt)=>{
        ans2.style.color = "red";        
        evt.preventDefault();
        console.log("ans2 clicked");
        fetch('/update/' + '2' + '/' + playerAge)
        .then(response => response.json())
    })

    ans3.addEventListener("click", (evt)=>{
        ans3.style.color = "red";
        evt.preventDefault();
        console.log("ans3 clicked");
        fetch('/update/' + '3' + '/' + playerAge)
        .then(response => response.json())
    })

    ans4.addEventListener("click", (evt)=>{
        ans4.style.color = "red";
        evt.preventDefault();
        console.log("ans4 clicked");
        fetch('/update/' + '4' + '/' + playerAge)
        .then(response => response.json())
    })

        //if btn and all the questions are answered, increase the age again
        //if not, ask another question from bank of questions
        
    
})



