


function getLabelDate(label){
    // Convierte la etiqueta del plugin en fecha para comparar

    switch (label) {
        case 'Enero':
            return new Date(2012, 1, 31)
            break;
        case 'Febrero':
            return new Date(2012, 2, 28)
            break;
        case 'Marzo':
            return new Date(2012, 3, 31)
            break;
        case 'Abril':
            return new Date(2012, 4, 30)
            break;
        case 'Mayo':
            return new Date(2012, 5, 31)
            break;
        case 'Junio':
            return new Date(2012, 6, 30)
            break;
        case 'Julio':
            return new Date(2012, 7, 31)
            break;
        case 'Agosto':
            return new Date(2012, 8, 31)
            break;
        case 'Septiembre':
            return new Date(2012, 9, 30)
            break;
        case 'Octubre':
            return new Date(2012, 10, 31)
            break;
        case 'Noviembre':
            return new Date(2012, 11, 30)
            break;
        case 'Diciembre':
            return new Date(2012, 12, 31)
            break;
      }
      

}





async function main(){

    var map = L.map('map', {
        zoom: 11,
        center: [19.3, -99.1],
    });
    

    let mapBase = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);



    var data = await fetch("./data/2012_Earthquakes_Mag5.json")
    var dataJSON = await data.json();
    var dataEarthQuakes = dataJSON;
    


    var earthQuakesJSON = null


    function addEarthQuakes({label,value,map,exclamation}){
        

        if(dataEarthQuakes !== undefined){


            map.eachLayer(function (layer){
                if( layer instanceof L.Marker){
                    map.removeLayer(layer)
                }
            })
            

            filteredData = dataEarthQuakes.features.filter((feature,n)=>{
    
                var labelDate = getLabelDate(label)

                // Debido a que se esta usando el plugin Leaflet.TimeLine
                // Una de la manera más sencillas de resolver las incongruencias entre fechas
                // Es convetir siempre la marca temporal a ISO
        
                // Para estos datos en particular, la marca temporal esta en el nombre
                

                var arrayName = feature.properties.Name.split(" ")
                var dateFromName = arrayName.slice(3, 6).join(' ').replace(',','')
                var dateFeature = new Date(dateFromName)
               
                
                if(dateFeature <= labelDate)
                    return true
                else
                    return false
            }) 
    
    
            var markerArray = []


            earthQuakesJSON = L.geoJSON(filteredData, {
                onEachFeature: function(feature,layer){
                    var arrayName = feature.properties.Name.split(" ")

                    var magnitud = arrayName.slice(1,2)
                    var fecha = arrayName.slice(3, 6).join(' ').replace(',','')
                    var lugar = arrayName.slice(6).join(' ')

                    content = `Magnitud: ${magnitud} <br> Fecha: ${fecha} <br> Lugar: ${lugar}`

                    var popup = L.popup().setContent(content)

                    layer.bindPopup(popup)

                    markerArray.push(layer)
        
                    
                }
            
            }).addTo(map);
        
            capas_tematicas['Temblores Mundiales 2012'] =  earthQuakesJSON

            var markerGroup = L.featureGroup(markerArray)


        }
  
    
    }



    let pluginTimeLineControl = L.control.timelineSlider({
        timelineItems: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
        changeMap: addEarthQuakes, 
    })

    L.easyButton('<img src="/img/location-crosshairs-solid.svg">', function(btn, map){
        map.setView([19.3, -99.1],11);
    },'Home').addTo(map);

    var stateChangingButton = L.easyButton({
        states: [{
                stateName: 'activate-plugin',        // name the state
                icon:      '<img src="/img/house-crack-solid.svg">',               
                title:     'Show Earthquakes',      // like its title
                onClick: function(btn, map) {       // and its callback
                    map.addControl(pluginTimeLineControl)
                    btn.state('deactivate-plugin');    // change state on click!
                }
            }, {
                stateName: 'deactivate-plugin',
                icon:      '<img src="/img/house-solid.svg">',
                title:     'Hide Earthquakes',
                onClick: function(btn, map) {
                    map.removeControl(pluginTimeLineControl);
                    map.removeLayer(earthQuakesJSON)
                    btn.state('activate-plugin');
                }
        }]
    });


    stateChangingButton.addTo(map);

    L.control.layers(capas_base,capas_tematicas)
}




main()





