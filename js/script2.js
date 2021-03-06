const app = {};
//-------- API ---------------------------------------------------------- //
app.api = {};
app.api.baseUrl = `https://api.themoviedb.org/3`;
app.api.key = `9b08417459f02bab4f2533c48a22feab`;
app.api.lang = `en-US`;
app.api.imgUrl = `https://image.tmdb.org/t/p/original`;
//-------- SETTINGS ------------------------------------------------------//
app.recentAmount = 10; // app setting for how many recent will display on load
app.popularAmount = 10; // app setting for how many popular will display on load
app.resultsAmount = 12; // app setting for how many results to show upon search
app.listAmount = 9; // app setting for max amount of medias that can be be stored in the list at any given time
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
app.dom.$MYLIST = $(`.myListContainer`); // section for saved items
app.dom.$HOME = $(`.home`); // section for home
app.dom.$DETAIL = $(`.backDropOverlay`);
// ------ DATA ----------------------------------------------------------//
app.queries = []; // stores recent searches
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

app.getResultsStandin = function (image) {
  return `
    <div class="noResults">
      <div class="resultsImage">
        <img src="./assets/${image}" alt="results">
      </div>
    </div>
  `;
};

app.getSearchItem = function (query) {
  const keyword = app.shortenDownTo(query, 20);
  return `
    <li class="queryItem" data-id="${query}">
      <button data-id=${query}>
        <h5 data-id="${query}">${keyword}</h5>
      </button>
      <i id="${query}" class="far fa-times-circle"></i>
    </li>`;
};

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
  const backImgUrl =
    app.api.imgUrl +
    (item.backdrop_path ? item.backdrop_path : item.poster_path);
  const title = app.shortenDownTo(item.title ? item.title : item.name, 30);

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
        <button type="button" class="remove removeBtn" data-id="${item.id}">Remove</button> 
        <div class="info" data-id="${item.id}" data-type="${item.media_type}">
          <h3 class="addListItem"> ${title}</h3>
        </div>
    </div>  
  </li>`;
};

app.getItemDetailHtml = function (item) {
  const itemImgUrl = app.api.imgUrl + item.poster_path;
  const typeIcon = item.title ? "fas fa-film" : "fas fa-tv";
  let runtime = "";
  let genres = "";
  const overview = item.overview ? item.overview : "Unavailable";
  const homepageURL = item.homepage ? item.homepage : "";
  const homepageLinkIcon = item.homepage
    ? `<i class="fas fa-globe-asia"></i>`
    : "Unavailable";
  const release = item.release_date
    ? moment(item.release_date).format("MMMM Do, YYYY")
    : moment(item.first_air_date).format("MMMM Do, YYYY");
  const title = app.shortenDownTo(item.title ? item.title : item.name, 50);
  try {
    runtime = item.runtime
      ? Math.floor(item.runtime / 60) + " hr " + (item.runtime % 60) + " min"
      : item.episode_run_time[0] + " min";
  } catch (error) {
    runtime = "Unknown";
  }

  try {
    item.genres.forEach((genre, index) => {
      genres += (index === 0 ? "" : ", ") + genre.name;
    });
  } catch (error) {
    genres = "Unknown";
  }

  return `
    <li class="overlay" data-id="${item.id}">
      <div class="titleContainer">
        <h1 class="movieTitle">${title}</h1>
      </div>
      <div class="imgContainer">
        <img
          src="${itemImgUrl}"
          class="detailImg"
          alt=" ${title} poster"
        />
      </div>

      <div class="detailsContainer">
        <ul>
          <li><span>Release Date: </span> ${release} </li>
          <li><span>Type:</span> ${item.title ? "Movie" : "TV Show"}</li>
          <li><span>Runtime:</span> ${runtime}</li>
          <li><span>Genre:</span> ${genres}</li>
          <li>
            <span>Website:</span>
            <a href="${homepageURL}" target="_blank">${homepageLinkIcon}</a>
          </li>
        </ul>
      </div>
      <div class="overviewContainer">
        <h3><i class="${typeIcon}"></i> <span>Description</span></h3>
        <p class="overview">${overview}</p>
      </div>
      ${
        app.findIndexById(app.list, item.id) >= 0
          ? `<button tabindex="0" type="button" class="movieTvBtn detailBtn remove" data-id="${item.id}">Remove</button>`
          : `<button tabindex="0" type="button" class="movieTvBtn detailBtn add" data-id="${item.id}">Add to watchlist</button>`
      }
    </li>
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
/* ------                      API GETTERS                             -----*/
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
    console.log(app.popular[type]);
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

    if (app.results.length) {
      app.displayMedia(app.results, app.dom.$result, app.getItemCardHtml);
      app.saveSearch(keyword);
      app.displayMedia(app.queries, $(`.queryList`), app.getSearchItem);
      app.selectInGroup(
        $(`li.queryItem`),
        $(`li.queryItem[data-id="${app.keyword}"]`)
      );
    } else {
      app.displayMedia(["1.png"], app.dom.$result, app.getResultsStandin);
    }
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
    app.detail = data;
    app.setOverlayBackdrop();
    app.displayMedia(media, app.dom.$detail, app.getItemDetailHtml);
  });
};

