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
  $(".see-json").addClass("selected-format")
  $(".see-csv").addClass("unselected-format")
  $(".see-geojson").addClass("unselected-format")
  
  $(".response-json").next().addClass("show-codeblock")
  $(".response-csv").next().addClass("hide-codeblock")
  $(".response-geojson").next().addClass("hide-codeblock")

  $(".see-json").click( () => {
    $(".see-json").removeClass("unselected-format").addClass("selected-format")
    $(".see-csv, .see-geojson").removeClass("selected-format").addClass("unselected-format")
    $(".response-json").next().removeClass("hide-codeblock").addClass("show-codeblock")
    $(".response-csv, .response-geojson").next().removeClass("show-codeblock").addClass("hide-codeblock")
  });
  
  $(".see-csv").click( () => {
    $(".see-csv").removeClass("unselected-format").addClass("selected-format")
    $(".see-json, .see-geojson").removeClass("selected-format").addClass("unselected-format")
    $(".response-csv").next().removeClass("hide-codeblock").addClass("show-codeblock")
    $(".response-json, .response-geojson").next().removeClass("show-codeblock").addClass("hide-codeblock")
  })
  
  $(".see-geojson").click( () => {
    $(".see-geojson").removeClass("unselected-format").addClass("selected-format")
    $(".see-json, .see-csv").removeClass("selected-format").addClass("unselected-format")
    $(".response-geojson").next().removeClass("hide-codeblock").addClass("show-codeblock")
    $(".response-csv, .response-json").next().removeClass("show-codeblock").addClass("hide-codeblock")
  })
});