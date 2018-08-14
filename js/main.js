import fetchJsonp from 'fetch-jsonp';
import {isValidZip, showAlert} from './validate';


const petForm = document.querySelector('#pet-form')

petForm.addEventListener('submit', fetchAnimals);

// Fetch animals from API
function fetchAnimals(e) {
    e.preventDefault();

    // Get user input
    const animal = document.querySelector('#animal').value;
    const zip = document.querySelector('#zip').value;

    //Validate Zipcode
    if(!isValidZip(zip)) {
        showAlert("Please enter a valid zipcode!", "danger")
        return;
    }

    // Fetch pets
    fetchJsonp(`http://api.petfinder.com/pet.find?format=json&key=d143d05a8ed54b6b4d34a62a3118f606&animal=${animal}&location=${zip}&callback=callback`, {
        jsonpCallbackFunction: 'callback'
    })
    .then(res => res.json())
    .then(data => showAnimals(data.petfinder.pets.pet))
    .catch(err => console.log(err));
}

// jsonp callback
function callback(data) {
    console.log(data);
}

// Show animals
function showAnimals(pets) {
    const results = document.querySelector('#results');

    // Clear first
    results.innerHTML = '';

    // Loop through pets
    pets.forEach((pet) => {
        console.log(pet);
        const div = document.createElement('div');
        div.classList.add('card', 'card-body', 'mb-3');
        div.innerHTML = `
            <div class="row">
                <div class="col-sm-6">
                    <h4>${pet.name.$t} (${pet.age.$t})</h4>
                    <p class="text-secondary">${pet.breeds.breed.$t}</p>
                    <p>${pet.contact.address1.$t} ${pet.contact.city.$t} ${pet.contact.state.$t} ${pet.contact.zip.$t}</p>
                    <ul class="list-group">
                        <li class="list-group-item">Phone: ${pet.contact.phone.$t}</li>
                        ${pet.contact.email.$t ? `<li class="list-group-item">Email: ${pet.contact.email.$t}</li>` : ``}
                        <li class="list-group-item">Shelter ID: ${pet.shelterId.$t}</li>
                    </ul>
                </div>
                <div class="col-sm-6 text-center">
                    <img class="img-fluid mt-2" src="${pet.media.photos.photo[3].$t}">
                </div>
            </div>
        `;

        results.appendChild(div);
    });
}