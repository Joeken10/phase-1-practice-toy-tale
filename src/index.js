// let addToy = false;

// document.addEventListener("DOMContentLoaded", () => {
//   const addBtn = document.querySelector("#new-toy-btn");
//   const toyFormContainer = document.querySelector(".container");
//   addBtn.addEventListener("click", () => {
//     // hide & seek with the form
//     addToy = !addToy;
//     if (addToy) {
//       toyFormContainer.style.display = "block";
//     } else {
//       toyFormContainer.style.display = "none";
//     }
//   });
// });

document.addEventListener('DOMContentLoaded', () => {
  fetchToys();
  const addBtn = document.getElementById('new-toy-btn');
  const toyForm = document.querySelector('.container');
  addBtn.addEventListener('click', () => {
    toyForm.style.display = toyForm.style.display === 'block' ? 'none' : 'block';
  });

  toyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addNewToy(event.target);
  });
});

function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => toys.forEach(renderToy));
}

function renderToy(toy) {
  const toyCollection = document.getElementById('toy-collection');
  const card = document.createElement('div');
  card.classList.add('card');
  
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;
  
  card.querySelector('.like-btn').addEventListener('click', () => {
    updateLikes(toy);
  });

  toyCollection.appendChild(card);
}

function addNewToy(form) {
  const toyData = {
    name: form.name.value,
    image: form.image.value,
    likes: 0
  };

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(toyData)
  })
  .then(response => response.json())
  .then(toy => renderToy(toy));
}

function updateLikes(toy) {
  toy.likes += 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ likes: toy.likes })
  })
  .then(response => response.json())
  .then(updatedToy => {
    const toyCard = document.getElementById(updatedToy.id).parentElement;
    toyCard.querySelector('p').textContent = `${updatedToy.likes} Likes`;
  });
}
