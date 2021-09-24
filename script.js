"use strict";

window.addEventListener("DOMContentLoaded", start);
//array for all students
let allStudents = [];

//when injecting myself I need to make a global variable of the hole list of students including me
let filterAllStudents = allStudents;

let Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  imageName: "",
  house: "",
  bloodStatus: "",
  expelled: false,
  prefect: false,
  squad: false,
};

const settings = {
  filter: "all",
  sortBy: "firstName",
  sortDir: "asc",
};
// Global variable for hacking the system
let hackingTheSystem = false;

function start() {
  console.log("ready");

  loadJSON();
  //add event-listeners to filter and sort buttons
  registerButtons();
  timeToHackTheSystem();
}

function registerButtons() {
  console.log("registered buttons");
  document.querySelectorAll("[data-action='filter']").forEach((button) => {
    button.addEventListener("click", selectFilter);
  });

  document.querySelectorAll("[data-action='sort']").forEach((button) => {
    button.addEventListener("click", selectSort);
  });
  document.querySelector("#search").addEventListener("input", searchStudent);
  document.querySelector(".hogwarts_logo").addEventListener("click", hackTheSystem);
}

//loading json
async function loadJSON() {
  const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
  const jsonData = await response.json();

  const responseBlood = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
  const jsonDataBlood = await responseBlood.json();

  prepareObjects(jsonData, jsonDataBlood);
}

//prepare objects
function prepareObjects(students, bloodStatus) {
  students.forEach((elm) => {
    const student = Object.create(Student);

    student.firstName = getFirstName(elm.fullname);
    student.lastName = getLastName(elm.fullname);
    student.middleName = getMidddelName(elm.fullname);
    student.imageName = getImage(student.firstName, student.lastName);
    student.house = getHouse(elm.house);

    student.bloodStatus = getBloodStatus(student.lastName, bloodStatus);
    allStudents.push(student);
  });

  //fixed so we filter and sort on the first load
  buildList();
}

// get firstName from fullName
function getFirstName(fullname) {
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
  console.log("get image");
  let imageName;
  // If the lastname is patil
  //use both lastname and firstname to get the image
  if (lastName === "Patil") {
    //./ will go into the root folder, same as html and js and css is saved in
    //and then into images folder
    imageName = `./img/${lastName.toLowerCase()}_${firstName.toLowerCase()}.png`;
  } else if (firstName === "Leanne") {
    // If the lastname is Leanne,
    //show no image avalible from images
    imageName = "./img/No_image_avalible.png";
  } else if (firstName === "Justin") {
    // If the lastname is Justin
    //split the lastname and use second the lastname
    lastName = lastName.split("-");
    imageName = `./img/${lastName[1].toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
  } else {
    imageName = `./img/${lastName.toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
  }
  return imageName;
}

// Get house
function getHouse(house) {
  house = house.trim();
  house = house.substring(0, 1).toUpperCase() + house.substring(1).toLowerCase();
  return house;
}
// Get nickname from fullname
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
// Get bloodstatus
function getBloodStatus(lastName, bloodStatus) {
  // if the last name is on the half Blood list
  if (bloodStatus.half.includes(lastName)) {
    bloodStatus = "Half Blood";
    //if the last name is on the pure Blood list
  } else if (bloodStatus.pure.includes(lastName)) {
    bloodStatus = "Pure Blood";
    // if the last name is on both lists then it is muggle born
  } else {
    bloodStatus = "Muggle Born";
  }
  return bloodStatus;
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
    filteredList = filterAllStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = filterAllStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "slytherin") {
    filteredList = filterAllStudents.filter(isSlytherin);
  } else if (settings.filterBy === "expelled") {
    filteredList = allStudents.filter(isExpelled);
  } else if (settings.filterBy === "prefect") {
    filteredList = filterAllStudents.filter(isPrefect);
  } else if (settings.filterBy === "squad") {
    filteredList = filterAllStudents.filter(isSquad);
  } else if (settings.filterBy === "Pure_blood") {
    filteredList = filterAllStudents.filter(isPureBlood);
  } else if (settings.filterBy === "Half_blood") {
    filteredList = filterAllStudents.filter(isHalfBlood);
  } else if (settings.filterBy === "Muggle_born") {
    filteredList = filterAllStudents.filter(isMuggleBorn);
  }

  return filteredList;
}
function isPureBlood(student) {
  return student.bloodStatus === "Pure Blood";
}

