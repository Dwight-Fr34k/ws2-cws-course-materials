function htmlEncode(value){
    if (value) {
        return jQuery('<div />').text(value).html();
    } else {
        return '';
    }
}

window.addEventListener('load', function() {

  // holds search input value
  var valSearch;

  // keystrokes faster than this do not trigger an ajax search call
  var delay = 500;

  // aliases
  $frmSearch = $('#livesearch form:first');
  $inpSearch = $('#livesearch input[type=search]');
  $results = $('#livesearch .livesearch_results');

  // block space, arrow control by reveal
  $inpSearch.on('keydown', function(e) {
    e.stopPropagation();
  });

  // live search function
  var performSearch = function(query) {
    // ajax search is not necessary anymore; user has continued typing or entered another string 
    if (query != valSearch) return;

    // show 'searching' message
    $results.css('visibility', 'visible');
    $results.html('<p class="entry">searching...</p>');

    // perform AJAX search
    $.ajax({
      type: 'GET',
      url: 'http://pers_rogiervdl.ikdoeict.be/App1/search_indexes.php',
//      url: 'http://localhost:8080/leercentrum/search_indexes.php',
      dataType: 'json',
      data: { q: query, pagesize: 20, textsize: 170 }
    }).done(function(data) {
//      console.log(data);
      // sort results
      var currChapter = $('body:first').attr('data-livesearch-chapter');
      var currTopic = $('body:first').attr('data-livesearch-topic');
      var sameTopicData = [];
      var sameChapterData = [];
      var otherData = [];
      for (var i = 0, len = data.length; i < len; i++) {
        var entry = data[i];
        if (currChapter && entry.chapter == currChapter) sameChapterData.push(entry);
        else if (currTopic && entry.topic == currTopic) sameTopicData.push(entry);
        else otherData.push(entry);
      }

      // find search terms
      var searchterms = query.split(/\s+/).join('|');

      // build html
      var html = '';

      // add results from the same presentation
      if (sameChapterData.length > 0) {
        html += '<section class="livesearch_samechapter">';
        html += '<p>Results from this presentation:</p>';
        for (var i = 0; i < sameChapterData.length; i++) {
          var entry = sameChapterData[i];
          html += '<a href="' + entry.url + '" class="clearfix">';
          html += '  <div class="livesearch_entry">';
          html += '    <img class="livesearch_icon" alt="' + entry.title + '" src="' + entry.icon + '" />'; 
          html += '    <div class="livesearch_info">';
          html += '      <div class="livesearch_header">' + entry.header + '</div>'; 
          html += '      <div class="livesearch_text">' + entry.text.replace(new RegExp(searchterms, 'gm'), '<mark>' + query + '</mark>' ) + '</div>';
          html += '    </div>';
          html += '  </div>';
          html += '</a>';
        }
        html += '</section>';
      }

      // add results from the same topic
      if (sameTopicData.length > 0) {
        html += '<section class="livesearch_sametopic">';
        html += '<p>Results from presentations in the same topic:</p>';
        for (var i = 0, len = sameTopicData.length; i < len; i++) {
          var entry = sameTopicData[i];
          html += '<a href="' + entry.url + '" class="clearfix">';
          html += '  <div class="livesearch_entry">';
          html += '    <img class="livesearch_icon" alt="' + entry.title + '" src="' + entry.icon + '" />'; 
          html += '    <div class="livesearch_info">';
          html += '      <div class="livesearch_header">' + entry.header + '</div>'; 
          html += '      <div class="livesearch_text">' + entry.text.replace(new RegExp(searchterms, 'gm'), '<mark>' + query + '</mark>' ) + '</div>';
          html += '    </div>';
          html += '  </div>';
          html += '</a>';
        }
        html += '</section>';
      }

      // add other results
      if (otherData.length > 0) {
        html += '<section class="livesearch_other">';
        if (sameTopicData.length > 0 || sameChapterData.length > 0 ) html += '<p>Other results:</p>';
        for (var i = 0, len = otherData.length; i < len; i++) {
          var entry = otherData[i];
          html += '<a href="' + entry.url + '" class="clearfix">';
          html += '  <div class="livesearch_entry">';
          html += '    <img class="livesearch_icon" alt="' + entry.title + '" src="' + entry.icon + '" />'; 
          html += '    <div class="livesearch_info">';
          html += '      <div class="livesearch_header">' + entry.header + '</div>'; 
          html += '      <div class="livesearch_text">' + entry.text.replace(new RegExp(searchterms, 'gm'), '<mark>' + query + '</mark>' ) + '</div>';
          html += '    </div>';
          html += '  </div>';
          html += '</a>';
        }
        html += '</section>';
      }

      if (query != valSearch) return;
      // show results
      $results.html((html == '' ? '<p class="livesearch_entry">no results found</p>' : html));
    }).error(function(data) {
      // something went wrong
      $results.html('<p class="livesearch_entry">unable to connect to search service</p>');
    });   
  }

  // events
  $inpSearch.on('input', function(e) {
    // find query value
    var newValSearch = $(this).val();
    valSearch = newValSearch;
    if (String.prototype.trim && typeof String.prototype.trim == "function") {
      newValSearch = valSearch.trim();
    }
    if (newValSearch == '') {
      $results.html('');
      $results.css('visibility', 'hidden');
      return;
    }

    // perform ajax call to search service
    setTimeout(function() { performSearch(newValSearch) }, delay);
  });

  // hide results on mouse out results
  $results.on('mouseout', function() {
    $results.css('visibility', 'hidden');
  });

  // show results on mouse over results
  $results.on('mouseover', function() {
    if ($results.html() != '') $results.css('visibility', 'visible');
  });

  // show results on key up or mouse over input
  $inpSearch.on('keyup mouseover', function() {
    if ($results.html() != '') $results.css('visibility', 'visible');
  });

  // form submit
  $frmSearch.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
  });

  // hide results on mouse out results
  $(document).on('click', function() {
    $results.css('visibility', 'hidden');
  });


}, false);