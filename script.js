document.addEventListener("DOMContentLoaded", function () {
    const monthSelect = document.getElementById("month");
    const yearSelect = document.getElementById("year");
    const showCalendarButton = document.getElementById("show-calendar");
    const calendarDiv = document.getElementById("calendar");
    const eventInput = document.getElementById("event-input");
    const addEventButton = document.getElementById("add-event");
    const eventList = document.getElementById("events");
    const selectedDateDisplay = document.getElementById("selected-date");

    // Function to generate years dynamically in the year dropdown
    function generateYears() {
        const currentYear = new Date().getFullYear();
        for (let i = currentYear - 50; i <= currentYear + 50; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = i;
            yearSelect.appendChild(option);
        }
        yearSelect.value = currentYear; // Set current year by default
    }

    // Function to render the calendar based on selected month and year
    function renderCalendar(month, year) {
        calendarDiv.innerHTML = ""; // Clear previous calendar
        const date = new Date(year, month - 1); // month is 0-indexed in Date object
        const firstDay = date.getDay(); // Get first day of the month
        const lastDate = new Date(year, month, 0).getDate(); // Get last date of the month

        // Create days in the month
        let day = 1;
        const table = document.createElement("table");
        const headerRow = document.createElement("tr");
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        daysOfWeek.forEach((day) => {
            const th = document.createElement("th");
            th.textContent = day;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        let row = document.createElement("tr");
        for (let i = 0; i < firstDay; i++) {
            row.appendChild(document.createElement("td")); // Empty cells before the first day
        }

        while (day <= lastDate) {
            if (row.children.length === 7) {
                table.appendChild(row);
                row = document.createElement("tr");
            }

            const td = document.createElement("td");
            td.textContent = day;
            td.addEventListener("click", () => {
                // Show the selected date in the input box
                selectedDateDisplay.textContent = `Selected Date: ${month}/${day}/${year}`;
                localStorage.setItem("selectedDate", `${month}/${day}/${year}`);
            });
            row.appendChild(td);
            day++;
        }
        table.appendChild(row);
        calendarDiv.appendChild(table);
    }

    // Function to load events from localStorage
    function loadEvents() {
        const events = JSON.parse(localStorage.getItem("events")) || [];
        eventList.innerHTML = "";
        events.forEach((event) => {
            const li = document.createElement("li");
            li.textContent = `${event.date}: ${event.name}`;
            eventList.appendChild(li);
        });
    }

    // Function to add event and save to localStorage
    function addEvent() {
        const eventName = eventInput.value;
        const selectedDate = localStorage.getItem("selectedDate");
        if (!selectedDate || !eventName) {
            alert("Please select a date and enter an event.");
            return;
        }

        const events = JSON.parse(localStorage.getItem("events")) || [];
        events.push({ date: selectedDate, name: eventName });
        localStorage.setItem("events", JSON.stringify(events));

        loadEvents(); // Reload events after adding a new one
        eventInput.value = ""; // Clear the input field
    }

    // Initial Setup
    generateYears();
    loadEvents();

    // Show calendar when button is clicked
    showCalendarButton.addEventListener("click", () => {
        const month = parseInt(monthSelect.value);
        const year = parseInt(yearSelect.value);
        renderCalendar(month, year);
    });

    // Add event when button is clicked
    addEventButton.addEventListener("click", addEvent);

    // Optionally, load saved selected date
    const savedSelectedDate = localStorage.getItem("selectedDate");
    if (savedSelectedDate) {
        selectedDateDisplay.textContent = `Selected Date: ${savedSelectedDate}`;
    }
});
