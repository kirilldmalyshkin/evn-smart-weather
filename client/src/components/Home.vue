
<template>
  <div class="hello" v-cloak>
    <h1>{{ msg }}</h1>
    <form class="form-inline mb-3" @submit.prevent="createItems"> <!--@keydown.enter="createItems"   v-on:update:query="inputQuery = $event" -->
      <div class="form-group">
        <vue-dadata
            :query="inputQuery"
            v-on:query.sync="inputQuery"
            placeholder="Начните вводить город или населенный пункт"
            :token="token"
            fromBound="city"
            toBound="city"
            :onChange="getAddress"
        />
        <button v-if="!canCreate.length" class="btn btn-primary" disabled>Показать погоду</button>
        <button v-else class="btn btn-primary" type="submit" >Показать погоду</button>
      </div>

    </form>
    <div v-if="loading">
      <div style="display: flex;justify-content: center;align-items: center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <div v-else-if="items.length">
      <div v-for="item in items" v-bind:key="item.id">
        <div class="col s12 m7">

          <div class="card horizontal">
            <div class="card-image weather-icon">
              <img  :src=item.weather.icon>
            </div>

            <div class="card-stacked">
              <a class="close-btn waves-effect waves-teal btn-flat grey-text" @click="removeItems(item.id)"><i class="material-icons medium right">close</i></a>
              <h4 class="header">{{item.type}} {{item.name}}</h4>
              <div class="card-content">
                <p>{{ item.weather.temp }}</p>
              </div>

              <div class="card-action">
                <a :href=item.weather.url target="_blank">Подробнее</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-else>Начните вводить населенный пункт в котором хотите узнать погоду и нажмите на кнопку</p>
    <div>
  </div>
  </div>
</template>

<script>
import VueDadata from 'vue-dadata'

export default {
  name: 'Home',
  components: {
    'vue-dadata': VueDadata
  },
  props: {
    msg: String,
  },
  data() {
    return {
      token: '873caad551646c02d031085a569ed0503c168569',
      loading: false,
      inputQuery: '',
      inputQ: '',
      items: [],
      coordinates: {
        latitude: '',
        longitude: ''
      },
      geo: {
        fullName: '',
        name: '',
        type: '',
        weather: {
          temp: '',
          feelsTemp: '',
          condition: '',
          precType: '',
          windSpeed: '',
          humidity: '',
          icon: '',
          phenomIcon: '',
          phenomCondition: '',
          url: ''
        }
      },
      canCreate: '',
    }
  },

  methods: {
    getAddress: function(suggestion) {
      const data = suggestion.data;

      this.geo.fullName = data.city_with_type
      this.geo.name = data.city
      this.geo.type = data.city_type_full

      this.coordinates.latitude = data.geo_lat
      this.coordinates.longitude = data.geo_lon

      // console.log(this.geo.fullName);
      // console.log(this.geo.name);
      // console.log(this.geo.type);
      // console.log(this.coordinates.latitude);
      // console.log(this.coordinates.longitude);
      this.canCreate = this.geo.fullName

    },

    async getWeather(lat, lon) {
      const originalURL = `https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}&lang=ru_RU&limit=7&hours=true&extra=true`
      const queryURL = `https://cors-anywhere.herokuapp.com/${originalURL}`

      const key = "b44dec24-8072-44f4-a47a-074278274945";

      const options = {
        method: "GET",
        headers: {
          "X-Yandex-API-Key": key
        },
      }

      fetch(queryURL, options)
          .then(response => response.text())
          .then(result => {
            const res = JSON.parse(result)
            this.geo.weather.temp = res.fact.temp
            this.geo.weather.feelsTemp = res.fact.feels_like
            this.geo.weather.condition = res.fact.condition
            this.geo.weather.precType = res.fact.prec_type
            this.geo.weather.windSpeed = res.fact.wind_speed
            this.geo.weather.humidity = res.fact.humidity
            this.geo.weather.icon = `https://yastatic.net/weather/i/icons/blueye/color/svg/${res.fact.icon}.svg`
            this.geo.weather.phenomCondition = res.fact.phenom_condition
            this.geo.weather.phenomIcon = res.fact.phenom_icon
            this.geo.weather.url = res.info.url
            console.log(res.info.url)
            console.log(res.fact.temp)
            console.log(res.fact.feels_like)
            console.log(res.fact.condition)
            console.log(res.fact.prec_type)
            console.log(res.fact.wind_speed)
            console.log(res.fact.humidity)
            console.log(this.geo.weather.icon)
            console.log(res.fact.phenom_condition)
            console.log(res.fact.phenom_icon)
          })
          .catch(error => console.log("error", error));
    },

    async createItems() {

      const x = await this.getWeather(this.coordinates.latitude, this.coordinates.longitude)

      console.log(x)

      const {...item} = this.geo

      const newItem = await this.request('/api/items', 'POST', item)

      this.items.unshift(newItem)
      //
      // this.$emit("update:inputQuery",'')
      // this.$emit("update:inputQuery",'')
      this.$emit('update:query', 'this.inputQuery')

      // this.canCreate = ''
    },

    async removeItems(id) {
      await this.request(`/api/items/${id}`, 'DELETE')
      this.items = this.items.filter(c => c.id !== id)
    },

    async request(url, method = 'GET', data = null) {
      try {
        const headers = {}
        let body

        if (data) {
          headers['Content-Type'] = 'application/json'
          body = JSON.stringify(data)
        }

        const response = await fetch(`http://localhost:8081${url}`, {
          method,
          headers,
          body
        })
        return await response.json()
      } catch (e) {
        console.warn('Error:', e.message)
      }
    }
  },

  async mounted() {
    this.loading = true
    this.items = await this.request('/api/items')
    this.loading = false
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

[v-cloak] {
  display: none;
}

.weather-icon {
  display: block;
  width: 125px;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.close-btn {
  display: block;
  padding: 24px;
  margin-left: auto;
  position: relative
}

.close-btn > i {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 -50% 0 0;
  transform: translate(-50%, -50%)
}



</style>


