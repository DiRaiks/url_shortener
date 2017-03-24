
$('.btn_shorten').on('click', function(){

  $.ajax({
    url: '/api_short',
    type: 'POST',
    daraType: 'JSON',
    data: {url: $('#input_data').val(),
  input_short: $('#input_short').val()},
    success: function(data) {
      var resultHTML = '<input class="result" value="' + data.shortUrl+ '">';
      $('#link').html(resultHTML);
      $('#link').hide().fadeIn('slow');
    }
  });
});