/* ---------------------------------------------------------------------------*/
/* ------                        UPDATERS &  HELPERS                     -----*/
/* ---------------------------------------------------------------------------*/

// creates a pause for given milisenconds
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
    $(`.watchList`).addClass(`filled`);
  } else {
    // WARNING, ID ALREADY EXIST, SO DON'T ADD!
  }
};

app.removeFromList = function (id) {
  const index = app.findIndexById(app.list, id);
  if (index >= 0) {
    app.list.splice(index, 1);
    app.displayMedia(app.list, app.dom.$list, app.getListItemtHtml);
    if (!app.list.length) {
      app.displayMedia([`3.png`], $(`.watchList`), app.getResultsStandin);
      $(`.watchList`).removeClass(`filled`);
    }
  } else {
    // warning, does not exist
  }
};

app.addToQueries = function (query) {
  app.queries.length >= 4 ? app.queries.shift() : "";
  app.queries.push(query);
};

app.saveSearch = function (keyword) {
  app.queries.includes(keyword) ? "" : app.addToQueries(keyword);
};

app.selectInGroup = function ($group, $item) {
  $group.removeClass(`selected`);
  $item.addClass(`selected`);
};

app.shortenDownTo = function (string, length) {
  return string.length >= length
    ? string.substr(0, length).concat(`...`)
    : string;
};

app.intervalHeader = async function (type) {
  const index = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
  const posterPath = app.popular[type][index].backdrop_path;
  const itemImgUrl = app.api.imgUrl + posterPath;
  console.log("interval", itemImgUrl);
  $(".particleSupplement.one").addClass(`fade`);
  await app.pause(500);
  $("#particleSupplement.one").css({
    "background-image": `url(${itemImgUrl})`,
    "background-size": "contain",
    "background-repeat": "no-repeat",
  });
  await app.pause(500);
  $(".particleSupplement.one").removeClass(`fade`);
};

/* ----------------------------------------------------------------------*/
/* ------                       HANDLERS                            -----*/
/* ----------------------------------------------------------------------*/

