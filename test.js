//example of how to get data
function question(){
    fetch('/question')
    .then(response => response.json())
    .then(question => {
        question.forEach(element => {
            console.log(element)
                });

    })
}