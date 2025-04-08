
let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

function generateCalendar(month, year) {
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.innerHTML = ''; // Clear existing calendar

    const firstDay = new Date(year, month - 1, 1).getDay(); // Get the first day of the month
    const lastDate = new Date(year, month, 0).getDate(); // Get the last date of the month
    
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    
    daysOfWeek.forEach(day => {
        const th = document.createElement('th');
        th.innerText = day;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    let row = document.createElement('tr');
    let dayOfMonth = 1;

    
    for (let i = 0; i < firstDay; i++) {
        const td = document.createElement('td');
        row.appendChild(td);
    }

    
    for (let i = firstDay; i < 7; i++) {
        row.appendChild(createDayCell(year, month, dayOfMonth++));
    }
    table.appendChild(row);

    while (dayOfMonth <= lastDate) {
        row = document.createElement('tr');
        for (let i = 0; i < 7; i++) {
            if (dayOfMonth <= lastDate) {
                row.appendChild(createDayCell(year, month, dayOfMonth++));
            } else {
                const td = document.createElement('td');
                row.appendChild(td);
            }
        }
        table.appendChild(row);
    }

    calendarContainer.appendChild(table);
}


function createDayCell(year, month, day) {
    const td = document.createElement('td');
    td.innerText = day;
    td.classList.add('calendar-day');
    
    let dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    td.dataset.date = dateStr;

    if (events[dateStr]) {
        td.classList.add('highlight');
    }

    td.addEventListener('click', function () {
        document.getElementById('selected-date').innerText = `Selected Date: ${dateStr}`;
        document.getElementById('event-input').dataset.date = dateStr;
    });

    return td;
}


function initializeYearDropdown() {
    const yearSelect = document.getElementById('year');
    const currentYear = new Date().getFullYear();

    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.innerText = i;
        yearSelect.appendChild(option);
    }
}

document.getElementById('add-event').addEventListener('click', function() {
    const eventInput = document.getElementById('event-input');
    const eventDescription = eventInput.value.trim();
    const selectedDate = eventInput.dataset.date;

    if (eventDescription && selectedDate) {
        if (!events[selectedDate]) {
            events[selectedDate] = [];
        }
        events[selectedDate].push(eventDescription);

        localStorage.setItem('calendarEvents', JSON.stringify(events));

        const eventList = document.getElementById('events');
        const eventItem = document.createElement('li');
        eventItem.innerText = `${selectedDate}: ${eventDescription}`;
        eventList.appendChild(eventItem);

        eventInput.value = '';

        
        generateCalendar(parseInt(document.getElementById('month').value), parseInt(document.getElementById('year').value));
    }
});


document.getElementById('show-calendar').addEventListener('click', function() {
    const month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);
    generateCalendar(month, year);
});


window.onload = function() {
    initializeYearDropdown();
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    document.getElementById('month').value = currentMonth;
    document.getElementById('year').value = currentYear;
    generateCalendar(currentMonth, currentYear);
};