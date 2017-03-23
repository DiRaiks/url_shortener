
$('.btn_shorten').on('click', function(){
  $.ajax({
    url: '/api_short',
    type: 'POST',
    daraType: 'JSON',
    data: {url: $('#input_data').val()},
    success: function(data) {
      var resultHTML = '<a class="result" href="' + data.shortUrl+ '">' +  data.shortUrl + '</a>';
      $('#link').html(resultHTML);
      $('#link').hide().fadeIn('slow');
    }
  });
});
