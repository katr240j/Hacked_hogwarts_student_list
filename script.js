"use strict";

window.addEventListener("DOMContentLoaded", start);

//arrau for students
let allStudents = [];

//setting for student, global values, prototype what they contain

let Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  house: "",
  image: "",
};

// Global variables for filtering, sorting and sorting direction
const settings = {
  filter: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

//load json
function start() {
  console.log("DOM loaded");
  loadJSON();
  addEventListeners();
}

function addEventListeners() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => {
    button.addEventListener("click", selectFilter);
  });
}

async function loadJSON() {
  const respons = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
  const jsonData = await respons.json();
  prepareObjects(jsonData);
}

// Prepare data objects
function prepareObjects(students) {
  students.forEach((element) => {
    const student = Object.create(Student);

    student.firstName = getFirstName(element.fullname);
    student.lastName = getLastName(element.fullname);
    student.middleName = getMidddelName(element.fullname);
    student.nickName = getNickName(element.fullname);
    student.image = getImage(student.firstName, student.lastName);
    student.house = getHouse(element.house);
  });
  buildList();
}

// Get names, firstname
function getFirstName(fullname) {
  let firstName = fullname.trim();
  // If fullname includes a " " (space), then the first name before space is firstname
  if (fullname.includes(" ")) {
    firstName = firstName.substring(0, firstName.indexOf(" "));
    firstName = firstName.substring(0, 1).toUpperCase() + firstName.substring(1).toLowerCase();
  } else {
    // if fullname is only one name, with no spaces
    firstName = firstName;
  }
  return firstName;
}

// Get names, lastname
function getLastName(fullname) {
  let lastName = fullname.trim();
  lastName = lastName.substring(lastName.lastIndexOf(" ") + 1);
  lastName = lastName.substring(0, 1).toUpperCase() + lastName.substring(1).toLowerCase();
  // If fullname contains -, make first character uppercase
  if (fullname.includes("-")) {
    let lastNames = lastName.split("-");
    lastNames[1] = lastNames[1].substring(0, 1).toUpperCase() + lastNames[1].substring(1).toLowerCase();
    lastName = lastNames.join("-");
  }
  return lastName;
}

// Get names, middlename
function getMidddelName(fullname) {
  let middleName = fullname.trim();
  middleName = middleName.split(" ");
  // If fullname includes " ", make no middle name
  if (fullname.includes(' "')) {
    middleName = "";
  } else if (middleName.length > 2) {
    // if fullname is longer than 2, make middlename
    middleName = middleName[1];
    middleName = middleName.substring(0, 1).toUpperCase() + middleName.substring(1).toLowerCase();
  } else {
    middleName = "";
  }
  return middleName;
}

// Get images
function getImage(firstName, lastName) {
  let image;
  // If lastname is patil,(there are two patil) then use both lastname and firstname
  //to get the image
  if (lastName === "Patil") {
    image = `./images/${lastName.toLowerCase()}_${firstName.toLowerCase()}.png`;
  } else if (firstName === "Leanne") {
    // else if the last name  is Leanne whos picture is missin
    // show no image avaliable picture
    image = "images/No_image_avalible.png";
  } else if (firstName === "Justin") {
    // If lastname is Justin, split the lastname and use the second lastname
    lastName = lastName.split("-");
    image = `./images/${lastName[1].toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
  } else {
    image = `./images/${lastName.toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
  }
  return image;
}

// Get nickname
function getNickName(fullname) {
  let nickName = fullname.trim();
  nickName = nickName.split(" ");
  // if fullname contains "", make second name the nickname
  if (fullname.includes(' "')) {
    nickName = nickName[1];
  } else {
    nickName = "";
  }
  return nickName;
}

// Get house
function getHouse(house) {
  house = house.trim();
  house = house.substring(0, 1).toUpperCase() + house.substring(1).toLowerCase();
  return house;
}

// Filtering
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "prefect") {
    filteredList = allStudents.filter(isPrefect);
  } else if (settings.filterBy === "squad") {
    filteredList = allStudents.filter(isSquad);
  } else if (settings.filterBy === "expelled") {
    filteredList = allStudents.filter(isExpelled);
  }
  return filteredList;
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function isSlytherin(student) {
  return student.house === "Slytherin";
}

function isPrefect(student) {
  return student.prefect === true;
}

function isSquad(student) {
  return student.squad === true;
}

function isExpelled(student) {
  return student.expelled === true;
}

// Sorting

function selectSorting(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //find "old" sotrBy element and remove .sortBy (byclass)
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}'`);
  oldElement.classList.remove("sort_by");

  //indicate active sort
  event.target.classList.add("sort_by");

  //Toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(nameA, nameB) {
    if (nameA[settings.sortBy] < nameB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);
}

// Displaying the list
function displayList(students) {
  // Clear the list
  document.querySelector("#students").innerHTML = "";

  // Build a new list
  students.forEach(displayStudent);

  function displayStudent(student) {
    // Create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);

    //Set clone data
    clone.querySelector("[data-field=image]").src = student.image;
    clone.querySelector("[data-field=firstname]").textContent = student.firstName;
    clone.querySelector("[data-field=lastname]").textContent = student.lastName;
    clone.querySelector("[data-field=house]").textContent = student.house;

    //Make clickable to see more details
    clone.querySelector("#studenttext").addEventListener("click", () => showDetails(student));
  }
  buildList();
}
