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

    app.controller("BodyController", ["$log", "FeedService",
        function ($log, feedService) {
            $log.debug("BodyController: starting");

            var that = this;
            that.feed = {};
            that.items = [];
            that.status = "";

            that.loadSitemap = function (sitemap) {
                $log.debug("BodyController: loading sitemap = %o", sitemap);
                feedService.loadFeed(sitemap, function (result) {
                    $log.debug("BodyController: result = %o", result);
                    angular.copy(result.feed, that.feed);
                    angular.copy(result.items, that.items);
                    angular.copy(result.status, that.status);
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
