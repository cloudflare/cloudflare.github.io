(function ($, undefined) {
	// NOTE: featured repos currently not used (commented out- why?)
	var featured = ['lua-nginx-module', 'stapxx', 'redoctober'];

	// See https://wiki.cfops.it/display/PS/Open+Source for deprecation information
	var exclude = [
		// These first few sections were already excluded.
		// deleted? renamed?
		'jas',
		'CloudFlare-UI',

		// forks
		'circus',
		'fpm',
		'phantomjs',
		'zendesk',
		'raven-php',
		'go-raft',
		'twemcache',

		// forked and deprecated
		'cfapp-canopy',

		// empty repo (one-line README only)
		'cloudflarejs',

		// active, but excluded as not of interest
		'cloudflare.github.io',

		// deprecated, already excluded
		'instaflare',
		'dnschanger_detector',
		'cfapp_sample',

		// The rest are newly tagged as deprecated
		// Partnerships
		'Cloudflare-CNAME-flattener',
		'ModCloudFlareIIS',
		'Cloudflare-Tools',

		// This is being removed from GitHub entirely
		'Cloudflare-Plesk',

		// Talks and demos
		'cf-dnssec-demo-domain-1',
		'cf-dnssec-demo-domain-2',
		'gosession2',

		// External site
		'origin-pull',

		// App Store (the old one)
		'cf-app',

		// Security
		'keyless',

		// KyotoTycoon
		'kyototycoon',
		'kyotocabinet',
		'kt_fdw',
		'gokabinet',
		'SortaSQL',

		// NGINX & Lua
		'lua-upstream-cache-nginx-module',
		'lua-resty-kyototycoon',
		'lua-resty-limit',  // just a README
		'ljmm',
		'luajit-mm',

		// JavaScript
		'babel-preset-cf',
		'generator-cf-module',
		'redox',
		'transifex-client',
		'deadorbit',
		'collapsify',

		// Miscellaneous
		'spdget',
		'vpnc-scripts'];

	var includeForks = [
		'python-cloudflare',
		'zlib',
		'lua-cmsgpack'
	];

	var customRepos = [{
		name : 'stapxx',
		html_url : 'https://github.com/agentzh/stapxx',
		language : 'Perl',
		description : 'Simple macro language extentions to systemtap'
	},{
		name : 'nginx-systemtap-toolkit',
		html_url : 'https://github.com/agentzh/nginx-systemtap-toolkit',
		language : 'Perl',
		description : 'Real-time analyzing and diagnosing tools for Nginx based on SystemTap'
	},{
		name : 'lua-nginx-module',
		html_url : 'https://github.com/chaoslawful/lua-nginx-module',
		language : 'C',
		description : 'Embed the Power of Lua into NginX'
	},{
		name : 'ngx_cache_purge',
		html_url : 'https://github.com/FRiCKLE/ngx_cache_purge',
		language : 'C',
		description : 'nginx module which adds ability to purge content from FastCGI, proxy, SCGI and uWSGI caches.'
	}];

	var categories = {
		'Integrate': {
			'claire': null,
			'Cloudflare-CPanel': null,
			'Cloudflare-Magento': null,
			'Cloudflare-Pivotal-Cloud-Foundry': null,
			'Cloudflare-WordPress': null,
			'mod_cloudflare': null,
			'cloudflare-plugin-frontend': null,
			'cloudflare-plugin-backend': null
		},
		'Automate': {
			'cloudflare-go': null,
			'node-cloudflare': null,
			'python-cloudflare': null,
			'cloudflare-php': null,
			'salt-cloudflare': null,
			'logsclient': null,
			'logshare': null,
			'wafanalyzer': null,
			'json-schema-tools': null,
			'doca': null,
			'doca-bootstrap-theme': null
		},
		'Secure': {
			'cfssl': null,
			'sslconfig': null,
			'redoctober': null,
			'bpftools': null,
			'fourq': null,
			'gokeyless': null,
			'cfssl_trust': null,
			'certmgr': null,
			'tls-tris': null
		},
		'Nginx': {
			'lua-nginx-module' : null,
			'lua-nginx-cache-module': null,
			'nginx-systemtap-toolkit': null,
			'stapxx': null,
			'ngx_cache_purge': null,
			'ngx_brotli_module': null,
			'lua-cmsgpack': null,
			'lua-aho-corasick': null,
			'lua-resty-logger-socket' : null,
			'lua-resty-cookie': null,
			'lua-resty-json': null
		},
		'JavaScript': {
			'backgridjs.com': null
		},
		'Go': {
			'golibs' : null,
			'hellogopher': null,
			'goser': null,
			'golz4': null
		},
		'Rust': {
			'quiche': null
		},
		'Other': {}
	};

	var num = 0;

	function addRecentlyUpdatedRepo(repo) {
		var $item = $('<li>');
		var $name = $('<a>').attr('href', repo.html_url).text(repo.name);
		$item.append($('<span>').addClass('name').append($name));
		$item.append('<span class="bullet">&sdot;</span>');
		var $time = $('<a>').attr('href', repo.html_url + '/commits').text( repo.pushed_at.toDateString() );
		$item.append($('<span>').addClass('time').append($time));
		$item.append('<span class="bullet">&sdot;</span>');
		var $watchers = $('<a>').attr('href', repo.html_url + '/watchers').text(repo.watchers + (repo.watchers === 1 ? ' stargazer' : ' stargazers'));
		$item.append($('<span>').addClass('watchers').append($watchers));
		$item.append('<span class="bullet">&sdot;</span>');
		var $forks = $('<a>').attr('href', repo.html_url + '/network').text(repo.forks + (repo.forks === 1 ? ' fork' : ' forks'));
		$item.append($('<span>').addClass('forks').append($forks));
		$('#recently-updated').removeClass('loading').append($item);
	}

	function addRepo(repo, $container) {
		var $item = $('<div>').addClass('column');
		var $link = $('<a>').attr('href', repo.html_url).appendTo($item);
		$link.addClass('repo lang-'+ (repo.language || '').toLowerCase().replace(/[\+#]/gi, '') );
		$link.append($('<h4 class="repo-name">').text(repo.name || 'Unknown'));
		$link.append($('<h5 class="repo-lang">').text(repo.language || ''));
		$link.append($('<p class="repo-desc">').text(repo.description || ''));

		/*if( featured.indexOf(repo.name) > -1 ){
			$link.addClass('featured'+(++num));
			$item.prependTo('#repos');
		}else{*/
		$item.appendTo($container);
		//}
	}

	function addCategory(cat, repos){
		var $section = $('<section id="cat-'+cat+'" />').appendTo('#repos'), $container;
		$section.append($('<h2 />',{'class': 'subheadline', 'text': cat}));
		$container = $('<div class="repos section columns three" />').appendTo($section);

		// The .append(' ') enures a space between the links which allows them
		// to wrap on a narrow screen.  Previously this sort of worked with breaks
		// possible within "Nginx and Lua" but nowhere else.  This provides a more
		// natural behavior.  Given tha larger number of headings, using both
		// the space and the existing between-link margin works well.
		$('#category-shortcuts').append($('<a />', {
			href: '#cat-'+cat,
			text: cat
		})).append(' ')

		$.each(repos, function(i, repo){
			if( repo !== null ){
				addRepo(repo, $container);
			}
		});
	}

	function addRepos(repos, page) {
		repos = repos || [];
		page = page || 1;
		var uri = 'https://api.github.com/orgs/cloudflare/repos?callback=?' + '&per_page=100' + '&page='+page;

		$.getJSON(uri, function (result) {
			// API Rate limiting catch
			if( result.data && result.data.message ){
				$('<p class="text-error">')
					.text('Your IP has hit github\'s rate limit per hour.')
					.appendTo('.hero-block');
				return;
			}

			repos = repos.concat(result.data);
			if( result.data && result.data.length == 100 ){
				addRepos(repos, page + 1);
			}else{
				//
				repos = $.grep(repos, function(value) {
					var keep = exclude.indexOf(value.name) === -1,
						found = false;
					if( value.fork && (includeForks.indexOf(value.name) === -1) ){
						// ignore most forks.
						keep = false;
					}

					// Build up the categories while we're looping through
					if( keep ){
						$.each(categories, function(key, items){
							if( value.name in items ){
								found = true;
								items[value.name] = value;
								return false;
							}else if( value.language == key || (key === 'Nginx' && value.language === 'Lua') ){
								found = true;
								categories[key][value.name] = value;
							}
						});

						if( !found ){
							categories.Other[value.name] = value;
						}
					}

					return keep;
				});

				$('#repo-headline').hide();//text(repos.length).removeClass('loading');
				// Convert pushed_at to Date.
				$.each(repos, function (i, repo) {
					repo.pushed_at = new Date(repo.pushed_at || null);
				});

				// Sort by most-recently pushed to.
				// or is featured
				repos.sort(function (a, b) {
					if (a.pushed_at < b.pushed_at) return 1;
					if (b.pushed_at < a.pushed_at) return -1;
					return 0;
				});

				$.each(repos.slice(0, 3), function (i, repo) {
					addRecentlyUpdatedRepo(repo);
				});

				$.each(categories, function (cat, repos){
					addCategory(cat, repos);
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

	function addMembers( count, url ){
		$.getJSON(url + '&callback=?', function (result) {
			// API Rate limiting catch
			if( result.data && result.data.message ){ return; }

			var members = result.data;
			count += members.length;
			$('#member-count').text(count).removeClass('loading');
			$.each( members, function(idx, member){ addMember( member ); });

			$.each(result.meta.Link, function (idx, link) {
				if (link[1].rel === 'next') {
					addMembers( count, link[0] )
					return false; // short-circuit $.each
				}
			});
		});
	}

	addRepos(customRepos);
	addMembers(0, 'https://api.github.com/orgs/cloudflare/members?page=1');

	$('#activate-mobile-menu').on('click', function( evt ){
		evt.preventDefault();
		$('#header').toggleClass('mobile-menu-active');
	})

})(jQuery);
