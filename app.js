//this is version 8/Final 3 of moody-kitten
//need to add feature that functionality persists through page refresh

/*PROGRAM FEATURES
1. When user presses Get Started Button the list of available kittens with their current state is shown.
The Add Kitten textbox and button are enabled.
2. User can add a new kitten. 
2.1 Version 8 adds a sort function in ascending order when kittens are added.
3. User can delete a kitten.
4. User can begin playing with a kitten. The rest of the kittens disappear. The mode and tolerance level shown is from the value of local storage. 
5. The pet button increments or decrements affection level +/- 1 for each push. 
6. Upon clicking the  catnip/reset button affection level is reset to "5" and the mood is reset to tolerant.
7. On a page refresh the moods and tolerance levels are not changed.
8. The Start Over button shows the list of all cats and their current moods/affection levels which are stored in local storage.
9. When affection level drops to 0 the pet and catnip/reset buttons disappear. Only the Start Over button shows.
*/


document.getElementById('btn-add-kitten') //disable Add Kitten textbox until press Get Started button
  .disabled = true;
document.getElementById('input-add-kitten') //disable Add Kitten button until press Get Started button
  .disabled = true;



console.log("Page Refresh");

//initialize variables for kittens
let affectionCount = undefined;
let mood = '';
let cssMoodStyle = '';










let kittens = [];  //kittens array



let kittenToPlay = ''; //holds form page code for kitten play form




//adds kitten to kittens array
function addKitten(event) {

  event.preventDefault();

  let form = event.target; //ties code in this method to the html 

  console.log('Made it here');



  let kName = form.kittenName.value; //takes name out of Add Kitten textbox
  console.log(`The name of the kitten is ${kName}`);


  let imageUrl = getKittenUrl(kName); //calls method that returns Url for a robohash cat image with 
  //the name given here.

  console.log(imageUrl);

  loadKittens(); //method that loads the kittens array


  //create a kitten object and assigns values to it
  let kitten =
  {
    id: generateId(),
    name: kName,
    image: imageUrl,
    mood: 'TOLERANT',
    affection: 5

  }

  kittens.push(kitten); //pushes the kitten onto the kitten array like a stack
  saveKittens(); //save kittens to local storage
  sortKittens();//get kittens from local storage, sort in ascending order, resave
  drawKittens(); //show the list of available kittens

  document.getElementById("input-add-kitten").value = ""; //clears textbox of kitten name that was entered

}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {


  //save kittens to local storage
  window.localStorage.setItem("kittens", JSON.stringify(kittens));

}

//sort kittens in ascending order
function sortKittens() {
  loadKittens();

  //sort kittens in ascending order by name
  //list.sort((a, b) => (a.color > b.color) ? 1 : -1)
  let sortedKittens = kittens.sort((a, b) => (a.name > b.name) ? 1 : -1);



  //console.log(kittens.map(kitten =>kitten.name));

  saveKittens();

}

//delete kitten from list
function deleteKitten(kittenID) {
  loadKittens();

  //filter keeps all kittens except the one that is to be deleted
  kittens = kittens.filter(kitten => kitten.id !== kittenID);


  saveKittens();


  //if there are kittens produce the list of kittens
  if (kittens.length !== 0) {
    drawKittens();
  }
  else {
    document.getElementById("kittens-list").innerHTML = null; //if no there are no kittens
  }


}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {


  let storedKittens = JSON.parse(window.localStorage.getItem("kittens"));

  if (storedKittens !== null) {
    kittens = storedKittens;
  }

}
//show the list of available kittens
function drawKittens() {

  loadKittens();

  let kittenListElement = document.getElementById('kittens-list');

  let kittenList = '';

  //show form of all kittens available to play with
  kittenList = kittens.map(kitten =>

    `
      <fieldset class = "fieldset-kittens">
        <div>
          <p>${kitten.name}</p>
          <img class = "img-kitten" src='${kitten.image}'>
          <span>
            <button class = "btn-play" onclick="getKittenToPlay('${kitten.id}')">Play with ${kitten.name}!
            </button>
          </span>
        </div>
        <hr/>
        <div class="delete-button">
          <label class = "label-delete">Throw <span>${kitten.name}</span> in the trash</label>
          <button class = "btn-delete-kitten" onclick = "deleteKitten('${kitten.id}')">
            <span>
              <img  class = "img-cat-trash" src = "cat_trash_can_crop.jpg">
            </span>
          </button>
        </div>
      </fieldset>
      `
  ).reduce((x, y) => x + y);

  kittenListElement.innerHTML = kittenList;

}

