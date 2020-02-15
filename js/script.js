const app = {};

app.recentAmount = 3; // app setting for how many recent will display on load
app.popularAmount = 4; // app setting for how many popular will display on load
app.resultsAmount = 20;
app.listCap = 20;

app.list = []; // stores the media added to the list

app.getItemCardHtml = function(item) {
  /* receives item and constructs html */
  /* returns the constructed html */
};

app.getListItemtHtml = function(item) {
  /* recieves item title and constructs html */
  /* returns the constructed html */
};

app.displayMedia = function(medias, location, getHtml) {
  /* receives medias items, location and htmlconstructor function */
  /* calls forEach on the medias to construct html */
  /* inside forEach,  calls the given getHtml and passes the individual media item */
  /* apends to display at given location */
};

app.getPopular = function() {
  /* makes an ajax call to API */
  /* retrieves popular media */
  /* passes medias and location of Popular Now to displayMedia */
  /* -----> the length of the array passed is determined by app.popularAmount */
};

app.getRecent = function() {
  /* checks if list has any medias in it */
  /* if it does: */
    /* retrieves the latest most recent added from app.list */
    /* passes the retrieved medias to displayMedia with location of the Recently Added, and the getItemCardHtml function (as the getHtml callback) */
    /* ----> the length of the array passed is determined by app.recentAmount */  
};

app.getByKeyword = function(keyword) {
  /* receives keyword provided by user */
  /* makes an AJAX call based on the keyword */
  /* passes the returned medias to displayMedia along with the location of Results, and the getItemCardHtml function (as the getHtml callback) */
  /* ---> the length of the array passed is determined by app.resultsAmount */
};

app.getDetailById = function(id, type) {
  /* receives the id and type of the media */
  /* make an appropriate AJAX call */
  /*  ---> end point is specified by type */
};

app.addToList = function(media) {
  /* receives a media */
  /* checks if there is space in the app.list array */
  /* if there is: */
    /* pushes the media to the app.list array */
    /* passes the app.list to displayMedia along with the location of Watch List, and the getListItemHtml funtion (as the getHtml callback)  */
  /* if there is not: */
    /* warning full */
}


app.init = function() {
  /* calls getPopular */
  /* calls getRecent */
  /* calls Handlers  */
};

$(() => {
  app.init();
});
