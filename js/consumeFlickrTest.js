/* global Freewall,$ */
(function(){
    'use strict';

    /**
     * mapItems - function to map items
     * @param {object} item - an item from the items array
     */
    var mapItems = function (item) {
        var isFave = sessionStorage.getItem(item.media.m);
        var selected = isFave ? ' selected' : '';
        return ['<div class="brick', selected, '">',
            '<img src=\"', item.media.m, '\" width=\"100%\" alt=\"\" />',
        '</div>'].join('');
    };

    /**
     * setupWall - uses the freewall library to create an animated
     * responsive layout
     */
    var setupWall = function () {
        var wall = new Freewall('#photos');
        wall.reset({
            selector: '.brick',
            animate: true,
            cellW: 200,
            cellH: 'auto',
            onResize: function() {
                wall.fitWidth();
            }
        });

        wall.container.find('.brick img').load(function() {
            wall.fitWidth();
        });
    };

    /**
     * favourite - toggles the selected class on and off and stores
     * 				the favourites in sessionStorage (does not persist over
     * 				sessions or to new tabs - see https://goo.gl/MQ4jjo)
     */
    var favourite = function () {
        var brick = $(this);
        var imgSrc = brick.find('img').attr('src');
        // toggle the selected class on or off
        brick.toggleClass('selected');
        // store the favourite status in session storage
        if(brick.hasClass('selected')) {
            sessionStorage.setItem(imgSrc, true);
        } else {
            sessionStorage.removeItem(imgSrc);
        }
    };

    /**
     * cb -call back function for processing flickr data
     * @param  {JSON}       data - the flickr data
     */
    var cb = function (data){
        var $photos = $('#photos');

        // process the items
        var processed = data.items.map(mapItems);

        // add them to the photos div
        $photos.append(processed.join(''));

        // add event to toggle favourites
        $('.brick').on('click', favourite);

        // set up the dynamic layout
        setupWall();
    };

    // call the flickr service using jQuery so we don't have to put the
    // callback into the global scope or namespace
    var tags = 'london';
    var service='http://api.flickr.com/services/feeds/photos_public.gne' +
                '?format=json&jsoncallback=?&tags='+tags;
    $.getJSON(service, cb);

})();
