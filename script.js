"use strict";

window.addEventListener("DOMContentLoaded", start);
//array for all students
let allStudents = [];

const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  image: "",
  house: "",
};

const settings = {
  filter: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

function start() {
  console.log("ready");

  loadJSON();
  //add event-listeners to filter and sort buttons
  registerButtons();
}

function registerButtons() {
  console.log("registered buttons");
  document.querySelectorAll("[data-action='filter']").forEach((button) => {
    button.addEventListener("click", selectFilter);
  });

  document.querySelectorAll("[data-action='sort']").forEach((button) => {
    button.addEventListener("click", selectSort);
  });
}

async function loadJSON() {
  console.log("load json");
  const response = await fetch("students.json");
  const jsonData = await response.json();
  prepareObjects(jsonData);
}
//prepare objects
// function prepareObjects(jsonData) {
//   console.log("JSONDATA", jsonData);
//   allStudents = jsonData.map(prepareObject);

//   //fixed so we filter and sort on the first load
//   buildList();
// }
//prepare objects
function prepareObjects(jsonData) {
  jsonData.forEach((elm) => {
    const student = Object.create(Student);

    student.firstName = getFirstName(elm.fullname);
    student.lastName = getLastName(elm.fullname);
    student.middleName = getMidddelName(elm.fullname);
    student.image = getImage(student.firstName, student.lastName);
    student.house = getHouse(elm.house);
  });
  allStudents.push(student);
  //fixed so we filter and sort on the first load
  buildList();
}

// get firstName from fullName
function getFirstName(fullname) {
  console.log("get first name");
  let firstName = fullname.trim();
  // If fullname includes a " " (space),
  //firstname is what comes before that first space
  if (fullname.includes(" ")) {
    firstName = firstName.substring(0, firstName.indexOf(" "));
    firstName = firstName.substring(0, 1).toUpperCase() + firstName.substring(1).toLowerCase();
  } else {
    // if fullname has  only one name - no space
    firstName = firstName;
  }
  return firstName;
}

// Get middlename from fullname
function getMidddelName(fullname) {
  let middleName = fullname.trim();
  middleName = middleName.split(" ");
  // If fullname includes " " (space), ignore that name and make middlename none
  if (fullname.includes(' "')) {
    middleName = "";
  } else if (middleName.length > 2) {
    // if fullname is longer than 2, make second name middlename
    middleName = middleName[1];
    middleName = middleName.substring(0, 1).toUpperCase() + middleName.substring(1).toLowerCase();
  } else {
    middleName = "";
  }
  return middleName;
}

// Get lastname from fullname
function getLastName(fullname) {
  let lastName = fullname.trim();
  lastName = lastName.substring(lastName.lastIndexOf(" ") + 1);
  lastName = lastName.substring(0, 1).toUpperCase() + lastName.substring(1).toLowerCase();
  // If fullname contains (-), make first character uppercase
  if (fullname.includes("-")) {
    let lastNames = lastName.split("-");
    lastNames[1] = lastNames[1].substring(0, 1).toUpperCase() + lastNames[1].substring(1).toLowerCase();
    lastName = lastNames.join("-");
  }
  return lastName;
}

// Get image
function getImage(firstName, lastName) {
  let image;
  // If the lastname is patil
  //use both lastname and firstname to get the image
  if (lastName === "Patil") {
    image = `./images/${lastName.toLowerCase()}_${firstName.toLowerCase()}.png`;
  } else if (firstName === "Leanne") {
    // If the lastname is Leanne,
    //show no image avalible from images
    image = "images/No_image_avalible.png";
  } else if (firstName === "Justin") {
    // If the lastname is Justin
    //split the lastname and use second the lastname
    lastName = lastName.split("-");
    image = `./images/${lastName[1].toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
  } else {
    image = `./images/${lastName.toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
  }
  return image;
}

// Get house
function getHouse(house) {
  house = house.trim();
  house = house.substring(0, 1).toUpperCase() + house.substring(1).toLowerCase();
  return house;
}
function selectFilter(event) {
  console.log("select filter");
  const filter = event.target.dataset.filter;
  console.log(`User selcted ${filter}`);
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

//sorts
function selectSort(event) {
  console.log("select sort");
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //find "old" sotrBy element and remove .sortBy
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");

  //indicate active sort
  event.target.classList.add("sortby");

  //toggle the direction!
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`User selcted ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;

  buildList();
}

function sortList(sortedList) {
  // let sortedList = allStudents;
  const direction = 1;
  if (settings.sortDir === "desc") {
    settings.direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);
  //hold this function inside, since we use sortBy that is the parameter of the function parent

  function sortByProperty(studentA, studentB) {
    console.log(`settings.sortBy is ${settings.sortBy}`);
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
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

function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}
function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  //Set clone data
  clone.querySelector("[data-field=image]").src = student.image;
  clone.querySelector("[data-field=firstname]").textContent = student.firstName;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;

  //   if (animal.star === true) {
  //     clone.querySelector("[data-field=star]").textContent = "⭐";
  //   } else {
  //     clone.querySelector("[data-field=star]").textContent = "☆";
  //   }

  //   clone.querySelector("[data-field=star]").addEventListener("click", clickStar);

  //   function clickStar() {
  //     if (animal.star === true) {
  //       animal.star = false;
  //     } else {
  //       animal.star = true;
  //     }
  //     buildList();
  //   }

  //   //winners
  //   clone.querySelector("[data-field=winner]").dataset.winner = animal.winner;
  //   clone.querySelector("[data-field=winner]").addEventListener("click", clickWinner);

  //   function clickWinner() {
  //     console.log("clickWinner", animal.winner);
  //     if (animal.winner === true) {
  //       animal.winner = false;
  //     } else {
  //       tryToMakeAWinner(animal);
  //     }
  //     buildList();
  //   }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
/* 
function tryToMakeAWinner(selectedAnimal) {
  console.log("try to make a winner", selectedAnimal);

  const winners = allAnimals.filter((animal) => animal.winner);
  console.log("winners", winners);

  const numerOfWinners = winners.length;

  //the other selected animals, shift - takes the first selected out
  const other = winners.filter((animal) => animal.type === selectedAnimal.type).shift();
  console.log("other", other);
  //if there is another of the same type
  //!== not equal to undefined
  if (other !== undefined) {
    console.log("There can be only one winner of each type!");
    removeOther(other);
  } else if (numerOfWinners >= 2) {
    console.log("There can only be two winners!");
    removeAorB(winners[0], winners[1]);
  } else {
    console.log("make a winner");
    makeWinner(selectedAnimal);
  }

  function removeOther(other) {
    //ask the user to ignore, or remove "other"
    document.querySelector("#remove_other").classList.remove("hide");
    document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_other #removeother").addEventListener("click", clickRemoveOther);

    //show name on button
    document.querySelector("#remove_other [data-field=otherWinner]").textContent = other.name;

    //if ignore - do nothing...
    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hide");
      document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_other #removeother").removeEventListener("click", clickRemoveOther);
    }
    //if remove other
    function clickRemoveOther() {
      removeWinner(other);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }
  }

  function removeAorB(winnerA, winnerB) {
    //ask the user to ignore, or remove A or B

    document.querySelector("#remove_aorb").classList.remove("hide");
    document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #removea").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_aorb #removeb").addEventListener("click", clickRemoveB);

    //show names on buttons
    document.querySelector("#remove_aorb [data-field=winnerA]").textContent = winnerA.name;
    document.querySelector("#remove_aorb [data-field=winnerB]").textContent = winnerB.name;

    //if ignore - do nothing...
    function closeDialog() {
      document.querySelector("#remove_aorb").classList.add("hide");
      document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_aorb #removea").removeEventListener("click", clickRemoveA);
      document.querySelector("#remove_aorb #removeb").removeEventListener("click", clickRemoveB);
    }

    function clickRemoveA() {
      // if removeA:
      removeWinner(winnerA);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }

    function clickRemoveB() {
      // else - if removeB
      removeWinner(winnerB);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }
  }
  function removeWinner(winnerAnimal) {
    winnerAnimal.winner = false;
  }

  function makeWinner(animal) {
    animal.winner = true;
  }

 */
