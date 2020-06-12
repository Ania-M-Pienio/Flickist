const app = {};
//-------- API ---------------------------------------------------------- //
app.api = {};
app.api.baseUrl = `https://api.themoviedb.org/3`;
app.api.key = `9b08417459f02bab4f2533c48a22feab`;
app.api.lang = `en-US`;
app.api.imgUrl = `https://image.tmdb.org/t/p/original`;
//-------- SETTINGS ------------------------------------------------------//
app.recentAmount = 5; // app setting for how many recent will display on load
app.popularAmount = 5; // app setting for how many popular will display on load
app.resultsAmount = 10; // app setting for how many results to show upon search
app.listAmount = 10; // app setting for max amount of medias that can be be stored in the list at any given time
// ------- DOM ---------------------------------------------------------- //
app.dom = {};
app.dom.$popular = {
  tv: $(`.topTvShows`), // location
  movie: $(`.topMovies`), // location
};
app.dom.$recent = $(`.recentlyAdded`); // location
app.dom.$result = $(`.resultsSearch`); // location
app.dom.$list = $(`.watchList`); // location
app.dom.$detail = $(`.detailsCard`); // location
app.dom.$add = $(`.add`); // button
app.dom.$remove = $(`.remove`); // button
app.dom.$SEARCH = $(`.resultsContainer`); // section for search results
app.dom.$HOME = $(`.home`); // section for home
app.dom.$DETAIL = $(`.backDropOverlay`);
app.dom.$DRAWER = $(`.listDrawer`);
// ------ DATA ----------------------------------------------------------//
app.results = []; // stores the results of a search
app.popular = {
  tv: [], // stores popular tv shows
  movie: [], // stores popular movies
};
app.list = []; // stores the media added to the list
app.detail = {}; // stores the media shown in the details view
app.keyword = ``; // stores users query
app.isOpen = false;

/* ----------------------------------------------------------------------*/
/* ------                      HTML COMPONENTS                      -----*/
/* ----------------------------------------------------------------------*/

app.getItemCardHtml = function (item) {
  const itemImgUrl = app.api.imgUrl + item.poster_path;
  return `
    <li 
      class="flexItem">
        <button 
          type="button" 
          class="infoBtn" 
          data-id="${item.id}"
          data-type="${item.media_type}"> 
            <i class="fas fa-info-circle fa-4x"></i> 
        </button>    
       
      ${
        app.findIndexById(app.list, item.id) >= 0
          ? `
          <button type="button" class="movieTvBtn remove" data-id="${item.id}">
              Remove
          </button>`
          : `<button type="button" class="movieTvBtn add" data-id="${item.id}">
                Add To List
            </button>`
      }
      <div 
        class="info imgContainer" 
        data-id="${item.id}" 
        data-type="${item.media_type}">
        <img 
          class="movieTvImg" 
          src="${itemImgUrl}" 
          alt="${item.title ? item.title : item.name} poster">
      </div>
    </li>
  `;
};

app.getListItemtHtml = function (item) {
  console.log(item);
  const backImgUrl =
    app.api.imgUrl +
    (item.backdrop_path ? item.backdrop_path : item.poster_path);
  return `
  <li class="listItem" style="background-image:url(${backImgUrl})"> 
    <div class="listItemBackWrapper">
        <button 
            type="button" 
            class="infoBtn" 
            data-id="${item.id}"
            data-type="${item.media_type}"> 
            <i class="fas fa-info-circle fa-4x"></i> 
        </button>  
        <button type="button" class="remove removeBtn" data-id="${
          item.id
        }">Remove</button> 
        <div class="info" data-id="${item.id}" data-type="${item.media_type}">
          <h3 class="addListItem"> ${item.title ? item.title : item.name}</h3>
        </div>
    </div>  
  </li>`;
};

