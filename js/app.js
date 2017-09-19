/*
 * Main app
 */
(function () {

    var app = angular.module("feed-app", ["ngResource"]);

    app.factory("FeedResource", ["$log", "$resource",
        function ($log, $resource) {
            return $resource("https://api.rss2json.com/v1/api.json?rss_url=https://bestofblogabode.tumblr.com/rss");
        }
    ]);

    app.factory("FeedService", ["$log", "FeedResource",
        function ($log, feedResource) {
            $log.debug("FeedService: starting");

            var me = {
                loadFeed: function (feedUrl, successCb, errorCb) {
                    feedResource.get({rss_url: feedUrl}).$promise.then(function (result) {
                        successCb(result);
                    }, function (error) {
                        (errorCb || angular.noop)(error.data);
                    });
                }
            };

            return me;
        }
    ]);

    app.controller("BodyController", ["$log", "$location", "FeedService",
        function ($log, $location, feedService) {
            $log.debug("BodyController: starting");

            var that = this;
            that.feed = {};
            that.items = [];
            that.status = "";
            that.result = {};
            that.firstDate = null;
            that.lastDate = null;
            that.loaded = false;

            that.loadSitemap = function (sitemap) {
                $log.debug("BodyController: loading sitemap = %o", sitemap);
                feedService.loadFeed(sitemap, function (result) {
                    $log.debug("BodyController: result = %o", result);
                    angular.copy(result.feed, that.feed);
                    angular.copy(result.items, that.items);
                    angular.copy(result.status, that.status);
                    
                    for (var i = 0, len = result.items.length; i < len; ++i) {
                        var item = result.items[i];
                        
                        if (!that.firstDate || new Date(item.pubDate) < that.firstDate)
                            that.firstDate = new Date(item.pubDate);
                        
                        if (!that.lastDate || new Date(item.pubDate) > that.lastDate) 
                            that.lastDate = new Date(item.pubDate);
                        
                    };
                    
                    that.spread = (that.lastDate.getTime() - that.firstDate.getTime()) / 86400000;
                    
                    that.frequency = that.items.length / that.spread;
                    
                    that.loaded = true;
                    
                }, function (error) {
                    $log.error("BodyController: error = %o");
                });
            };

        }
    ]);

})();
/*
 * vim: ts=4 et nowrap autoindent
 */