const main = document.querySelector('.main');

let classSchedule = {}; 
//javascript renders the page
function renderForm() {
    main.innerHTML = `
        <label for="start-date" class="text-white text-xl md:text-2xl font-sans">Semester start date</label>
        <input type="date" id="start-date" name="calendar" class="start-date text-gray-500 w-full md:w-[15em] h-[40px] bg-black border-0 rounded-[5px] px-[10px]">
        
        <label for="end-date" class="text-white text-xl md:text-2xl font-sans">Semester end date</label>
        <input type="date" id="end-date" name="calendar" class="end-date text-gray-500 w-full md:w-[15em] h-[40px] bg-black border-0 rounded-[5px] px-[10px]">
        
        <input type="text" placeholder="Current attendance percent" class="percent w-full md:w-[90%] h-[40px] rounded-[30px] border-0 outline-none bg-black text-white p-[2px] text-[14px] pl-[20px]">
        <input type="text" placeholder="Extra leave hours/days" class="leave-hours w-full md:w-[90%] h-[40px] rounded-[30px] border-0 outline-none bg-black text-white p-[2px] text-[14px] pl-[20px]">
        <input type="text" placeholder="Extra working hours/days" class="work-hours w-full md:w-[90%] h-[40px] rounded-[30px] border-0 outline-none bg-black text-white p-[2px] text-[14px] pl-[20px]">
        <input type="text" placeholder="Target percent" class="target-percent w-full md:w-[90%] h-[40px] rounded-[30px] border-0 outline-none bg-black text-white p-[2px] text-[14px] pl-[20px]">
        
        <div class="week-selector flex justify-center items-center gap-1">
            <button class="weekday w-[40px] h-[40px] rounded-full border-0 bg-transparent text-white hover:bg-[hsl(261deg_80%_48%)] hover:shadow-[0_0_10px_hsl(261deg_80%_48%)]" id="Monday" data-count="0" data-initial="M">M</button>
            <button class="weekday w-[40px] h-[40px] rounded-full border-0 bg-transparent text-white hover:bg-[hsl(261deg_80%_48%)] hover:shadow-[0_0_10px_hsl(261deg_80%_48%)]" id="Tuesday" data-count="0" data-initial="T">T</button>
            <button class="weekday w-[40px] h-[40px] rounded-full border-0 bg-transparent text-white hover:bg-[hsl(261deg_80%_48%)] hover:shadow-[0_0_10px_hsl(261deg_80%_48%)]" id="Wednesday" data-count="0" data-initial="W">W</button>
            <button class="weekday w-[40px] h-[40px] rounded-full border-0 bg-transparent text-white hover:bg-[hsl(261deg_80%_48%)] hover:shadow-[0_0_10px_hsl(261deg_80%_48%)]" id="Thursday" data-count="0" data-initial="T">T</button>
            <button class="weekday w-[40px] h-[40px] rounded-full border-0 bg-transparent text-white hover:bg-[hsl(261deg_80%_48%)] hover:shadow-[0_0_10px_hsl(261deg_80%_48%)]" id="Friday" data-count="0" data-initial="F">F</button>
            <button class="weekday w-[40px] h-[40px] rounded-full border-0 bg-transparent text-white hover:bg-[hsl(261deg_80%_48%)] hover:shadow-[0_0_10px_hsl(261deg_80%_48%)]" id="Saturday" data-count="0" data-initial="S">S</button>
            <button class="weekday w-[40px] h-[40px] rounded-full border-0 bg-transparent text-white hover:bg-[hsl(261deg_80%_48%)] hover:shadow-[0_0_10px_hsl(261deg_80%_48%)]" id="Sunday" data-count="0" data-initial="S">S</button>
        </div>
        
        <button class="submit-btn px-[30px] py-[12px] rounded-[50px] cursor-pointer border-0 text-black bg-white shadow-[0_0_8px_rgba(0,0,0,0.05)] tracking-[1.5px] uppercase text-sm transition-all duration-500 ease-in-out hover:tracking-[3px] hover:bg-[hsl(261deg_80%_48%)] hover:text-[hsl(0,_0%,_100%)] hover:shadow-[0px_7px_29px_0px_rgb(93,24,220)] active:tracking-[3px] active:bg-[hsl(261deg_80%_48%)] active:text-[hsl(0,_0%,_100%)] active:shadow-[0_0_0_0_rgb(93,24,220)] active:transform active:translate-y-[10px] active:transition-all active:duration-[100ms]">Calculate!</button>
    `;
    // Event listeners are only added after page render
    attachFormListeners();
}

