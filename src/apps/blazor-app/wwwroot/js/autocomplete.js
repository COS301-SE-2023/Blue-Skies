function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -28, lng: 25 },
      zoom: 5.5,
      mapTypeControl: false,
    });
  
    const input = document.getElementById("pac-input");
  
    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
      types: [],
    };
  
    const autocomplete = new google.maps.places.Autocomplete(input, options);
  
  }
  
  window.initMap = initMap;