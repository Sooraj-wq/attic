
const truthValue = [];

questions_data.forEach(question => {

    question.all_options.forEach(option => {

        truthValue.push(option.is_true);
    });
});

let currIdx = 0;

for (let i=1; i<=5; i++) {
    const quizPage = document.querySelector(`.quiz-page-${i}`);
    
    const optionLists = quizPage.querySelectorAll('.optionList');
    
    optionLists.forEach((option,idx) => {
        console.log(option.id)
        if (truthValue[currIdx] === 1) {
            const rc = option.querySelector('.radio-container');
            if(rc){
                rc.click();
            }else{
                option.querySelector('.container').click()
            }
            console.log("Answer clicked");
        }
        currIdx++;
    });

    quizPage.querySelector('.submit_quiz_step1').click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    quizPage.querySelector('.quizz_btn').click();
    await new Promise(resolve => setTimeout(resolve, 2000));
}
