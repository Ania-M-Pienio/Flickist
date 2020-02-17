const app = {};
//-------- API ---------------------------------------------------------- //
app.api = {};
app.api.baseUrl   = `https://api.themoviedb.org/3`;
app.api.key       = `9b08417459f02bab4f2533c48a22feab`;
app.api.lang      = `en-US`;
//-------- SETTINGS ------------------------------------------------------//
app.recentAmount  = 3;  // app setting for how many recent will display on load
app.popularAmount = 4;  // app setting for how many popular will display on load
app.resultsAmount = 20; // app setting for how many results to show
app.listAmount    = 20; // app setting for how many can be be stored in the list
// ------- DOM ---------------------------------------------------------- //
app.dom = {};
app.dom.$recent   = ``;
app.dom.$popular  = ``;
app.dom.$list     = ``;
app.dom.$detail   = ``;
app.dom.$add      = ``;
app.dom.$remove   = ``;
// ------ DATA ----------------------------------------------------------//
app.list = [];  // stores the media added to the list
app.detail;     // stores the media shown in the details view


/* ----------------------------------------------------------------------*/
/* ------                      HTML COMPONENTS                      -----*/
/* ----------------------------------------------------------------------*/

app.getItemCardHtml = function(item) {
  return `
    <li> 
      <h3>${item.title ? item.title : item.name}</h3>
      <p> ${item.media_type}</p> 
    </li>
  `;
  /* receives item and constructs item card html */
  /* returns the constructed html */
};

app.getListItemtHtml = function(item) {
  /* recieves item and constructs a list item html */
  /* returns the constructed html */
};

app.getItemDetailCard = function(item) {
  return `
  <div> 
    <h2> ${item.title ? item.title : item.name} </h2>
    <p> ${item.overview}</p>
  </div>
  `;
};

/* ----------------------------------------------------------------------*/
/* ------                       DISPLAYS                            -----*/
/* ----------------------------------------------------------------------*/

app.displayMedia = function(medias, $location, getHtml /* <- callback*/) {
  $location.html(``);
  medias.forEach(item => {
    let htmlToAppend = getHtml(item);
    $location.append(htmlToAppend);
  });

  /* receives medias items, location and an getHtml function */
  /* clears out the given location */
  /* calls forEach on the given medias */
  /* --inside forEach
  /*    calls the given getHtml function (passes the individual media item) */
  /*    receives the constructed Html
  /*    apends the Html to given location */
};

/* ----------------------------------------------------------------------*/
/* ------                       GETTERS                             -----*/
/* ----------------------------------------------------------------------*/

app.getPopularByType = function(type) {
  const url = `${app.api.baseUrl}/${type}/popular`;
  $.ajax({
    url: url,
    method: `GET`,
    dataType: `json`,
    data: {
      api_key: app.api.key,
      language: app.api.lang
    }
  }).then(data => {
    // app.getRecent(data.results); // for testing
    const shortData = data.results.slice(0, app.popularAmount); // first x amount as specified in settings
    app.displayMedia(shortData, $(`.tester.${type}`), app.getItemCardHtml);
  });
  /* makes an AJAX call to API */
  /* retrieves popular movies/tv */
  /*  passes medias to displayMedia, along with location(based on type), and the getItemCardHtml function (as the getHtml callback)  */
  /* -----> the length of the array passed is determined by app.popularAmount */
};

app.getRecent = function(list) {
  let amountToTake = app.recentAmount;
  const shortData = _.takeRightWhile(list, () => {
    return amountToTake--; // stops taking when hits 0 or nothing left to take
  });
  if (shortData.length) {
    app.displayMedia(shortData.reverse(), $(`.tester`), app.getItemCardHtml);
  }
  /* retrieves the latest most recent added from app.list */
  /* amount retrieved is specifie by app.recentAmount or whatever is available (if short of recentAmount) */
  /* passes the retrieved medias to displayMedia, algon with location of the Recently Added, and the getItemCardHtml function (as the getHtml callback) */
};

app.getByKeyword = function(keyword) {
  const url = `${app.api.baseUrl}/search/multi`;
  $.ajax({
    url: url,
    method: `GET`,
    dataType: `json`,
    data: {
      api_key: app.api.key,
      languague: app.api.lang,
      query: keyword
    }
  }).then(data => {
    const shortData = data.results.slice(0, app.resultsAmount); // first x amount as specified in settings // first x amount as specified in settings
    app.displayMedia(shortData, $(`.tester`), app.getItemCardHtml);
  });
  /* receives keyword provided by user */
  /* creates an url from baseUrl and the end point */
  /* makes an AJAX call based on the keyword */
  /* passes the returned medias to displayMedia along with the location of Results, and the getItemCardHtml function (as the getHtml callback) */
  /* ---> the length of the array passed is determined by app.resultsAmount */
};

