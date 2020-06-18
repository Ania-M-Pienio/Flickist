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
      <h3>0 Search Results</h3>
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

/* ----------------------------------------------------------------------*/
/* ------                       HANDLERS                            -----*/
/* ----------------------------------------------------------------------*/

app.Handlers = function () {
  $(`button.queryMenu`).on(`click`, function () {
    // when you click on any query chip
    $(`.queryList`).toggleClass(`visible`);
  });

  $(`ul.queryList`).on("click", "button", function () {
    // submit search
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
    // remove search
    try {
      const keyword = $(this).attr("id");
      let index;
      app.queries.forEach((query, indx) => {
        if (query === keyword) {
          index = indx;
        }
      });
      app.queries.splice(index, 1);
      app.displayMedia(app.queries, $(`.queryList`), app.getSearchItem);
    } catch {
      console.log("not the icon");
    }
  });

  /* ---------------------------------------*/
  // when you click on the search box only
  $(`input.search`).on(`click`, function () {
    $(`button.tab`).removeClass(`selected`);
    $(`button.searchButton`).addClass(`selected`);
    app.dom.$HOME.hide(`slow`);
    app.dom.$MYLIST.hide(`slow`);
    app.dom.$SEARCH.show("slow");
  });

  //when you click on any tab to make it active
  $(`button.tab`).on(`click`, function () {
    app.selectInGroup($(`button.tab`), $(this));
  });

  // when you click on the search tab specifically
  $(`button.searchButton`).on(`click`, function () {
    app.dom.$HOME.hide(`slow`);
    app.dom.$MYLIST.hide(`slow`);
    app.dom.$SEARCH.show("slow");
  });

  $(`button.listButton`).on(`click`, function () {
    app.dom.$HOME.hide(`slow`);
    app.dom.$SEARCH.hide(`slow`);
    app.dom.$MYLIST.show(`slow`);
  });

  /* [1] On start search */
  $(`button.searchSubmitBtn`).on(`click`, function (e) {
    // submit search
    e.preventDefault();
    app.keyword = $(`input.search`).val().trim().toLowerCase();
    if (app.keyword) {
      app.getByKeyword(app.keyword);
      app.dom.$HOME.hide(`slow`);
      app.dom.$MYLIST.hide(`slow`);
      app.dom.$SEARCH.show("slow");
    }
  });

  /* [2] On click Home Icon */
  $(`button.homeButton`).on(`click`, function () {
    // hide result, show the popular and recent again
    app.dom.$HOME.show(`slow`);
    app.dom.$MYLIST.hide(`slow`);
    app.dom.$SEARCH.hide(`slow`);
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
