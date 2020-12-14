

var mapSwitch = function() {
    var element = document.createElement('div');
    element.style.bottom = '0.5em';
    element.style.left = '0.5em';
    element.style.width = '100px';
    element.style.height = '100px';
    element.classList.add('ol-control', 'ol-unselectable');
    var canvas = document.createElement('input');
    canvas.type = 'radio';
    canvas.name = 'renderer';
    this.canvas = canvas;
    var _this = this;
    canvas.addEventListener('click', function() {
    if (_this.getMap().getRenderer() instanceof ol.renderer.webgl.Map) {
        _this.getMap().setTarget(null);
        map = new ol.Map({
                target: 'map',
                layers: [tileLayer,tileWMS,viennaSat,vectorMap_landuse,polylineMap, vectorMap_busStop ],
                view: new ol.View({
        
                    center: ol.proj.fromLonLat([16.382900,48.211381]),
                    zoom: 14
                    
                })
            });

        map.getControls().forEach(function(control) {
            if (control instanceof ol.control.Zoom) {
                map.removeControl(control);
            }
            }, this);
    
        map.addControl(mousePositionControl);
        map.addControl(canvasControl);
    }

    

    });
    element.appendChild(canvas);
    element.appendChild(document.createTextNode('Canvas'));
    element.appendChild(document.createElement('br'));
    var webgl = document.createElement('input');
    webgl.type = 'radio';
    webgl.name = 'renderer';
    this.webgl = webgl;
    webgl.addEventListener('click', function() {
        if (_this.getMap().getRenderer() instanceof ol.renderer.canvas.Map) {
            _this.getMap().setTarget(null);
            map = new ol.WebGLMap({
                    target: 'map',
                    layers: [tileLayer,tileWMS,viennaSat,vectorMap_landuse,polylineMap, vectorMap_busStop],
                    view: new ol.View({
            
                        center: ol.proj.fromLonLat([16.382900,48.211381]),
                        zoom: 14
                        
                    })
                });

            map.getControls().forEach(function(control) {
                if (control instanceof ol.control.Zoom) {
                    map.removeControl(control);
                }
                }, this);
                map.addControl(mousePositionControl);
                map.addControl(canvasControl);
        
        
            
        }
///////
    });
    element.appendChild(webgl);
    element.appendChild(document.createTextNode('WebGL'));

    ol.control.Control.call(this, {
    element: element
    });
};
ol.inherits(mapSwitch, ol.control.Control);


var extent = [0,0,1024,968];
var projection = new ol.proj.Projection({
    code: 'xkcd-image',
    units: 'pixels',
    extent: extent
  });



////here I define the map, put it in the "map" container. This block
////below is responsible for visualizating the entire map
var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'http://demo.opengeo.org/geoserver/wms',
                params: {
                    layers: 'ned',
                    format: 'image/png'
                },
                wrapX: false,
                crossOrigin: 'anonymous'
            }),
            name: 'Elevation'
            }),
            new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://demo.opengeo.org/geoserver/wms',
                    params: {
                    layers: 'nlcd',
                    format: 'image/png'
                    },
                    wrapX: false,
                    crossOrigin: 'anonymous'
                }),
                name: 'Land Cover'
            })
    ],
    view: new ol.View({
        
        center: ol.proj.fromLonLat([16.382900,48.211381]),
        zoom: 14
        
    }),
    
});



////here I put the base map (OSM) in an object, named "tileLayer"
var tileLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

////here I put the web map server into a Tile object 
var tileWMS = new ol.layer.Tile({
    soure: new ol.source.TileWMS({
        projection: 'EPSG:4326',
        url: 'http://demo.boundlessgeo.com/geoserver/wms',
        params: {
            'LAYERS': 'ne:NE1_HR_LC_SR_W_DR'
        },
        extent: extent,
        projection: projection
    })
});


////here I remove the default zoom-in-out controls from the map
map.getControls().forEach(function(control) {
    if (control instanceof ol.control.Zoom) {
      map.removeControl(control);
    }
  }, this);

////here I create a pre-defined border and street style

var borderStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: "#ffa42e",
        width: 2
        
      })
})

var streetStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#fc8d59',
        width: 2
    })
})

var parkStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: '#000000',
        width: 1

    }),
    fill: new ol.style.Fill({
        color: '#ffffbf'
    })
    
})

