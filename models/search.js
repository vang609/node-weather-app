const fs = require('fs')
const axios = require('axios');

class Search {
  history = ["Charlotte", "Raleigh", "Durham"];
  dbPath = "./db/database.json";

  constructor() {
    this.readDB();
  }

  get capitalizeHistory() {
    return this.history.map((location) => {
      let words = location.split(" ");
      words = words.map((p) => p[0].toUpperCase() + p.substring(1));
      return words.join(" ");
    });
  }

  get paramsMapbox() {
    return {
      language: "en",
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
    };
  }

  get paramsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
    };
  }

  async city(locationSearch = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationSearch}.json`,
        params: this.paramsMapbox,
      });
      const resp = await instance.get();
      return resp.data.features.map((place) => ({
        id: place.id,
        name: place.place_name_en,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async weatherByLocation(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsWeather, lat, lon },
      });
      const resp = await instance.get();
      const { main, weather } = resp.data;
      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  addHistory(location = "") {
    if (this.history.includes(location.toLocaleLowerCase())) return;

    this.history.unshift(location.toLocaleLowerCase());
    this.saveDB();
  }

  saveDB() {
    const payload = {
      history: this.history,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);
    this.history = data.history;
  }
}


module.exports = Search;