//creates form for the kitten chosen to play with
function getKittenToPlay(kittenID) {
  loadKittens();

  let kittenPlayer = kittens.filter(kitten => kitten.id === kittenID)

  kittenToPlay =
    `
    <fieldset class = "fieldset-kittens">
      <div>
        <p>${kittenPlayer[0].name}</p>
        <img  class = "img-kitten ${kittenPlayer[0].mood}" src='${kittenPlayer[0].image}'/>
      </div>
      <div>
        <label>Current Affection Level </label>
          <input id = "text-affection" class = "text-affection" type="text"/>
      </div>
      <div>
        <label>Current Mood</label>
        <input id = "text-mood" class = "text-mood" type = "text">
      </div>
      <hr/>
      <div>
        <button id= "btn-pet" class = "btn-pet-kitten" onclick = "pet('${kittenPlayer[0].id}')">
          <span>Pet the Kitten</span>
        </button>
      </div>
      <hr/>
      <div>
        <button id ="btn-catnip" class = "btn-pet-kitten" onclick = "catnip('${kittenPlayer[0].id}')">
          <span>Give the Kitten Some Catnip OR Reset Mood/Affection to Defaults</span>
        </button>
      </div>
      <hr/>
      <div>
        <button class = "btn-pet-kitten" onclick = "startOver()">
          <span>View the List of Kittens</span>
        </button>
      </div>
      
    </fieldset>
    `
  document.getElementById("kittens-list").innerHTML = kittenToPlay;

  document.getElementById("kittens-list").hidden = false;

  document.getElementById("text-mood").value = kittenPlayer[0].mood;

  document.getElementById("text-affection").value = kittenPlayer[0].affection;




}/*pet function on button click calls the random number generator which produces either 1 or -1. This is added to affectionCount which is posted. A switch is used to assign the correct mood to the affectionCount
*/

function pet(kittenID) {

  loadKittens();

  //select kitten to play with by id
  let kittenPlayer = kittens.filter(kitten => kitten.id === kittenID);

  //assign current values for affectionCount and mood to the kitten's mood from local storage
  affectionCount = kittenPlayer[0].affection;
  mood = kittenPlayer[0].mood;



  let oneOrNegOne = randomNumGenerator1orNeg1();

  affectionCount += oneOrNegOne;


  affection = '';


  switch (true) {
    case affectionCount > 6:
      mood = 'HAPPY';
      cssMoodStyle = 'HAPPY';
      break;
    case affectionCount >= 4:
      mood = 'TOLERANT';
      cssMoodStyle = 'TOLERANT';
      break;
    case affectionCount > 0:
      mood = 'ANGRY';
      cssMoodStyle = 'ANGRY'
      break;
    case affectionCount <= 0:
      mood = `${kittenPlayer[0].name.toUpperCase()} RAN AWAY! QUIT OR START OVER.`
      cssMoodStyle = 'GONE';
      document.getElementById("btn-pet").hidden = true;
      document.getElementById("btn-catnip").hidden = true;
      break;

  }

  kittenPlayer[0].mood = cssMoodStyle;



  document.getElementById('text-mood').value = mood;
  document.getElementById('text-affection').value = affectionCount;

  //call this method to update the kitten form for mood and affection
  updateKittenPlayer(kittenPlayer, mood, affectionCount);

  //save any changes to mood and affection to local storage
  updateKittens(kittenPlayer, mood, affectionCount);


}
//updates kitten form to current values for mood and affection
function updateKittenPlayer(kittenPlayer, mood, affectionCount) {
  console.log(`in updateKittenPlayer`);




  kittenToPlay =
    `
    <fieldset class = "fieldset-kittens">
      <div>
        <p>${kittenPlayer[0].name}</p>
        <img  class = "img-kitten ${kittenPlayer[0].mood}" src='${kittenPlayer[0].image}'/>
      </div>
      <div>
        <label>Current Affection Level </label>
          <input id = "text-affection" class = "text-affection" type="text"/>
      </div>
      <div>
        <label>Current Mood</label>
        <input id = "text-mood" class = "text-mood" type = "text">
      </div>
      <hr/>
      <div>
        <button id= "btn-pet" class = "btn-pet-kitten" onclick = "pet('${kittenPlayer[0].id}')">
          <span>Pet the Kitten</span>
        </button>
      </div>
      <hr/>
      <div>
        <button id ="btn-catnip"class = "btn-pet-kitten" onclick = "catnip('${kittenPlayer[0].id}')">
          <span>Give the Kitten Some Catnip OR Reset Mood/Affection to Defaults</span>
        </button>
      </div>
      <hr/>
      <div>
        <button class = "btn-pet-kitten" onclick = "startOver()">
          <span>View the List of Kittens</span>
        </button>
      </div>
      
    </fieldset>
    `


  document.getElementById("kittens-list").innerHTML = kittenToPlay;

  document.getElementById("text-mood").value = mood;

  document.getElementById("text-affection").value = affectionCount;

  if (affectionCount <= 0) {
    document.getElementById("btn-pet").hidden = true;
    document.getElementById("btn-catnip").hidden = true;

  }

  //console.log(kittenPlayer[0].id)



}


