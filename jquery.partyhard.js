(function ($) {

    $.fn.partyhard = function (options) {
        options = $.extend({
            tag: 'party hard gif',
            size: 'contain', // or 'cover'
            interval: 10 // secs
        }, options);

        console.log(options);
        var apiKey = options.key || 'p40LyUPzKCKD0Sb5AJxzPFUy4kULrHhE41MFnBLHSRYarpPs8M';

        var target = this.length ? this : $(document.body);

        return $.ajax('http://api.tumblr.com/v2/tagged', {
            data: {
                tag: options.tag,
                api_key: apiKey
            },
            dataType: 'jsonp'
        }).pipe(function (data) {
            var imageUrls = [];

            var response = data.response;
            if (data.meta.status != 200 || !response) {
                return $.Deferred(function () { this.reject(data) });
            }

            $.each(response, function () {
                if (this.photos && this.photos.length) {
                    $.each(this.photos, function () {
                        imageUrls.push(this.original_size.url);
                    });
                } else if (this.body) {
                    this.body.replace(/<img [^>]*src="([^"<>]+)"/, function (_, $1) {
                        imageUrls.push($('<div>').html($1).text());
                    });
                }
            });

            return imageUrls;
        }).done(function (imageUrls) {
            $.fn.partyhard.imageUrls = imageUrls;
            setInterval(function () {
                target.css({
                    'background-image': 'url(-)'.replace(/-/, imageUrls[Math.floor(Math.random() * imageUrls.length)]),
                    'background-size': options.size
                });
            }, options.interval * 1000);
        });
    };

})(jQuery);
