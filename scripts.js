$(function () {


    function searchModel() {
        var self = {};
        self.gMaps = null;
        self.placesService = null;
        self.markersObject = {};
        self.markersArray = function () {
            return $.map(self.markersObject, function (x) { return [x]; });
        }
        self.initMarker = function (foundObject) {
            var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(
                    foundObject.geometry.location.lat(),
                    foundObject.geometry.location.lng()),
                map: self.gMaps,
                title: foundObject.name,
                draggable: false,
                // raiseOnDrag: true,
                labelContent: foundObject.name,
                labelAnchor: new google.maps.Point(-15, 35),
                labelClass: "label label-success found-marker",
                labelInBackground: false
            });


            self.markersObject[foundObject.id] = marker;
            return marker;
        }
        self.setMarkerOnMap = function (foundObject) {
            var marker = self.markersObject[foundObject.id];
            if (!marker) {
                marker = self.initMarker(foundObject);
            }
            return marker;
        }

        self.initGoogleMaps = function () {
            var mapOptions = {
                zoom: 12,
                center: new google.maps.LatLng(42.1825, -87.8069)
            };
            self.gMaps = new google.maps.Map($(".map-area")[0], mapOptions);
            self.placesService = new google.maps.places.PlacesService(self.gMaps);
            google.maps.event.addListener(self.gMaps, 'dragend', self.mapDragged);
            google.maps.event.addListener(self.gMaps, 'zoom_changed', self.mapDragged);
        }

        self.mapDragged = function () {
            self.searchNearby(false);
        }

        self.searchNearby = function (clearMarkers) {

            if (clearMarkers == undefined)
                clearMarkers = true;

            if (clearMarkers == true) {
                for (var i = 0; i < self.markersArray().length; i++) {
                    self.markersArray()[i].setMap(null);
                }
                self.markersObject = {};
            }

            var selectedType = $(".object-type > select").val();
            var request = {
                bounds: app.gMaps.getBounds(),
                types: [selectedType]
            };

            self.placesService.search(request, self.searchNearbyCompleted);
        }

        self.searchNearbyCompleted = function (results, status, a, b, c) {
            results.forEach(function (x) {
                self.setMarkerOnMap(x);
            });
        }






        self.init = function () {
            $(".apply-placeholder > a").click(function () {
                app.searchNearby();
            });
        }
        self.init();
        self.initGoogleMaps();
        return self;
    }

    window.app = searchModel();

});