// Ajax call as soon as the page loads 

window.addEventListener('DOMContentLoaded', () => {
    updateTheatreAreas();
    updateScheduleDates();
    updateNowShowing();
});


// XMLHTTP request to get the area from the finnkino API

function updateTheatreAreas() {
    let url = "https://www.finnkino.fi/xml/TheatreAreas";
    fetch(url)
        .then(response => response.text())
        .then(data => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(data, "application/xml");

            showTheatreArea(xml);
        });
}

// Displaying the XMLHTTP response (name and location of the theatres) to the option element in webpage

function showTheatreArea(area) {
    const list = document.getElementById('area');
    let areas = area.getElementsByTagName('Name'); // targeting the xml document 
    let areaIdCollection = area.getElementsByTagName('ID'); // targeting the xml document 

    //Converting HTML collection to array 
    const array = Array.from(areas);
    const areaids = Array.from(areaIdCollection);

    // Looping through all the areas provided in Finnkino API, creating an element in html and appending them to desired position.

    for (let i = 0; i < array.length; i++) {
        const li = document.createElement('option');
        let area = array[i].textContent;
        li.textContent = area;
        //setting attribute to the areas so that it is easy to target while making search
        li.setAttribute('value', areaids[i].textContent);
        list.appendChild(li);
    }

}

// XMLHTTP request to get the dates from the finnkino API

function updateScheduleDates() {
    let urlDate = "https://www.finnkino.fi/xml/ScheduleDates/";
    fetch(urlDate)
        .then(response => response.text())
        .then(data => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(data, "application/xml");

            // console.log(xml);
            showDateTime(xml);
        });
}

// Displaying the XMLHTTP response (dates) to the option element in webpage

function showDateTime(date) {
    const list = document.getElementById('timetable');
    let dateTime = date.getElementsByTagName('dateTime'); // targeting the xml document 

    const timetable = Array.from(dateTime);

    // looping through all the dates from API and displaying it its respective postion in html

    for (let i = 0; i < timetable.length; i++) {
        const li = document.createElement('option');
        let date = new Date(timetable[i].textContent).toLocaleDateString("fi-FI"); // converting the API to local date style
        li.textContent = date;
        list.appendChild(li);
    }

}

// XMLHTTP request to get the event (all movies) from the finnkino API

function updateNowShowing() {
    let urlImage = "https://www.finnkino.fi/xml/Events/";
    fetch(urlImage)
        .then(response => response.text())
        .then(data => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(data, "application/xml");

            // console.log(xml);
            showThumbnails(xml);
        });
}

// Displaying the XMLHTTP response (20 currently in theatre movie poster in the landing page) to the option element in webpage

function showThumbnails(date) {
    const list = document.getElementById('nowshowing');
    let thumbnails = date.getElementsByTagName('EventMediumImagePortrait'); // targeting the xml document 

    const thumbnail = Array.from(thumbnails);

    // console.log(thumbnail);

    for (let i = 0; i < 20; i++) {
        const li = document.createElement('img');
        let image = thumbnail[i].innerHTML;
        li.src = image;
        list.appendChild(li);

    }

}


// Adding the eventlistener to search button 

const searchBtn = document.getElementById('show-table');
const nowShowing = document.getElementById('nowshowing');


searchBtn.addEventListener('click', () => {

    const selectEl = document.querySelector("#area");
    const selectedAreaId = selectEl.value; // targeting the parameter using the ID attribute


    // XMLHTTP request as per the selection by users.

    let url = `https://www.finnkino.fi/xml/Schedule?area=${selectedAreaId}&dt=`;
    fetch(url)
        .then(response => response.text())
        .then(data => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(data, "application/xml");

            // console.log(xml);

            showSchedule(xml);
            nowShowing.style.display = 'none';
        });

})


// Display the search results as per the input

function showSchedule(movie) {
    const displayList = document.getElementById('schedule');

    displayList.innerHTML = "";

    const show = movie.getElementsByTagName('Show');

    // Looping through the "Show" element of xml and extracting the required information as follows

    for (let i = 0; i < show.length; i++) {

        let li = document.createElement('div');
        li.classList.add('movie-info');

        // Search result containg the following information

        let shows = show[i].querySelector('Title').textContent;
        let genres = show[i].querySelector('Genres').textContent;
        let theatre = show[i].querySelector('Theatre').textContent;
        let image = show[i].getElementsByTagName('Images')[0].querySelector('EventSmallImagePortrait').textContent;
        let scheduleTime = new Date(show[i].querySelector('dttmShowStart').textContent).toLocaleTimeString("fi-FI");


        // html template-literal for rending the response into html page

        li.innerHTML = `
            <img class="images" src="${image}" <br> <p>${genres}</p>  </img>
            <h2>${shows} </h2> 
            <h3>${theatre} <br> ${scheduleTime} </h3> 
            `;

        // Search information display
        displayList.appendChild(li);

    }


}