app.Handlers = function () {
  /**************  *********************** ***********/
  /*******************  QUERIES LIST  ****************/
  /**************  *********************** ***********/

  // when you click on the query meny (visible only on mobile)
  $(`button.queryMenu`).on(`click`, function () {
    $(`.queryList`).toggleClass(`visible`);
  });

  // when you click on any query chip
  $(`ul.queryList`).on("click", "button", function () {
    try {
      app.keyword = $(this).data(`id`);
      app.getByKeyword(app.keyword);
      app.selectInGroup($(`li.queryItem`), $(this));
    } catch {
      console.log("not the button");
    }
  });

  // when you click to close the query chip
  $(`ul.queryList`).on("click", "i", function () {
    try {
      const keyword = $(this).attr("id");
      let index;
      app.queries.forEach((query, indx) => {
        if (query === keyword) {
          index = indx;
        }
      });
      app.queries.splice(index, 1);
      if (app.queries.length) {
        app.displayMedia(app.queries, $(`.queryList`), app.getSearchItem);
      } else {
        app.displayMedia([`4.png`], $(`.queryList`), app.getResultsStandin);
      }
    } catch {
      console.log("not the icon");
    }
  });

  /**************  *********************** ***********/
  /***************  SEARCHING & TABS  ****************/
  /**************  *********************** ***********/

  // when you click on the search input box
  $(`input.search`).on(`click`, function () {
    $(`button.tab`).removeClass(`selected`);
    $(`button.searchButton`).addClass(`selected`);
    app.dom.$HOME.hide(`slow`);
    app.dom.$MYLIST.hide(`slow`);
    app.dom.$SEARCH.show("slow");
  });

  // when you click on the search tab specifically
  $(`button.searchButton`).on(`click`, function () {
    app.dom.$HOME.hide(`slow`);
    app.dom.$MYLIST.hide(`slow`);
    app.dom.$SEARCH.show("slow");
  });

  // when you click on the list tab specifically
  $(`button.listButton`).on(`click`, function () {
    app.dom.$HOME.hide(`slow`);
    app.dom.$SEARCH.hide(`slow`);
    app.dom.$MYLIST.show(`slow`);
  });

  // when you click on the home tab specifically
  $(`button.homeButton`).on(`click`, function () {
    app.dom.$HOME.show(`slow`);
    app.dom.$MYLIST.hide(`slow`);
    app.dom.$SEARCH.hide(`slow`);
    app.getPopularByType(`movie`);
    app.getPopularByType(`tv`);
  });

  //when you click the search button to start the search
  $(`button.searchSubmitBtn`).on(`click`, function (e) {
    e.preventDefault();
    app.keyword = $(`input.search`).val().trim().toLowerCase();
    if (app.keyword) {
      app.getByKeyword(app.keyword);
      app.dom.$HOME.hide(`slow`);
      app.dom.$MYLIST.hide(`slow`);
      app.dom.$SEARCH.show("slow");
    }
  });

  //when you click on any tab to make it active
  $(`button.tab`).on(`click`, function () {
    app.selectInGroup($(`button.tab`), $(this));
  });

  /**************  *********************** ***********/
  /**************  ADD / REMOVE FROM LIST  ***********/
  /**************  *********************** ***********/

  // when you click any REMOVE from list icon
  $(`.container`).on(`click`, `button.remove`, function () {
    app.dom.$DETAIL.hide(`fast`);
    const id = $(this).data(`id`);
    app.removeFromList(id);
    app.loadHome();
  });

  // when you click any ADD to list icon
  $(`.container`).on(`click`, `button.add`, function () {
    app.dom.$DETAIL.hide(`fast`);
    const id = $(this).data(`id`);
    const listPool = app.popular.tv
      .concat(app.popular.movie)
      .concat(app.results);
    const index = app.findIndexById(listPool, id);
    const media = listPool[index];
    app.addToList(media);
    app.loadHome();
  });

  /**************  *********************** ***********/
  /************** OVERLAY LOADING/UNLOADING **********/
  /**************  *********************** ***********/

  // when you click the info icon to open overlay
  $(`ul`).on(`click`, `.info`, function () {
    app.loadOverlay($(this));
  });

  // when you click the info icon to open overlay
  $(`ul`).on(`click`, `.infoBtn`, function () {
    app.loadOverlay($(this));
  });

  // when you click to close the overaly
  $(`.exit`).on(`click`, function () {
    app.dom.$DETAIL.hide(`fast`);
  });
};

app.getParticles = function () {
  particlesJS("particles-js", {
    particles: {
      number: { value: 6, density: { enable: true, value_area: 800 } },
      color: { value: "#103140" },
      shape: {
        type: "edge",
        stroke: { width: 0, color: "#000" },
        polygon: { nb_sides: 9 },
        image: { src: "img/github.svg", width: 100, height: 100 },
      },
      opacity: {
        value: 0.7418104910943284,
        random: true,
        anim: {
          enable: false,
          speed: 0.42229729729729737,
          opacity_min: 0.025337837837837843,
          sync: true,
        },
      },
      size: {
        value: 264.36863246446813,
        random: true,
        anim: { enable: true, speed: 10, size_min: 40, sync: false },
      },
      line_linked: {
        enable: false,
        distance: 200,
        color: "#ffffff",
        opacity: 1,
        width: 2,
      },
      move: {
        enable: true,
        speed: 8,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: { enable: false, rotateX: 600, rotateY: 1200 },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: false, mode: "grab" },
        onclick: { enable: false, mode: "push" },
        resize: true,
      },
      modes: {
        grab: { distance: 400, line_linked: { opacity: 1 } },
        bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
        repulse: { distance: 200, duration: 0.4 },
        push: { particles_nb: 4 },
        remove: { particles_nb: 2 },
      },
    },
    retina_detect: true,
  });
};

app.loadHome = async function () {
  app.getPopularByType(`movie`);
  app.getPopularByType(`tv`);
  app.getRecent(app.list);
  app.getParticles();
  await app.pause(2000);
  setInterval(() => {
    app.intervalHeader(`movie`);
  }, 8000);
};

app.init = function () {
  app.Handlers();
  app.loadHome();
};

$(() => {
  app.init();
});