var busStyle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#91bfdb'
        }),
        radius: 3,
        stroke: new ol.style.Stroke({
            color: '#000000',
            width: 1
        })

    })
})
////here I create a new vector layer, using GeoJSON, and make it use the 
////pre-defined border style
/*
var vectorMap = new ol.layer.Vector({
    source: new ol.source.Vector({

        url: 'https://openlayers.org/en/v5.1.3/examples/data/geojson/countries.geojson',
        format: new ol.format.GeoJSON(),
        
        extent: extent,
        projection: projection

    }),
    style: borderStyle
});
*/
////here I add another vector layer, using GeoJSON
////this is the parks, in the center of Vienna

var vectorMap_landuse = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'vienna_landuse_eliminated.geojson',
        format: new ol.format.GeoJSON(),
        extent: extent,
        projection: projection
    }),
    style: parkStyle
})

////here I add another GeoJSON layer, this is the bus stops in the center of Vienna

var vectorMap_busStop = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'bus_stops_cut.geojson',
        format: new ol.format.GeoJSON(),
        extent: extent,
        projection: projection
    }),
    style: busStyle
})


////here I create another vector layer, and put it in a ol.layer.Vector object, 
////using lines, and a pre-defined style as well
var polylineMap = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'vienna_clipped_roads.geojson',
        format: new ol.format.GeoJSON(),
        extent: extent,
        projection: projection
    }),
    style: streetStyle
    

    
})

////here I add a vector layer (point), the same way I just did
/*
var naturalearth = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: '/naturalearth/populated_places.json',
        format: new ol.format.GeoJSON(),
        extent: extent,
        projection: projection
    })
})

*/

////here I add a raster layer (a png-image). I have to geoposition it, and it's recommended
////to set an opacity value, lower than 1, so we can see the layer right under it
var viennaSat = new ol.layer.Image({
    source: new ol.source.ImageStatic({
        url: "becs_raster_corrected.png",
        imageSize: [1299, 794],
        imageExtent: ol.proj.transformExtent([16.3203, 48.1910, 16.4055, 48.2257], 'EPSG:4326','EPSG:3857')
    }),
    opacity: '1'
})

////here I create an object, so the map will show the coordinates of the mouse's 
////current position
var mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(4),
    projection: 'EPSG:4326',   
    target: document.getElementById('p_coordinates'),
    undefinedHTML: '&nbsp;'
});

////now I add each and every layer via the objects I created before


var canvasControl = new mapSwitch();

map.addLayer(tileLayer);
map.addLayer(tileWMS);
map.addLayer(viennaSat);
map.addLayer(vectorMap_landuse);
map.addLayer(polylineMap);
map.addLayer(vectorMap_busStop);
map.addControl(mousePositionControl);
map.addControl(canvasControl);


////here I create strings, and put the layer names into it.
////this is not neccessary (though strongly recommended) to
////type them accurately from the point of the script, as these strings will just only 
////be represented in a HTML paragraph

var baselayer = 'Geoserver WMS ne:NE1_HR_LC_SR_W_DR';  //this is the tileLayer
var layer_2 = 'vienna_landuse';   //this is the vectorMap
var layer_3 = 'vienna-streets.geojson';   // this is the polylineMap
var layer_4 = 'becs_raster.png';  //this is the viennaSat
var layer_5 = 'bus_stops_cut'; //this is the populated places layer from naturalearth
////now I put the strings into the paragraphs, defined in the HTML

document.getElementById("layer1_value").innerHTML = baselayer;
document.getElementById("layer2_value").innerHTML = layer_2;
document.getElementById("layer3_value").innerHTML = layer_3;
document.getElementById("layer4_value").innerHTML = layer_4;
document.getElementById("layer5_value").innerHTML = layer_5;

////now I create variables, which point to the specified checkbox elements

var checkbox_baselayer = document.getElementById('cb1');
var checkbox_layer2 = document.getElementById('cb2');
var checkbox_layer3 = document.getElementById('cb3');
var checkbox_layer4 = document.getElementById('cb4');
var checkbox_layer5 = document.getElementById('cb5');

