$( document ).ready(function() {

  $('body').on('click', '#newdata', handleClickNewData);
  $('body').on('click', '#search', handleClickSearch);
});



function handleClickSearch() {
  window.location.replace("/search");
}


function handleClickNewData() {
  window.location.replace("/newdata");
}
