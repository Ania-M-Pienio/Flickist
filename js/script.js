const app = {};

app.recentAmount = 3; // app setting for how many recent will display on load
app.popularAmount = 4; // app setting for how many popular will display on load

app.list = []; // stores the media added to the list

app.getItemCardHtml = function(itemInfo) {
  /* receives itemInfo and constructs html */
  /* returns the constructed html */
}

app.displayMedia = function(medias, location) {
  /* receives medias and location */
  /* calls forEach on the medias to construct html */
        /* inside forEach,  calls app.getItemCardHtml and passes the individual */
  /* apends to display at Recently Added location */
}

app.getPopular = function() {
  /* makes an ajax call to API */
  /* retrieves popular media */
  /* passes medias and location of Popular Now to displayMedia */
      /* -----> the length of the array passed is determined by app.popularAmount */
}


app.getRecent = function () {
  /* checks if list has any medias in it */
  /* if it does: */
    /* retrieves the latest most recent added from app.list */
    /* passes the latest medias to displayMedia and location of the Recently Added */
    /* ----> the length of the array passed is determined by app.recentAmount */
}

app.getByKeyword = function(keyword) {
  /* receives keyword provided by user */
  
}

// get medi by keyword

// get media detail

app.init = function() {
  console.log(`app started`);
};

$(() => {
  app.init();
});