//this method finds the kitten that is playing and saves changes to mood and affection in local storage
function updateKittens(kittenPlayer, mood, affectionCount) {
  console.log(`Inside updateKittens`);
  console.log(kittenPlayer[0].id)


  let kittenToUpdate = kittens.filter(kitten => kitten.id === kittenPlayer[0].id);

  console.log(`kittenToUpdate[0].id is ${kittenToUpdate[0].id}`);

  /*
  kittens.forEach(kitten => {
    if (kitten.id === kittenToUpdate[0].id) {
      kitten.mood = kittenToUpdate[0].mood;
      kitten.affection = affectionCount;
    }
  });
  */
  //REPLACES forEach loop in program
  kittens.filter(kitten => kitten.id === kittenToUpdate[0].id).map(kitten => {
    kitten.id === kittenToUpdate[0].id;
    kitten.mood = kittenToUpdate[0].mood;
    kitten.affection = affectionCount;
  });

  saveKittens();

}


/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */

//This method is also used to reset a kitten's affection and mood to the default values
function catnip(kittenID) {

  loadKittens();

  console.log(`Inside catnip`)

  console.log(kittenID);


  let kittenPlayer = kittens.filter(kitten => kitten.id === kittenID);

  console.log(kittenPlayer[0].id)

  affectionCount = 5;

  kittenPlayer[0].affection = affectionCount;
  kittenPlayer[0].mood = "TOLERANT"


  //document.getElementById('text-affection').value = affectionCount;
  //document.getElementById('text-mood').value = mood;

  kittenToPlay =
    `
    <fieldset class = "fieldset-kittens">
      <div>
        <p>${kittenPlayer[0].name}</p>
        <img  class = "img-kitten ${kittenPlayer[0].mood}" src='${kittenPlayer[0].image}'/>
      </div>
      <div>
        <label>Current Affection Level </label>
          <input id = "text-affection" class = "text-affection" type="text"/>
      </div>
      <div>
        <label>Current Mood</label>
        <input id = "text-mood" class = "text-mood" type = "text">
      </div>
      <hr/>
      <div>
        <button id= "btn-pet" class = "btn-pet-kitten" onclick = "pet('${kittenPlayer[0].id}')">
          <span>Pet the Kitten</span>
        </button>
      </div>
      <hr/>
      <div>
        <button id ="btn-catnip" class = "btn-pet-kitten" onclick = "catnip('${kittenPlayer[0].id}')">
          <span>Give the Kitten Some Catnip OR Reset Mood/Affection to Defaults</span>
        </button>
      </div>
      <hr/>
      <div>
        <button class = "btn-pet-kitten" onclick = "startOver()">
          <span>View the List of Kittens</span>
        </button>
      </div>
      
    </fieldset>
    `

  document.getElementById("kittens-list").innerHTML = kittenToPlay;
  document.getElementById('text-affection').value = affectionCount;
  document.getElementById('text-mood').value = "TOLERANT"


  updateKittens(kittenPlayer, mood, affectionCount);

}


//button on main body of program that 
function getStarted() {

  document.getElementById("welcome").remove(); //removes form from screen shown when program is started or refreshed

  document.getElementById('btn-add-kitten') //add kitten button is initially disabled
    .disabled = false;
  document.getElementById('input-add-kitten') //input kitten textbox is initially disabled
    .disabled = false;

  loadKittens(); //load from local storage

  //if kittens exist show them
  if (kittens.length !== 0) {
    drawKittens();

  }
}

//show kitten list
function startOver() {

  if (kittens.length !== 0) {
    drawKittens();
  }

}

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );

}

//the method below splices in the name of the kitten to the Url on robohash that retrieves the picture
//of a cat
function getKittenUrl(kittenname) {

  console.log(`Made it to getKittenUrl`);

  let kittenUrl = `https://robohash.org/${kittenname}?set=set4`

  console.log(kittenUrl)

  return kittenUrl;
}

/*currently using a 40% chance up/60% chance down*/
function randomNumGenerator1orNeg1() {
  let generatedNumber = Math.random();
  console.log(generatedNumber);

  if (generatedNumber <= 0.4) {
    return 1;
  }
  else {
    return -1;
  }


}