function isHalfBlood(student) {
  return student.bloodStatus === "Half Blood";
}
function isMuggleBorn(student) {
  return student.bloodStatus === "Muggle Born";
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
function isExpelled(student) {
  console.log("is expelled");

  return student.expelled === true;
}

function isSquad(student) {
  return student.squad === true;
}

//sorts
function selectSort(event) {
  console.log("select sort");
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //find "old" sotrBy element and remove .sortBy
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("bysort");

  //indicate active sort
  event.target.classList.add("bysort");

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

//got help from my brother
// search
function searchStudent() {
  let search = document.querySelector("#search").value.toLowerCase();
  const searchResult = allStudents.filter((student) => {
    return student.firstName.toString().toLowerCase().includes(search) || student.middleName.toString().toLowerCase().includes(search) || student.lastName.toString().toLowerCase().includes(search);
  });

  displayList(searchResult);
}

function buildList() {
  const currentList = filterList(allStudents.filter((student) => student.expelled === false));
  const sortedList = sortList(currentList);
  displayList(sortedList);
}

function displayList(students) {
  console.log("display list");
  // clear the list
  document.querySelector("#students").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);

  // Show number of currentlystudents
  const numberStudents = allStudents.length;
  document.querySelector(".number_of_students").textContent = ` ${numberStudents}`;

  // Show number of currentlystudents
  const numberCurrent = students.length;
  document.querySelector(".number_of_current_students").textContent = ` ${numberCurrent}`;

  // show number of expelled students
  const numberExpelled = allStudents.filter((student) => student.expelled === true).length;
  document.querySelector(".number_expelled").textContent = ` ${numberExpelled}`;

  //show number of not expelled students
  let numberOfNotExpelled = numberStudents - numberExpelled;
  document.querySelector(".number_not_expelled").textContent = ` ${numberOfNotExpelled}`;

  //number of each house
  const numberGryffindor = allStudents.filter((student) => student.house === "Gryffindor").length;
  document.querySelector(".number_gryffindor").textContent = ` ${numberGryffindor}`;

  const numberHuffelpuff = allStudents.filter((student) => student.house === "Hufflepuff").length;
  document.querySelector(".number_huffelpuff").textContent = ` ${numberHuffelpuff}`;

  const numberRavenclaw = allStudents.filter((student) => student.house === "Ravenclaw").length;
  document.querySelector(".number_ravenclaw").textContent = ` ${numberRavenclaw}`;

  const numberSlytherin = allStudents.filter((student) => student.house === "Slytherin").length;
  document.querySelector(".number_slytherin").textContent = ` ${numberSlytherin}`;
}
function displayStudent(student) {
  console.log("display students");
  // create clone
  const clone = document.querySelector("#right  #student").content.cloneNode(true);

  //Set clone data
  clone.querySelector("[data-field=imageName]").src = student.imageName;
  clone.querySelector("[data-field=firstname]").textContent = student.firstName;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;

  // Add eventlistener to squad
  clone.querySelector(".squad").addEventListener("click", clickSquad);

  // PREFECT
  // - - Add eventlistener to prefect
  clone.querySelector(".prefect").addEventListener("click", clickPrefect);

  // // Change textcontent if student is a prefect or not
  if (student.prefect === true) {
    clone.querySelector(".prefect").classList.remove("gray");
  } else if (student.squad === false) {
    clone.querySelector(".prefect").classList.add("gray");
  }

  //- - Toggle prefect true or false on click
  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakePrefect(student);
    }
    buildList();
  }
  // INQUISITORIAL SQUAD

  if (student.squad === true) {
    clone.querySelector(".squad").classList.remove("gray");
  } else if (student.squad === false) {
    clone.querySelector(".squad").classList.add("gray");
  }

  // - - Toggle squad true or false on click
  function clickSquad() {
    if (student.house === "Slytherin" || student.bloodStatus === "Pure Blood") {
      student.squad = !student.squad;
    } else {
      notBeSquad();
    }
    buildList();
  }

  // EXPELLED
  //  - - adding gray filter
  if (student.expelled === true) {
    clone.querySelector(".expell").classList.remove("gray");
    //remove buttons
    clone.querySelector(".criteria").classList.add("hide");
    clone.querySelector(".info_student").classList.add("gray");
    popup.classList.add("gray");
    // Remove prefect and squad status if a student gets expelled
    student.prefect = false;
    student.squad = false;
  } else if (student.expelled === false) {
    clone.querySelector(".expell").classList.add("gray");
  }

  // // Add eventlistener to expell
  clone.querySelector(".expell").addEventListener("click", clickExpell);

  // // Toggle expell true or false on click
  function clickExpell() {
    if (student.firstName === "Katrín") {
      student.expelled = false;
      cantExpell();
    } else {
      student.expelled = !student.expelled;
    }
    buildList();
  }

  //click to see details
  clone.querySelector("#text_student").addEventListener("click", () => showDetails(student));

  // append clone to list
  document.querySelector("#right #students").appendChild(clone);
}

