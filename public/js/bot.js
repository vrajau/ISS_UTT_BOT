(function(){
  let marker,
      previousCountryCode = null;
      map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 3
      }),
      geocoder = new google.maps.Geocoder;

  updateISSPosition();
  setInterval(_ => { updateISSPosition()}, 3500);

  /**
   * Update the map target
   */
  function moveToLocation(lat, lng){
      const center = new google.maps.LatLng(lat, lng);
      map.panTo(center);
  }

  /**
   * Draw a new marker at the given coordinates
   * @param {string] lat: the latitude
   * @param {string] lng: the longitude
   */
  function drawMarker(lat, lng) {
      const position = {lat: parseFloat(lat), lng: parseFloat(lng)};

      // replace the last marker icon by a simple point
      if(marker) {
          marker.setIcon({
              path: google.maps.SymbolPath.CIRCLE,
              scale: 2
          });
      }

      const markerIcon = new google.maps.MarkerImage(
          '/public/images/iss.png',
          new google.maps.Size(64, 64),
          new google.maps.Point(0, 0),
          new google.maps.Point(32, 32)
      );

      // create a new point with the last ISS coordinates
      marker = new google.maps.Marker({
          position,
          map,
          title: 'ISS !',
          icon: markerIcon
      });
  }

  /**
   * Make a request to get the last coordinates of the ISS
   */
  function updateISSPosition() {
    axios.get('http://api.open-notify.org/iss-now.json').then(position=>{

        const lat = position.data.iss_position.latitude;
        const lng = position.data.iss_position.longitude;

        // update the map
        moveToLocation(lat, lng);
        drawMarker(lat, lng);

        // get the name of the city of the current location
        // do nothing in the catch => it's simply because the location can't be found
        getCountryCode(parseFloat(lat), parseFloat(lng))

      })
  }

  /**
   * Make a request to get the country code of a city from his coordinates
   * Geocoding doc : https://developers.google.com/maps/documentation/javascript/geocoding?hl=FR
   */
  function getCountryCode(lat, lng) {

    axios.get(`http://api.geonames.org/findNearbyPostalCodesJSON?lat=${lat}&lng=${lng}&username=iss_utt_bot`)
      .then(geoname=>{
        if (geoname.data.postalCodes[0]) {
          const countryCode = geoname.data.postalCodes[0].countryCode;
          if (previousCountryCode != countryCode) {
            previousCountryCode = countryCode;
            getCountry(countryCode);
          }
        }
      })
  }
  /**
   * Make a request to get the language of a country from his country code
   */
  function getCountry(countryCode) {
      axios.get(`https://restcountries.eu/rest/v2/alpha/${countryCode.toLowerCase()}`).then(countries=>{
        translateMessage(countries.data.nativeName, countries.data.languages[0][Object.keys(countries.data.languages[0])[0]]);
      })
  }

  /**
   * Make a request to translate the default message into the country language
   */
  function translateMessage(countryName, languageCode) {
      const message = `The ISS is located above the ${countryName} !`;
      axios.get(`http://www.transltr.org/api/translate?text=${message}&to=${languageCode}&from=en`).then(translator=>{
        console.log(translator.data.translationText);
      })
  }

  function sendTweet(message) {
      console.log("tweet", message);
  }
})()