app.getItemDetailHtml = function (item) {
  const itemImgUrl = app.api.imgUrl + item.poster_path;
  const typeIcon = item.title ? "fas fa-film" : "fas fa-tv";
  let runtime = "";
  let genres = "";
  const overview = item.overview ? item.overview : "Description Unavailable"
  const homepageURL = item.homepage ? item.homepage : "";
  const homepageLinkIcon = item.homepage 
    ? `<i class="fas fa-globe-asia"></i>`
    : "Not Available";
  try {
    runtime = item.runtime
      ? Math.floor(item.runtime / 60) + " hr " + (item.runtime % 60) + " min"
      : item.episode_run_time[0] + " min";
  } catch (error) {
    runtime = "Runtime Unknown";
  }

  try {
    item.genres.forEach((genre, index) => {
      genres += (index === 0 ? "" : ", ") + genre.name;
    });
  } catch (error) {
    genres = "Gengre Unknown";
  }

  return `
  <li data-id="${item.id}">
    <div class="topLargeOverlay">
          ${
            app.findIndexById(app.list, item.id) >= 0
              ? `<button tabindex="0" type="button" class="movieTvBtn detailBtn remove" data-id="${item.id}">Remove</button>`
              : `<button tabindex="0" type="button" class="movieTvBtn detailBtn add" data-id="${item.id}">Add to watchlist</button>`
          }
        <h3 class="movieTitle"> ${item.title ? item.title : item.name} </h3>
    </div>
    <div class="releaseDateContainer">
        <h3 class="releaseDate"> Release: ${
          item.release_date ? item.release_date : item.first_air_date
        } </h3>
    </div>
    <div class="imgDescriptionContainer">
      <div class="imgLargeOverlay">
        <img 
            src="${itemImgUrl}"   
            class="detailImg" 
            alt="${item.title ? item.title : item.name} poster">
      </div>
      <div class="descriptionLargeOverlay">
          <p class="descriptionDetails">  
            <b>Type</b>: ${item.title ? "Movie" : "TV Show"} <br>
            <b>Runtime</b>: ${runtime} <br>
            <b>Genre</b>: ${genres} <br>      
            <b>Website</b>: <a href="${homepageURL}" target="_blank">${homepageLinkIcon}</a>
          </p>  
          <h3 class="descriptionTitle"><i class="${typeIcon}"></i> <span>Description</span></h3>

          <p class="overview"> ${overview}</p>
      </div>
    </div>
  <li>
  `;
};

/* ----------------------------------------------------------------------*/
/* ------                       DISPLAYS                            -----*/
/* ----------------------------------------------------------------------*/

app.displayMedia = function (
  medias /* what info to display - as an array - what? */,
  $location /* cached jQuery object for location for inserting - where? */,
  getHtml /* callback for what it will look like - how? */
) {
  $location.html(``);
  medias.forEach((item) => {
    const htmlToAppend = getHtml(item);
    $location.append(htmlToAppend);
  });
};

/* ----------------------------------------------------------------------*/
/* ------                       GETTERS                             -----*/
/* ----------------------------------------------------------------------*/

app.getPopularByType = function (type) {
  const url = `${app.api.baseUrl}/${type}/popular`;
  $.ajax({
    url: url,
    method: `GET`,
    dataType: `json`,
    data: {
      api_key: app.api.key,
      language: app.api.lang,
    },
  }).then((data) => {
    app.popular[type] = data.results.slice(0, app.popularAmount);
    app.popular[type] = app.popular[type].map((item) => {
      item.media_type = type;
      return item;
    });
    app.displayMedia(
      app.popular[type],
      app.dom.$popular[type],
      app.getItemCardHtml
    );
  });
};

app.getRecent = function (list) {
  let amountToTake = app.recentAmount;
  const shortData = [];
  list.reverse();
  list.forEach((item) => {
    if (amountToTake-- > 0) {
      shortData.push(item);
    }
  });
  list.reverse();
  if (shortData.length) {
    app.displayMedia(shortData, app.dom.$recent, app.getItemCardHtml);
  } else {
    app.dom.$recent.html(``);
  }
};

app.getByKeyword = function (keyword) {
  const url = `${app.api.baseUrl}/search/multi`;
  $.ajax({
    url: url,
    method: `GET`,
    dataType: `json`,
    data: {
      api_key: app.api.key,
      languague: app.api.lang,
      query: keyword,
    },
  }).then((data) => {
    app.results = data.results
      .filter((item) => {
        return item.media_type === `movie` || item.media_type === `tv`;
      })
      .filter((item) => {
        return item.poster_path;
      })
      .slice(0, app.resultsAmount); // first x amount as specified in settings
    app.displayMedia(app.results, app.dom.$result, app.getItemCardHtml);
  });
};

app.getDetailsById = function (id, type) {
  const url = `${app.api.baseUrl}/${type}/${id}`;
  $.ajax({
    url: url,
    method: `GET`,
    dataType: `json`,
    data: {
      api_key: app.api.key,
      languague: app.api.lang,
    },
  }).then((data) => {
    const media = [];
    media.push(data);
    console.log(data);
    app.detail = data;
    app.setOverlayBackdrop();
    app.displayMedia(media, app.dom.$detail, app.getItemDetailHtml);
  });
};

/* ---------------------------------------------------------------------------*/
/* ------                        UPDATERS &  HELPERS                     -----*/
/* ---------------------------------------------------------------------------*/