function showDetails(student) {
  console.log("display deatails");
  const clone = document.querySelector("#information").cloneNode(true).content;
  popup.textContent = "";
  clone.querySelector("[data-field=imageName]").src = student.imageName;
  clone.querySelector("[data-field=firstname]").textContent = `Firstname: ${student.firstName}`;
  clone.querySelector("[data-field=middelname]").textContent = `Middelname: ${student.middleName}`;
  clone.querySelector("[data-field=nickname]").textContent = `Nickname: ${student.nickName}`;
  clone.querySelector("[data-field=lastname]").textContent = `Lastname: ${student.lastName}`;
  clone.querySelector("[data-field=bloodstatus]").textContent = `Blood status: ${student.bloodStatus}`;
  clone.querySelector("[data-field=house]").textContent = `House: ${student.house}`;

  // if student house is clicked then this happends
  if (student.house === "Gryffindor") {
    popup.style.background = " #ecdfc5";
    clone.querySelector(".house_crest").style.backgroundImage = "url('./styling_img/gryffindor_crest.png')";
  } else if (student.house === "Hufflepuff") {
    popup.style.background = " #ecdfc5";
    clone.querySelector(".house_crest").style.backgroundImage = "url('./styling_img/hufflepuff_crest.png')";
  } else if (student.house === "Slytherin") {
    popup.style.background = " #ecdfc5";
    clone.querySelector(".house_crest").style.backgroundImage = "url('./styling_img/slytherin_crest.png')";
  } else {
    popup.style.background = " #ecdfc5";
    clone.querySelector(".house_crest").style.backgroundImage = "url('./styling_img/ravenclaw_crest.png')";
  }
  //extra text info
  if (student.squad === true) {
    clone.querySelector("[data-field=squad]").textContent = `A member of the Inquisitorial squad`;
  } else {
    clone.querySelector("[data-field=squad]").textContent = `Is Not a memeber of the Inquisitorial squad`;
  }
  if (student.prefect === true) {
    clone.querySelector("[data-field=prefect]").textContent = `Is Prefected`;
  } else {
    clone.querySelector("[data-field=prefect]").textContent = `Is Not Prefected`;
  }
  if (student.expell === true) {
    clone.querySelector("[data-field=expell]").textContent = `Is Expelled`;
  } else {
    clone.querySelector("[data-field=expell]").textContent = `Is Not Expelled`;
  }

  popup.classList.add("active");
  blured.classList.add("active");
  document.querySelector("header").classList.add("blurr");
  clone.querySelector("#close").addEventListener("click", closeDetails);
  popup.appendChild(clone);
}

function tryToMakePrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);

  //Variable for other prefects from same house
  const other = prefects.filter((student) => student.house === selectedStudent.house);
  const numberOfPrefects = other.length;
  console.log("number of prefects", numberOfPrefects);

  //If there is two other students from the same house
  if (numberOfPrefects >= 2) {
    removeAorB(other[0], other[1]);
  } else {
    makePrefect(selectedStudent);
  }

  function removeAorB(prefectA, prefectB) {
    console.log(prefectA.firstName);
    console.log(prefectB.firstName);

    // Ask user to igore or remove
    document.querySelector("#remove_AorB").classList.remove("hide");
    document.querySelector("header").classList.add("blurr");
    document.querySelector("#remove_AorB .close_dialog").addEventListener("click", closeDialog);
    document.querySelector("#remove_AorB #removeA").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_AorB #removeB").addEventListener("click", clickRemoveB);

    // Show names on buttons
    document.querySelector("#remove_AorB [data-field=prefectA]").textContent = `${prefectA.firstName} ${prefectA.lastName}`;
    document.querySelector("#remove_AorB [data-field=prefectB]").textContent = `${prefectB.firstName} ${prefectB.lastName}`;

    // If ignore - do nothing
    function closeDialog() {
      document.querySelector("#remove_AorB").classList.add("hide");
      document.querySelector("header").classList.remove("blurr");
      document.querySelector("#remove_AorB .close_dialog").removeEventListener("click", closeDialog);
      document.querySelector("#remove_AorB #removeA").removeEventListener("click", clickRemoveA);
      document.querySelector("#remove_AorB #removeB").removeEventListener("click", clickRemoveB);
    }

    // If remove a
    function clickRemoveA() {
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }

    // If remove b
    function clickRemoveB() {
      removePrefect(prefectB);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }

  function removePrefect(studentPrefect) {
    studentPrefect.prefect = false;
  }

  function makePrefect(student) {
    student.prefect = true;
  }
}

function notBeSquad() {
  // Show modal
  console.log("show modal squad");

  document.querySelector("header").classList.add("blurr");
  document.querySelector("#no_squad").classList.remove("hide");

  document.querySelector("#no_squad .close_dialog").addEventListener("click", closeDialog);

  // Close modal
  function closeDialog() {
    document.querySelector("#no_squad").classList.add("hide");
    document.querySelector("header").classList.remove("blurr");
    document.querySelector("#no_squad .close_dialog").removeEventListener("click", closeDialog);
  }
}
function closeDetails() {
  popup.classList.remove("active");
  blured.classList.remove("active");
  document.querySelector("header").classList.remove("blurr");
}

// Hacking the system

function timeToHackTheSystem() {
  setTimeout(() => {
    hackTheSystem();
    //10min = 600000
    //1min = 60000
  }, 60000);
}
function hackTheSystem() {
  hackingTheSystem = true;
  document.querySelector(".hogwarts_logo").removeEventListener("click", hackTheSystem);
  console.log("The system is hacked", hackingTheSystem);

  hackingTheStyling();

  injectMyself();

  hackedBloodStatus();

  hackedSquad();
}

function hackingTheStyling() {
  //changing the style of the header
  document.querySelector("header").classList.add("hacking_background_header");
  //changing the style of the page
  document.querySelector("#page").classList.add("hacking_background_page");
  //changing the logo
  document.querySelector(".hogwarts_logo").src = "styling_img/hogwarts_logo_yellow.png";
  //making the list purple as well
  document.querySelector(".header_back").style.opacity = 0.6;
  document.querySelector(".background_right").style.opacity = 0.6;
  //text color to yellow
  document.querySelector("#container").classList.add("hacking");
  document.querySelector(".title").style.color = "#ffe600";

  //filters
  document.querySelector(".filters p").style.color = "#ffe600";
  document.querySelector(".sort p").style.color = "#ffe600";
  //search
  document.querySelector("#search_btn").style.color = "#ffe600";
  document.querySelector("#search_btn").style.border = "1px solid #ffe600";
  document.querySelector("input").style.border = "1px solid #ffe600";
  //filter buttons
  document.querySelector("[data-filter='gryffindor']").style.color = "#ffe600";
  document.querySelector("[data-filter='hufflepuff']").style.color = "#ffe600";
  document.querySelector("[data-filter='ravenclaw']").style.color = "#ffe600";
  document.querySelector("[data-filter='slytherin']").style.color = "#ffe600";
  document.querySelector("[data-filter='squad']").style.color = "#ffe600";
  document.querySelector("[data-filter='expelled']").style.color = "#ffe600";
  document.querySelector("[data-filter='prefect']").style.color = "#ffe600";
  document.querySelector("[data-filter='Pure_blood']").style.color = "#ffe600";
  document.querySelector("[data-filter='Half_blood']").style.color = "#ffe600";
  document.querySelector("[data-filter='Muggle_born']").style.color = "#ffe600";
  document.querySelector("[data-filter='all']").style.color = "#ffe600";

  document.querySelector("[data-filter='gryffindor']").style.border = "1px solid #ffe600";
  document.querySelector("[data-filter='hufflepuff']").style.border = "1px solid #ffe600";
  document.querySelector("[data-filter='ravenclaw']").style.border = "1px solid #ffe600";
  document.querySelector("[data-filter='slytherin']").style.border = "1px solid #ffe600";
  document.querySelector("[data-filter='squad']").style.border = "1px solid #ffe600";
  document.querySelector("[data-filter='expelled']").style.border = "1px solid #ffe600";
  document.querySelector("[data-filter='prefect']").style.border = "1px solid #ffe600";
  document.querySelector("[data-filter='Pure_blood']").style.border = "1px solid #ffe600";
  document.querySelector("[data-filter='Half_blood']").style.border = "1px solid #ffe600";
  document.querySelector("[data-filter='Muggle_born']").style.border = "1px solid #ffe600";
  document.querySelector("[data-filter='all']").style.border = "1px solid #ffe600";
  //sort buttons
  document.querySelector("[data-sort='firstName']").style.color = "#ffe600";
  document.querySelector("[data-sort='firstName']").style.border = "1px solid #ffe600";
  document.querySelector("[data-sort='lastName']").style.color = "#ffe600";
  document.querySelector("[data-sort='lastName']").style.border = "1px solid #ffe600";

  //add glitch
  addGlitch();
}
function addGlitch() {
  document.querySelector("#glitchbox").classList.remove("hide");
  setTimeout(() => {
    stopGlitch();
  }, 3000);
}