////now I add an event listener to each checkbox.
////With these, the user can remove/re-add the layers with a click
checkbox_baselayer.addEventListener('change', function(){
    
    if(this.checked){
        tileLayer.setVisible(true);
        document.getElementById("layer1_value").style.color = "rgb(55,55,55)";
        document.getElementById("layer1_value").style.textDecoration = "none";
    } else {
        tileLayer.setVisible(false);
        document.getElementById("layer1_value").style.color = "red";
        document.getElementById("layer1_value").style.textDecoration = "line-through";
    }
})


checkbox_layer2.addEventListener('change', function(){
    
    if(this.checked){
        vectorMap_landuse.setVisible(true);
        document.getElementById("layer2_value").style.color = "rgb(55,55,55)";
        document.getElementById("layer2_value").style.textDecoration = "none";
    } else {
        vectorMap_landuse.setVisible(false);
        document.getElementById("layer2_value").style.color = "red";
        document.getElementById("layer2_value").style.textDecoration = "line-through";
    }
})

checkbox_layer3.addEventListener('change', function(){
    
    if(this.checked){
        polylineMap.setVisible(true);
        document.getElementById("layer3_value").style.color = "rgb(55,55,55)";
        document.getElementById("layer3_value").style.textDecoration = "none";
    } else {
        polylineMap.setVisible(false);
        document.getElementById("layer3_value").style.color = "red";
        document.getElementById("layer3_value").style.textDecoration = "line-through";
    }
})

checkbox_layer4.addEventListener('change', function(){
    
    if(this.checked){
        viennaSat.setVisible(true);
        document.getElementById("layer4_value").style.color = "rgb(55,55,55)";
        document.getElementById("layer4_value").style.textDecoration = "none";
    } else {
        viennaSat.setVisible(false);
        document.getElementById("layer4_value").style.color = "red";
        document.getElementById("layer4_value").style.textDecoration = "line-through";
    }
})


checkbox_layer5.addEventListener('change', function(){
    
    if(this.checked){
        vectorMap_busStop.setVisible(true);
        document.getElementById("layer5_value").style.color = "rgb(55,55,55)";
        document.getElementById("layer5_value").style.textDecoration = "none";
    } else {
        vectorMap_busStop.setVisible(false);
        document.getElementById("layer5_value").style.color = "red";
        document.getElementById("layer5_value").style.textDecoration = "line-through";
    }
})

var long = 19;
var lat = 47;
var center = [0,12];





function onClick(id, callback) {
    document.getElementById(id).addEventListener('click', callback);
  }



////with this controller, the user can re-set the view to the default
////position
onClick('zoomToCenter', function() {
    map.getView().animate({
      center: [1821534.6996524096, 6141657.733093851],
      duration: 2000,
      zoom: 14
    });
  });


////here I set two controllers, so the user can zoom in and out

var zoomType;
document.getElementById('zoomIn').onclick = function() {
    zoomType="customZoomIn";
};


document.getElementById('zoomOut').onclick = function(){
    zoomType="customZoomOut";
}




onClick('zoomOut', function(evt) {
    if(zoomType=="customZoomOut"){
         var view = map.getView();
         var zoom = view.getZoom();
         view.setZoom(zoom - 1);
    }

});


onClick('zoomIn', function(evt) {
    if(zoomType=="customZoomIn"){
        var view = map.getView();
        var zoom = view.getZoom();
        view.setZoom(zoom + 1);
   }
    
});

////export controller
   var controlButton = document.getElementById("export");
   var dataURL;
   controlButton.addEventListener('click', function(evt){
    ////
        map.once('postcompose', function (evt) {
        console.log(evt);
        var canvas;
        // here I check, whether browser uses canvas or webGL
            //here I check for canvas
        if(map instanceof ol.Map){
            canvas = evt.context.canvas;
        }   //here I check for WebGL
        else{
            canvas = evt.glContext.canvas_;
        }


        dataURL = canvas.toDataURL('image/png');
        });
        map.renderSync();

        map.setTarget(null);
        var image = document.createElement('img');
        image.src = dataURL;
        document.getElementById('map').appendChild(image); 
       
    ////
   });


   ////here is the rotation controller
   
var controlInput = document.getElementById('rotation');
   controlInput.addEventListener('change', function (evt) {
    var tbValue = document.getElementById('rotation').value;
    var radianValue = tbValue / 180 * Math.PI;
    map.getView().setRotation(radianValue);
});

///////////////////////////////////







////
