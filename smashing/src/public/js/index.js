// insert a single instance / keyboard smashing object into the DOM as
// a div with a single paragraph for each field, smashingText, length,
// and sentiment:
// <div class="smashingResult">
//   <p>smashingText: aabbcc</p>
//   <p>length: 6</p>
//   <p>sentiment: 0.2245156334138958</p>
//   <p>date: 2018-12-04</p>
// </div>
// the parameter, smashing, represents a single keyboard smashing
// object (so it contains smashingText, length, etc.):
// {smashintText: 'aabb', length: 4}
function insertSmashing(smashing) {
  // here's a new div to drop the some data into...
  const newDiv = document.createElement("div");
  newDiv.classList.add("smashingResult");

  // insert data about a single smashing instance into the DOM
  //
  // * add paragraphs to the newDiv created above for every field in the 
  //   smashing object
  // * add newDiv to the result div that's already in the DOM (it's one 
  //   with id="results")

  const fields = ['smashingText', 'length', 'sentiment', 'date'];
  for (const field of fields) {
    const p = document.createElement('p');
    p.textContent = `${field} ${smashing[field]}`;
    newDiv.appendChild(p);
  }

  const resultsDiv = document.querySelector('#results');
  resultsDiv.appendChild(newDiv);
}

function deleteAllResults() {
  // clear out the smashing data instances that are currently displayed
  //
  // * remove every inner div within the results div... (the results div 
  //   is the one with id="results")
  // * if it's useful, note that the child elements of the result div 
  //   all have a class="smashingResult"

  const divs = document.querySelectorAll('.smashingResult');
  for (const div of divs) {
    div.parentNode.removeChild(div);
  }
}

// updates the list of keyboard smashings displayed on the page by
// retrieving data from the server (via the api endpoints) with the 
// appropriate query string parameters as specified by form inputs
function refreshResults() {
  // retrieve filtered smashing data from the api and display results
  //
  // * get rid of the existing results (if there are any) on the page so 
  //   that we can show the new updated results (there's a helper function
  //   declared above that can be called to do this... as long as you've
  //   already implemented it)
    deleteAllResults();
  // * construct a query string by pulling values from every form field in
  //   this filter form (you can get every form field individually or use 
  //   some combination of higher order functions over all of the inputs)
    const inputs = document.querySelectorAll('#filtering input[type="text"], #filtering input[type="number"]');
    const qs = Array.prototype.filter.call(inputs, el => el.value.length > 0).map(el => `${el.name}=${el.value}`).join('&');

  // * make a GET request to /api/smashings with the query string attached
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/smashings?' + qs);
    xhr.addEventListener('load', function(){
      if(xhr.status >= 200 && xhr.status < 400) {
      // * parse the resulting response
      
        const smashings = JSON.parse(xhr.responseText);
      // * go over every smashing in the result and add it to the dom (there's
      //   a helper function above that will do this for you if you finish the 
      //   implementation)
        for (const s of smashings) {
          insertSmashing(s);
        }
      }
    });
    xhr.send();
}

function postSmashing() {
  // save the string entered into the textarea form input by making a POST
  // request to the appropriate API end point
  const xhr = new XMLHttpRequest();

  // * retrieve the value of the textarea
  const input = document.querySelector('#userInput textarea[name="smashingText"]').value;

  // * use a POST request to the api url, /api/smashing:
  xhr.open('POST', '/api/smashing', true);
  //   * its body should contain the smashing data typed in by the user <------ IDK WHAT THAT MEANS
  //   * the ContentType should be application/x-www-form-urlencoded
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
  xhr.send(`smashingText=${input}`);

  refreshResults();

  // * it should update the page with the newly saved data ONLY AFTER A
  //   RESPONSE is received (note that one of the functions that you 
  //   implemented may help with this part)

}

function main() {
  // set up event handlers, show all smashings from database
  //
  // * get all of the keyboard smashings and display them immediately once 
  //   this page loads (there's a function that already does this for you
  //   defined above - assuming that you've finished the implementation)
  refreshResults();
  // * add an event handler so that the pressing the button on the filter
  //   form will get the keyboard smashings filtered based on the form inputs 
  //   and display the smashings in the DOM (again there's a function above 
  //   that already does this for you - assuming you've implemented it 
  //   correctly)
  const filterBtn = document.querySelector('#filtering input[type="submit"]');
  filterBtn.addEventListener('click', function(e){
    e.preventDefault();
    refreshResults();
  });
  // * add an event handler to the send user data form so that when the
  //   button is pressed, a new keyboard smashing is aved to the database
  //   (use one of the functions that you've finished above to do this) 
  const addBtn = document.querySelector('#userInput input[type="submit"]');
  addBtn.addEventListener('click', function(e) {
        e.preventDefault();
        postSmashing();
  });
}

document.addEventListener("DOMContentLoaded", main);
