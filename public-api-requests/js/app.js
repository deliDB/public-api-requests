
const gallery = document.getElementById('gallery');
const body = document.querySelector('body');
const searchContainer = document.querySelector('.search-container');
const randomUsersURL = 'https://randomuser.me/api/?nat=us&results=12';
let userData = [];

function fetchData(url){
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        .catch(error => console.log('Uh oh! There was a problem.', error))
}

fetchData(randomUsersURL)
    .then(data => {
        userData = data.results;
        displayUsers(userData)
    })

function checkStatus(response){
    if (response.ok) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(new Error(response.statusText));
      }
}

/**
* Creates and appends the elements needed to display a page of twelve employees.
*
* @param {array} data - An array of objects param.
**/

function displayUsers(data){
    const users = data.map((user, index) => `
        <div class="card" data-index=${index}>
            <div class="card-img-container">
                <img class="card-img" src=${user.picture.large} alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
            </div>
        </div>
    `).join('');
    gallery.insertAdjacentHTML('beforeend', users);
}

/**
* Creates and appends the elements needed to display a modal of the employee card that was clicked.
*
* @param {number} i - The index of the clicked employee card.
**/
function createModal(i){
    const user = userData[i];
    
    //Formats date to mm/dd/year format. Source: https://www.freecodecamp.org/news/how-to-format-dates-in-javascript/
    const formattedDate = new Date(user.dob.date).toLocaleDateString('en-US');
    html = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="modal-text">${user.email}</p>
                    <p class="modal-text cap">${user.location.city}</p>
                    <hr>
                    <p class="modal-text">${user.phone}</p>
                    <p class="modal-text">${user.location.street.number} ${user.location.street.name}., ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                    <p class="modal-text">${formattedDate}</p>
                </div>
            </div>


            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;
    body.insertAdjacentHTML('beforeend', html)

   closeModal()
   nextModal(i) 
   prevModal(i) 
}

//Opens modal when employee card clicked.
gallery.addEventListener('click',  e => {
    const clickedItem = e.target;
    if(clickedItem.matches('.card, .card *')){
        const index = clickedItem.closest('.card').getAttribute('data-index');
        createModal(index);
    } 
});

//Closes modal when "X" is clicked.
function closeModal(){
    const modalContainer = document.querySelector('.modal-container');
    const closeBtn = document.getElementById('modal-close-btn');
    closeBtn.addEventListener('click',  () => {
        modalContainer.remove();
    });
}

/**
* Switches to the next employee modal when the "next" button is clicked.
*
* @param {number} index - The index of the current employee modal.
**/
function nextModal(index){
    const nextBtn = document.getElementById('modal-next');
    const modalContainer = document.querySelector('.modal-container');
    nextBtn.addEventListener('click', () => {
        modalContainer.remove();
        index++
        if(index < userData.length){
            createModal(index);
        } else {
            createModal(0);
        }
    });
}

/**
* Switches to the previous employee modal when the "prev" button is clicked.
*
* @param {number} index - The index of the current employee modal.
**/
function prevModal(index){
    const prevBtn = document.getElementById('modal-prev');
    const modalContainer = document.querySelector('.modal-container');
    prevBtn.addEventListener('click', () => {
        modalContainer.remove();
        index--
        if(index >= 0){
            createModal(index);
        } else {
            createModal(userData.length - 1);
        }
    });
}

//Appends search bar to the DOM.
searchContainer.insertAdjacentHTML('beforeend', `
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`);

/**
* Function that pushes employee objects matching the value entered in the search bar into an empty array.
*
* @param {string} searchInput - User input into the search bar
* @param {array} data - Array of employee objects that match user input for filtering
**/
function searchEmployees(searchInput, data){
    let filteredList = [];
    const inputValue = searchInput.value;
    for(const employee of data){  
       if(employee.name.first.toLowerCase().includes(inputValue.toLowerCase()) || employee.name.last.toLowerCase().includes(inputValue.toLowerCase())){
          filteredList.push(employee);   
       } 
    }
    if(filteredList.length !== 0){
        gallery.innerHTML = '';
        userData = filteredList; //fixes modal but you have to refresh to restore a list of employees
        displayUsers(userData);
    } else{
        gallery.innerHTML = `<h2>No results found!<h2/>`;
    }
}

 const input = document.getElementById('search-input');
 input.addEventListener('keyup', () => {
       searchEmployees(input, userData)
  });
  

  