app.pause = function (miliseconds) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, miliseconds);
  });
};

app.loadOverlay = async function ($this) {
  const id = $this.data(`id`);
  const type = $this.data(`type`);
  app.getDetailsById(id, type);
  app.dom.$DETAIL.show(`fast`);
  $(`.movieTvBtn.detailBtn`).focus();
};

// sets the backdrop of the Overlay
app.setOverlayBackdrop = function () {
  console.log(app.detail);
  const backImgUrl =
    app.api.imgUrl +
    (app.detail.backdrop_path
      ? app.detail.backdrop_path
      : app.detail.poster_path);
  $(".largeOverlay").css({
    "background-image": `url(${backImgUrl})`,
  });
};

// scrolls to the element with the given id
app.scrollToElem = function (id) {
  const element = document.getElementById(id);
  element.scrollIntoView({ behavior: "smooth" });
};

app.findIndexById = function (list, id) {
  let foundIndex = -1;
  list.forEach((item, index) => {
    if (item.id === id) {
      foundIndex = index;
    }
  });
  return foundIndex;
};

app.addToList = function (media) {
  const index = app.findIndexById(app.list, media.id);
  if (app.list.length < app.listAmount && index < 0) {
    app.list.push(media);
    app.displayMedia(app.list, app.dom.$list, app.getListItemtHtml);
  } else {
    // WARNING, ID ALREADY EXIST, SO DON'T ADD!
  }
};

app.removeFromList = function (id) {
  const index = app.findIndexById(app.list, id);
  if (index >= 0) {
    app.list.splice(index, 1);
    app.displayMedia(app.list, app.dom.$list, app.getListItemtHtml);
  } else {
    // warning, does not exist
  }
};

/* ----------------------------------------------------------------------*/
/* ------                       HANDLERS                            -----*/
/* ----------------------------------------------------------------------*/

app.Handlers = function () {
  /* ---------------------------------------*/
  $(`input.search`).on(`focus`, function () {
    $(`.homeButton`).fadeOut();
  });

  $(`input.search`).on(`blur`, function () {
    $(`.homeButton`).fadeIn();
  });

  /* [1] On start search */
  $(`input.search`).on(`keyup`, function () {
    app.keyword = $(this).val();
    app.getByKeyword(app.keyword);
    app.dom.$HOME.hide(`slow`);
    app.dom.$SEARCH.show("slow");
  });

  /* [2] On click Home Icon */
  $(`button.homeButton`).on(`click`, function () {
    // hide result, show the popular and recent again
    app.dom.$HOME.show(`slow`);
    app.dom.$SEARCH.hide("slow");
    app.getPopularByType(`movie`);
    app.getPopularByType(`tv`);
  });

  /* [5] On click any REMOVE to list icon ( requires even delegation) */
  $(`.container`).on(`click`, `button.remove`, function () {
    const id = $(this).data(`id`);
    app.removeFromList(id);
    app.getByKeyword(app.keyword);
    app.loadHome();
    app.dom.$DETAIL.hide(`fast`);
  });

  /* [6] On click any ADD from list icon ( requires event delegation) */
  $(`.container`).on(`click`, `button.add`, function () {
    const id = $(this).data(`id`);
    const listPool = app.popular.tv
      .concat(app.popular.movie)
      .concat(app.results);
    const index = app.findIndexById(listPool, id);
    const media = listPool[index];
    app.addToList(media);
    app.getByKeyword(app.keyword);
    app.loadHome();
    app.dom.$DETAIL.hide(`fast`);
  });

  $(`ul`).on(`click`, `.info`, function () {
    app.loadOverlay($(this));
  });

  $(`ul`).on(`click`, `.infoBtn`, function () {
    app.loadOverlay($(this));
  });

  $(`.exit`).on(`click`, function () {
    app.dom.$DETAIL.hide(`fast`);
  });

  $(`ul`).on(`focus`, `li`, function () {});

  $(`.listDrawerBtn`).on(`click`, function () {
    if (app.isOpen) {
      app.dom.$DRAWER.removeClass(`open`);
      app.dom.$DRAWER.addClass(`close`);
    } else {
      app.dom.$DRAWER.removeClass(`close`);
      app.dom.$DRAWER.addClass(`open`);
    }
    app.isOpen = !app.isOpen;
  });
};

app.loadHome = function () {
  app.getPopularByType(`movie`);
  app.getPopularByType(`tv`);
  app.getRecent(app.list);
};

app.init = function () {
  app.Handlers();
  app.loadHome();
};

$(() => {
  app.init();
});