function attachFormListeners() {
    const submit = document.querySelector('.submit-btn');
    submit.addEventListener('click', calculate);

    const weekday = document.querySelectorAll('.weekday');
    weekday.forEach((element) => {
        element.setAttribute('data-initial', element.textContent);
        element.addEventListener('click', () => {
            const dayId = element.id;
            let currentCount = classSchedule[dayId] || 0;
            currentCount = (currentCount+1) % 4;
            
            if (currentCount>0) {

                classSchedule[dayId] = currentCount;
                element.textContent = currentCount;
                element.style.backgroundColor = "hsl(261deg 80% 48%)";
                element.style.boxShadow = "0 0 10px hsl(261deg 80% 48%)";
            } else {
                delete classSchedule[dayId];
                element.textContent = element.getAttribute('data-initial');
                element.style.backgroundColor = "";
                element.style.boxShadow = "";
            }
        });
    });
}

function calculate() {
    let total = 0;
    let currentTotal = 0;

    const target = 100 - Number(document.querySelector('.target-percent').value);
    const startdate = new Date(document.querySelector('.start-date').value);
    const enddate = new Date(document.querySelector('.end-date').value);
    const work = document.querySelector('.work-hours');
    const leave = document.querySelector('.leave-hours');
    
    let today = new Date();
    let passedDaysCount = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };
    let tempDate = new Date(startdate);
    while (tempDate <= today && tempDate <= enddate) {

        let day = tempDate.getDay();
        let dayName = Object.keys(passedDaysCount)[day];
        passedDaysCount[dayName]++;
        tempDate.setDate(tempDate.getDate() + 1);
    }
    
    for (const day in classSchedule) {
        if (passedDaysCount[day]) {

            currentTotal += passedDaysCount[day] * classSchedule[day];
        }
    }

    let taken = Math.floor(currentTotal * ((100 - Number(document.querySelector('.percent').value)) / 100));

    let weekdaysCount = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };

    let currentDate = new Date(startdate);

    while (currentDate <= enddate) {
        let day = currentDate.getDay(); 
        let dayName = Object.keys(weekdaysCount)[day];
        weekdaysCount[dayName]++;
        currentDate.setDate(currentDate.getDate() + 1); 
    }

    for (const day in classSchedule) {
        if (weekdaysCount[day]) {
            total += weekdaysCount[day] * classSchedule[day];
        }
    }

    total += (Number(work.value) || 0) - (Number(leave.value) || 0);
    
    let takeable = Math.floor(total * (target / 100));
    
    let left = takeable - taken;

    let resultHTML = '';
    if (left > 0) {
        resultHTML = `<div class="result text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text font-extrabold text-4xl text-center" >You can take ${left} more leaves!</div>`;
    } else if (left === 0) {
        resultHTML = `<div class="result text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text font-extrabold text-4xl text-center" >You cannot take any more leaves!</div>`;
    } else {
        resultHTML = `<div class="result text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text font-extrabold text-4xl text-center" >You are already short on attendance by ${Math.abs(left)} days!</div>`;
    }

    main.innerHTML = `${resultHTML} <button class="back-btn mt-10" onclick="renderForm()"> Go Back </button>`;
}

renderForm();