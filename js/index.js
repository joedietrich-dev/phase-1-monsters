'use strict';
document.addEventListener('DOMContentLoaded', app);

function app() {
  let page = 1;
  const prevButton = document.getElementById('back');
  prevButton.addEventListener('click', () => {
    if (page <= 1) return;
    page -= 1;
    renderMonsters(page);
  })
  const nextButton = document.getElementById('forward');
  nextButton.addEventListener('click', () => {
    page += 1;
    renderMonsters(page);
  })
  const monsterContainer = document.getElementById('monster-container');

  addForm()
  renderMonsters(page);

  function addForm() {
    const formDiv = document.querySelector('#create-monster');
    const monsterForm = document.createElement('form');
    monsterForm.id = 'monster-form';

    const newNameField = document.createElement('input');
    newNameField.placeholder = 'Name...';
    newNameField.type = 'text';
    newNameField.name = 'name';
    newNameField.id = 'name';

    const newAgeField = document.createElement('input');
    newAgeField.placeholder = 'Age...';
    newAgeField.type = 'text';
    newAgeField.name = 'age';
    newAgeField.id = 'age';

    const newDescriptionField = document.createElement('input');
    newDescriptionField.placeholder = 'Description';
    newDescriptionField.type = 'text';
    newDescriptionField.name = 'description';
    newDescriptionField.id = 'description';

    const createMonsterButton = document.createElement('input');
    createMonsterButton.value = 'Create';
    createMonsterButton.type = 'submit';

    monsterForm.append(newNameField, newAgeField, newDescriptionField, createMonsterButton);
    monsterForm.addEventListener('submit', handleMonsterSubmit);
    formDiv.appendChild(monsterForm);
  }

  async function renderMonsters(page = 1) {
    monsterContainer.innerHTML = ''
    const monsterData = await fetch(`http://localhost:3000/monsters?_limit=50&_page=${page}`);
    const monsters = await monsterData.json();
    monsters.forEach(monster => renderMonster(monsterContainer, monster));
    if (page <= 1) {
      prevButton.disabled = true;
    } else {
      prevButton.disabled = false;
    };
  }

  function renderMonster(parent, { name, age, description }) {
    const monsterCard = document.createElement('div');
    const nameElement = document.createElement('h2');
    const ageElement = document.createElement('h4');
    const descriptionElement = document.createElement('p')

    nameElement.innerText = name;
    ageElement.innerText = 'Age: ' + age;
    descriptionElement.innerText = 'Bio: ' + description;

    monsterCard.append(nameElement, ageElement, descriptionElement);
    parent.appendChild(monsterCard);
  }

  function handleMonsterSubmit(event) {
    event.preventDefault()
    const { name, age, description } = event.target.elements;
    fetch('http://localhost:3000/monsters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        age: age.value,
        description: description.value,
      })
    }).then(res => res.json())
      .then(data => renderMonster(monsterContainer, data));
    event.target.reset();
  }


}