app.getDetailsById = function(id, type) {
  const url = `${app.api.baseUrl}/${type}/${id}`;
  /* receives the id and type of the media */
  $.ajax({
    url: url,
    method: `GET`,
    dataType: `json`,
    data: {
      api_key: app.api.key,
      languague: app.api.lang
    }
  }).then(data => {
    const media = [];
    media.push(data);
    app.displayMedia(media, $(`.tester`), app.getItemDetailCard);
  });
  /* receives 'id' and 'type' for the media to be retrieved */
  /* creates an url from baseUrl and the end point (interpolates id and type as the endpoint) */
  /* make an AJAX call */
  /* declares an empty array
  /* pushes the result media to the newly created array as the first index */
  /* passes the new array to displayMedia, along with the location of the Details Card, and the getItemDetailCardHtml function (as the getHtml callback) */
};

/* ---------------------------------------------------------------------------*/
/* ------                        UPDATERS &  HELPERS                     -----*/
/* ---------------------------------------------------------------------------*/



app.findById = function(id) { 
  return _.findIndex(app.list, item => item.id === id);
  /* receives a media id */
  /* runs a lodash findIndex to find index of the media with the given id */
  /* returns index (returns negative if not found) */
};

app.addToList = function(media) {
  /* receives a media */
  /* checks if there is space in the app.list array for another media (uses app.listAmount)*/
  /* if there is: */
  /* checks that the media is not already in the list by calling app.findById and passing it the media's id */
  /* if it is not already there: */
  /* pushes the media to the app.list array */
  /* passes the app.list to displayMedia along with the location of Watch List, and the getListItemHtml funtion (as the getHtml callback)  */
  /* if it is already there: */
  /* warning already existins */
  /* if there is no room: */
  /* warning no room */
};

app.removeFromList = function(id) {
  /* receives a media id */
  /* calls app.findById to see if that media is even in the list and passed it the id *\
  /* stores the returned index from app.checkListById */
  /* checks that returned index is 0 or greater */
  /* if it is: */
  /* splices out the media at the returned index for app.list
    /* passes the app.list to displayMedia along with the location of Watch List, and the getListItemHtml funtion (as the getHtml callback)  */
  /* if it is not: */
  /* it warns - not in list */
};

/* ----------------------------------------------------------------------*/
/* ------                       HANDLERS                            -----*/
/* ----------------------------------------------------------------------*/

app.Handlers = function() {
  /* ---------------------------------------*/
  /* [1] On click Search Button */
  /*    extracts keyword from search input */
  /*    passes the keyword to getByKeword */
  /* ---------------------------------------*/
  /* [2] On click Home Icon
  /*    calls getPopular */
  /*    calls getRecent */
  /*    switches page to home */
  /* ---------------------------------------*/
  /* [3] On click any Madia Card (requires event delegation)
  /*    takes the media type and id from the object that was clicked ($this)
  /*    calls getDetailsById and passes the type and id
  /* ---------------------------------------*/
  /* [4] On click to VIEW any List Item (requires event delegation)
  /*    takes the media type and id from the object that was clicked ($this)
  /*    calls getDetailsById and passes the type and id
  /* ---------------------------------------*/
  /* [5] On click any ADD to list icon ( requires even delegation) 
  /*    constructs media object form the one that was clicked $(this) 
  /*    ------> id (for future Details Card), title (for list), image(for the list avatar) */
  /*    calls app.addtoList and passes the media object
  /* ---------------------------------------*/
  /* [6] On click any REMOVE from list icon ( requires event delegation) 
  /*    takes the id from the object that was clicked ($this)
  /*    calls app.removeFromList and passes the id to be removed
  /* ---------------------------------------*/
};

app.init = function() {
  // app.getByKeyword(`marvel`);
  // app.getDetailsById(`68716`, `tv`);
  // app.getPopularByType(`movie`);
  /* calls getPopularByType  for movies */
  /* calls getRecentByType for tv */
  /* calls to set up app.Handlers  */
};

$(() => {
  app.init();
});
