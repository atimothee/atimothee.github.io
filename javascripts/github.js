var github = (function(){
<<<<<<< HEAD
<<<<<<< HEAD
  function escapeHtml(str) {
    return $('<div/>').text(str).html();
  }
=======
>>>>>>> 5d452c4517120b2b33635b7fb6b443ca842150b2
=======
>>>>>>> 5d452c4517120b2b33635b7fb6b443ca842150b2
  function render(target, repos){
    var i = 0, fragment = '', t = $(target)[0];

    for(i = 0; i < repos.length; i++) {
<<<<<<< HEAD
<<<<<<< HEAD
      fragment += '<li><a href="'+repos[i].html_url+'">'+repos[i].name+'</a><p>'+escapeHtml(repos[i].description||'')+'</p></li>';
=======
      fragment += '<li><a href="'+repos[i].html_url+'">'+repos[i].name+'</a><p>'+(repos[i].description||'')+'</p></li>';
>>>>>>> 5d452c4517120b2b33635b7fb6b443ca842150b2
=======
      fragment += '<li><a href="'+repos[i].html_url+'">'+repos[i].name+'</a><p>'+(repos[i].description||'')+'</p></li>';
>>>>>>> 5d452c4517120b2b33635b7fb6b443ca842150b2
    }
    t.innerHTML = fragment;
  }
  return {
    showRepos: function(options){
      $.ajax({
<<<<<<< HEAD
<<<<<<< HEAD
          url: "https://api.github.com/users/"+options.user+"/repos?sort=pushed&callback=?"
        , dataType: 'jsonp'
=======
          url: "https://api.github.com/users/"+options.user+"/repos?callback=?"
        , type: 'jsonp'
>>>>>>> 5d452c4517120b2b33635b7fb6b443ca842150b2
=======
          url: "https://api.github.com/users/"+options.user+"/repos?callback=?"
        , type: 'jsonp'
>>>>>>> 5d452c4517120b2b33635b7fb6b443ca842150b2
        , error: function (err) { $(options.target + ' li.loading').addClass('error').text("Error loading feed"); }
        , success: function(data) {
          var repos = [];
          if (!data || !data.data) { return; }
          for (var i = 0; i < data.data.length; i++) {
            if (options.skip_forks && data.data[i].fork) { continue; }
            repos.push(data.data[i]);
          }
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 5d452c4517120b2b33635b7fb6b443ca842150b2
          repos.sort(function(a, b) {
            var aDate = new Date(a.pushed_at).valueOf(),
                bDate = new Date(b.pushed_at).valueOf();

            if (aDate === bDate) { return 0; }
            return aDate > bDate ? -1 : 1;
          });

<<<<<<< HEAD
>>>>>>> 5d452c4517120b2b33635b7fb6b443ca842150b2
=======
>>>>>>> 5d452c4517120b2b33635b7fb6b443ca842150b2
          if (options.count) { repos.splice(options.count); }
          render(options.target, repos);
        }
      });
    }
  };
})();
