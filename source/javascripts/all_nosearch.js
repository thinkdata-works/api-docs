//= require ./lib/_energize
//= require ./app/_toc
//= require ./app/_lang

$(function() {
  loadToc($('#toc'), '.toc-link', '.toc-list-h2', 10);
  setupLanguages($('body').data('languages'));
  $('.content').imagesLoaded( function() {
    window.recacheHeights();
    window.refreshToc();
  });
});

window.onpopstate = function() {
  activateLanguage(getLanguageFromQueryString());
};

$(document).ready(() => {
  $(".response-json").next().css({"display": 'block'});
  $(".response-csv").next().css({"display": 'none'});
  $(".response-geojson").next().css({"display": 'none'});

  $(".see-json").css({"opacity": "1", "box-shadow": "2px 2px 4px #ddd"})
  $(".see-csv").css({"opacity": "0.75"})
  $(".see-geojson").css({"opacity": "0.75"})
  
  $(".see-json").click( () => {
    $(".see-json").css({"opacity": "1", "box-shadow": "2px 2px 4px #ddd"})
    $(".see-csv").css({"opacity": "0.75", "box-shadow": "none"})
    $(".see-geojson").css({"opacity": "0.75", "box-shadow": "none"})
    $(".response-json").next().css({"display": 'block'});
    $(".response-csv").next().css({"display": 'none'});
    $(".response-geojson").next().css({"display": 'none'});
  });
  
  $(".see-csv").click( () => {
    $(".see-json").css({"opacity": "0.75", "box-shadow": "none"})
    $(".see-csv").css({"opacity": "1", "box-shadow": "2px 2px 4px #ddd"})
    $(".see-geojson").css({"opacity": "0.75", "box-shadow": "none"})
    $(".response-json").next().css({"display": 'none'});
    $(".response-csv").next().css({"display": 'block'});
    $(".response-geojson").next().css({"display": 'none'});
  })
  
  $(".see-geojson").click( () => {
    $(".see-json").css({"opacity": "0.75", "box-shadow": "none"})
    $(".see-csv").css({"opacity": "0.75", "box-shadow": "none"})
    $(".see-geojson").css({"opacity": "1", "box-shadow": "2px 2px 4px #ddd"})
    $(".response-json").next().css({"display": 'none'});
    $(".response-csv").next().css({"display": 'none'});
    $(".response-geojson").next().css({"display": 'block'});
  })
});