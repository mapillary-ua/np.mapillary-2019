// inspired by @jesolem, https://github.com/jesolem/mytown
$("#list-btn").click(function () {
    $("#aboutModal").modal("show");
    return false;
});

$("#updInfo").load("data/upd.json");

function placeNumber(value, row, index) {
    return 1 + index;
};

function linkUserName(value, row) {
    return '<a target="_blank" href="https://www.mapillary.com/app/user/' + value + '">' + value + '</a>';
};

function panameReplace(value, row, index) {
    var pacontent = '';
    for (key in value) {
        var paname = key;
        var osmid = value[key];

        var osmtype = 'way';

        if (parseInt(osmid) < 0) {
            osmtype = 'relation';
            osmid = parseInt(osmid) * (-1);
        };

        var paurl = '<a target="_blank" href="http://www.openstreetmap.org/' + osmtype + '/' + osmid + '">' + paname + '</a>, ';
        pacontent = pacontent + paurl;
    };

    return pacontent.slice(0, -2);
};

mapboxgl.accessToken = 'pk.eyJ1IjoiaGFzdCIsImEiOiJjamozeHF4aWswMDF3NDFrNWFnM25lY2I1In0.qet-_YLCdjKFyCdifNdZaQ';

if (!mapboxgl.supported()) {
    $("#warningModal").modal("show");
} else {
    console.log('Your browser supported Mapbox GL');
    $("#aboutModal").modal("show");
};

var pLocation = {
    "1": {
        center: [30.4637, 50.4504],
        p_key: '-ufEmeSAixaqJ9LZpFymiA'
    },
    "2": {
        center: [30.4216, 50.4740],
        p_key: '2GDRafBmQYuHK7rtcFYlGA'
    },
    "3": {
        center: [36.2433, 50.0742],
        p_key: '8jrMyxOBgUhkmZodkd0WGA'
    },
    "4": {
        center: [35.1921, 50.1210],
        p_key: 'k2zzEGm8S7Zqis491VzQYw'
    }
};

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
};

var locNumber = randomInteger(1, 3);

var center = pLocation[locNumber].center,
    p_key = pLocation[locNumber].p_key;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/hast/cjjwpl3mf3o6y2spfabxkjh7i',
    center: center,
    zoom: 4
});

map.addControl(new mapboxgl.NavigationControl({
    position: 'top-left'
}));

var markerSource = {
    type: 'geojson',
    data: {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: center
        },
        properties: {
            title: 'You\'re here!',
            'marker-symbol': 'marker'
        }
    }
};


map.on('style.load', function () {
    initLayers();
});


function initLayers() {
    // photo position marker    
    map.addSource('markers', markerSource);
    map.addLayer({
        'id': 'markers',
        'type': 'symbol',
        'source': 'markers',
        'layout': {
            'icon-image': '{marker-symbol}-15',
            'text-field': '{title}',
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top'

        },
        'paint': {
            'text-halo-color': '#FFFFFF',
            'text-halo-width': 1.5
        }
    });
};

var mly = new Mapillary.Viewer('mly', 'WTlZaVBSWmxRX3dQODVTN2gxWVdGUTowNDlmNDBhNjRhYmM3ZmVl', p_key, {
    component: {
        cover: false,
    }
});

mly.on('nodechanged', function (node) {
    var lnglat = [node.latLon.lon, node.latLon.lat];
    var data = {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: lnglat
        },
        properties: {
            title: 'You\'re here!',
            'marker-symbol': 'marker'
        }
    };

    map.getSource('markers').setData(data);
    map.flyTo({
        center: lnglat,
        zoom: 15
    });
});

map.on('click', function (e) {
    mly.moveCloseTo(e.lngLat.lat, e.lngLat.lng);
});