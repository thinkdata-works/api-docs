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

  $(".see-geojson").parent().css({"margin-bottom":"25px", "padding-bottom": "10px", "border-bottom": "1px solid #FFF"})
  $(".see-json").parent().css({"background-color": "rgba(255,255,255,0.2"})
  
  $(".see-json").click( () => {
    $(".see-json").parent().css({"background-color": "rgba(255,255,255,0.2"})
    $(".see-csv").parent().css({"background-color": "rgba(255,255,255,0"})
    $(".see-geojson").parent().css({"background-color": "rgba(255,255,255,0"})
    $(".response-json").next().css({"display": 'block'});
    $(".response-csv").next().css({"display": 'none'});
    $(".response-geojson").next().css({"display": 'none'});
  });
  
  $(".see-csv").click( () => {
    $(".see-json").parent().css({"background-color": "rgba(255,255,255,0"})
    $(".see-csv").parent().css({"background-color": "rgba(255,255,255,0.2"})
    $(".see-geojson").parent().css({"background-color": "rgba(255,255,255,0"})
    $(".response-json").next().css({"display": 'none'});
    $(".response-csv").next().css({"display": 'block'});
    $(".response-geojson").next().css({"display": 'none'});
  })
  
  $(".see-geojson").click( () => {
    $(".see-json").parent().css({"background-color": "rgba(255,255,255,0"})
    $(".see-csv").parent().css({"background-color": "rgba(255,255,255,0"})
    $(".see-geojson").parent().css({"background-color": "rgba(255,255,255,0.2"})
    $(".response-json").next().css({"display": 'none'});
    $(".response-csv").next().css({"display": 'none'});
    $(".response-geojson").next().css({"display": 'block'});
  })
});