function stopGlitch() {
  document.querySelector("#glitchbox").classList.add("hide");
}

function injectMyself() {
  console.log("inject Myself");
  const myInfo = {
    firstName: "Katrín",
    lastName: "Magnúsdóttir",
    middleName: "María",
    nickName: "Dobby",
    imageName: "./img/dobby.png",
    house: "Gryffindor",
    bloodStatus: "Muggle Born",
    expelled: false,
    prefect: false,
    squad: false,
  };
  allStudents.push(myInfo);
  buildList();
}

function cantExpell() {
  // Show modal
  document.querySelector("#no_expelled").classList.remove("hide");
  document.querySelector("#no_expelled .close_dialog").addEventListener("click", closeDialog);

  // Close modal
  function closeDialog() {
    document.querySelector("#no_expelled").classList.add("hide");
    document.querySelector("#no_expelled .close_dialog").removeEventListener("click", closeDialog);
  }
}

function hackedBloodStatus() {
  allStudents.forEach((student) => {
    let hackedBloodStudent = student.bloodStatus;
    // half- and muggle bloods will be listed as pure-blood.
    if (hackedBloodStudent === "Half Blood" || hackedBloodStudent === "Muggle Born") {
      hackedBloodStudent = "Pure-blood";
    } else {
      // Former pure-bloods will get completely random blood-status
      hackedBloodStudent = Math.floor(Math.random() * 2);
      if (student.bloodStatus == 0) {
        student.bloodStatus = "Pure Blood";
      } else if (student.bloodStatus == 1) {
        student.bloodStatus = "Muggle Born";
      } else {
        student.bloodStatus = "Half Blood";
      }
    }
  });
}
//the student needed to be in the squad before the hacking started, dosent get kicked out if put in after the hacking started
function hackedSquad() {
  console.log("Limited time on squad");
  allStudents.forEach((student) => {
    if (student.squad === true) {
      console.log("student is squad");
      setTimeout(() => {
        console.log("time out");
        student.squad = false;
        kickedOutOfSquad();
        buildList();
        //10 sec
      }, 10000);
    }
  });
}

function kickedOutOfSquad() {
  console.log("kicked out");
  // Show modal
  document.querySelector("#kicked_out").classList.remove("hide");
  document.querySelector("#kicked_out .close_dialog").addEventListener("click", closeDialog);

  // Close modal
  function closeDialog() {
    document.querySelector("#kicked_out").classList.add("hide");
    document.querySelector("#kicked_out .close_dialog").removeEventListener("click", closeDialog);
  }
}
