(function ($, undefined) {
	var featured = ['CloudFlare-Tools', 'CloudFlare-CPanel', 'SortaSQL'],
		num = 0;

	function addRecentlyUpdatedRepo(repo) {
		var $item = $('<li>');
		var $name = $('<a>').attr('href', repo.html_url).text(repo.name);
		$item.append($('<span>').addClass('name').append($name));
		$item.append('<span class="bullet">&sdot;</span>');
		var $time = $('<a>').attr('href', repo.html_url + '/commits').text( repo.pushed_at.toDateString() );
		$item.append($('<span>').addClass('time').append($time));
		$item.append('<span class="bullet">&sdot;</span>');
		var $watchers = $('<a>').attr('href', repo.html_url + '/watchers').text(repo.watchers + ' stargazers');
		$item.append($('<span>').addClass('watchers').append($watchers));
		$item.append('<span class="bullet">&sdot;</span>');
		var $forks = $('<a>').attr('href', repo.html_url + '/network').text(repo.forks + ' forks');
		$item.append($('<span>').addClass('forks').append($forks));
		$('#recently-updated').removeClass('loading').append($item);
	}

	function addRepo(repo) {
		var $item = $('<div>').addClass('column');
		var $link = $('<a>').attr('href', repo.html_url).appendTo($item);
		$link.addClass('repo lang-'+ (repo.language || '').toLowerCase().replace(/[\+#]/gi, '') );
		$link.append($('<h4 class="repo-name">').text(repo.name || 'Unknown'));
		$link.append($('<h5 class="repo-lang">').text(repo.language || ''));
		$link.append($('<p class="repo-desc">').text(repo.description || ''));

		if( featured.indexOf(repo.name) > -1 ){
			$link.addClass('featured'+(++num));
			$item.prependTo('#repos');
		}else{
			$item.appendTo('#repos');
		}
	}

	function addRepos(repos, page) {
		repos = repos || [];
		page = page || 1;
		var uri = 'https://api.github.com/orgs/cloudflare/repos?callback=?' + '&per_page=100' + '&page='+page;

		$.getJSON(uri, function (result) {
			repos = repos.concat(result.data);
			if( result.data && result.data.length == 100 ){
				addRepos(repos, page + 1);
			}else{
				$('#repo-count').text(repos.length).removeClass('loading');
				// Convert pushed_at to Date.
				$.each(repos, function (i, repo) {
					repo.pushed_at = new Date(repo.pushed_at);
				});

				// Sort by most-recently pushed to.
				// or is featured
				repos.sort(function (a, b) {
					if (a.pushed_at < b.pushed_at) return 1;
					if (b.pushed_at < a.pushed_at) return -1;
					return 0;
				});

				$.each(repos, function (i, repo) {
					addRepo(repo);
					if( i < 4 ) addRecentlyUpdatedRepo(repo);
				});
			}
		});
	}

	function addMember( member ){
		var $item = $('<div>').addClass('column');
		var $link = $('<a>').attr('href', member.html_url).appendTo($item);
		var $deets = $('<div>').addClass('member-info').appendTo($link);
		$link.addClass('member');
		$link.prepend($('<img height="90" width="90">').attr('src', member.avatar_url).addClass('member-avatar'));
		$deets.append( $('<h4 class="user-name">').text(member.login));
		$item.appendTo('#members');
	}

	function addMembers(){
		$.getJSON('https://api.github.com/orgs/cloudflare/members?callback=?', function (result) {
			var members = result.data;
			$('#member-count').text(members.length).removeClass('loading');
			$.each( members, function(idx, member){ addMember( member ); });
		});
	}

	addRepos();
	addMembers();

	$('#activate-mobile-menu').on('click', function( evt ){
		evt.preventDefault();
		$('#header').toggleClass('mobile-menu-active');
	})

})(jQuery);
