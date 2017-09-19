/*
 * Main app
 */
(function() {

    var app = angular.module("feed-app", []);

    app.controller("BodyController", ["$log", "$http", 
        function($log, $http) {
            $log.debug("BodyController: starting");

            var that = this;
            
            that.loadSitemap = function(sitemap) {
                $log.debug("BodyController: loading sitemap = %o", sitemap);
            };

        }
    ]);

})();
/*
 * vim: ts=4 et nowrap autoindent
 */
