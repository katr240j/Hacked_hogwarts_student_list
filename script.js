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

//load json
function start() {
  console.log("DOM loaded");
  loadJSON();
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
