const app = {};

app.recentAmount = 3; // app setting for how many recent will display on load
app.popularAmount = 4; // app setting for how many popular will display on load
app.resultsAmount = 20;
app.listCap = 20;

app.list = []; // stores the media added to the list

/* ----------------------------------------------------------------------*/
/* ------                      HTML COMPONENTS                      -----*/
/* ----------------------------------------------------------------------*/

app.getItemCardHtml = function(item) {
  /* receives item and constructs item card html */
  /* returns the constructed html */
};

app.getListItemtHtml = function(item) {
  /* recieves item and constructs a list item html */
  /* returns the constructed html */
};

app.getItemDetailCard = function(item) {
  /* recieves item and constructs a detail card html */
  /* returns the constructed html */
};

/* ----------------------------------------------------------------------*/
/* ------                       DISPLAYS                            -----*/
/* ----------------------------------------------------------------------*/

app.displayMedia = function(medias, location, getHtml) {
  /* receives medias items, location and an getHtml function */
  /* clears out the current location */
  /* calls forEach on the medias to construct html */
  /* inside forEach,  calls the given getHtml function and passes the individual media item */
  /* apends to given location */
};

/* ----------------------------------------------------------------------*/
/* ------                       GETTERS                             -----*/
/* ----------------------------------------------------------------------*/

app.getPopular = function() {
  /* makes an AJAX call to API */
  /* retrieves popular media */
  /* passes medias and location of Popular Now to displayMedia */
  /* -----> the length of the array passed is determined by app.popularAmount */
};

app.getRecent = function() {
  /* checks if list has any medias in it */
  /* if it does: */
  /* retrieves the latest most recent added from app.list */
  /* passes the retrieved medias to displayMedia, algon with location of the Recently Added, and the getItemCardHtml function (as the getHtml callback) */
  /* ----> the length of the array passed is determined by app.recentAmount */
};

app.getByKeyword = function(keyword) {
  /* receives keyword provided by user */
  /* makes an AJAX call based on the keyword */
  /* passes the returned medias to displayMedia along with the location of Results, and the getItemCardHtml function (as the getHtml callback) */
  /* ---> the length of the array passed is determined by app.resultsAmount */
};

app.getDetailsById = function(id, type) {
  /* receives the id and type of the media */
  /* make an appropriate AJAX call */
  /*  ---> end point is specified by type */
  /* declares an empty array
  /* pushes the result media to the newly created array as the first (and only) index */
  /* passes the new array to displayMedia, along with the location of Details, and the getItemDetailCardHtml functions (as the getHtml callback) */
};

app.addToList = function(media) {
  /* receives a media */
  /* checks if there is space in the app.list array for another media */
  /* if there is: */
  /* checks that the media is not already in the list by calling app.checkListById and passing it the media's id */
  /* if it is not already there: */
  /* pushes the media to the app.list array */
  /* passes the app.list to displayMedia along with the location of Watch List, and the getListItemHtml funtion (as the getHtml callback)  */
  /* if it is already there: */
  /* warning already existins */
  /* if there is no room: */
  /* warning no room */
};

app.checkListById = function(id) {
  /* receives a media id */
  /* declares a variable for index (default -1)
  /* runs a forEach on  app.list to check if the received id is stored  */
  /* when a match - updates index variable for current index */
  /* returns index (stays negative value if not found) */
};

app.removeFromList = function(id) {
  /* receives a media id */
  /* calls app.checListById to see if that media is even in the list and passed it the id *\
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

app.handlers = function() {
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
  /*    calls addtoList and passes the media object
  /* ---------------------------------------*/
  /* [6] On click any REMOVE from list icon ( requires event delegation) 
  /*    takes the id from the object that was clicked ($this)
  /*    calls removeFromList and passes the id to be removed
  /* ---------------------------------------*/

};

app.init = function() {
  /* calls getPopular */
  /* calls getRecent */
  /* calls Handlers  */
};

$(() => {
  app.init();
});
