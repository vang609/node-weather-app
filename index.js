require("dotenv").config();

const { readInput, inquirerMenu, pausa, listCities } = require("./helpers/inquirer");
const Search = require("./models/search");

console.log("Weather App");

const main = async () => {
  const search = new Search();
  let opt;
  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // Show msg
        const location = await readInput("City: ");
        // console.log(location)
        const locations = await search.city(location);
        const id = await listCities(locations)
        if(id === '0') continue;

        const locationSelected = locations.find( l => l.id === id)
        search.addHistory( locationSelected.name)
        const weather = await search.weatherByLocation(locationSelected.lat, locationSelected.lng)

        console.clear();
        console.log("\nCity information\n".green);
        console.log("City: ", locationSelected.name.green);
        console.log("Lat: ", locationSelected.lat);
        console.log("Lng: ", locationSelected.lng);
        console.log("Temperature: ", weather.temp);
        console.log("Min: ", weather.min);
        console.log("Max: ", weather.max);
        console.log("Description: ", weather.desc.green);
        break;

        case 2:
                 search.capitalizeHistory.forEach((location, i) => {
                   const idx = `${i + 1}.`.green;
                   console.log(`${idx} ${location} `);
                 });

        break;
    }
    if (opt != 0) await pausa();
  } while (opt != 0);
};

main();
