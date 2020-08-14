
<template>
  <div class="hello" v-cloak>
<!--    <h1>{{ msg }}</h1>-->
    <form class="form-inline mb-3" @submit.prevent="createItems"> <!--@keydown.enter="createItems"   v-on:update:query="inputQuery = $event" -->
      <div class="form-group">
        <vue-dadata
            v-if="!needClear"
            :query.sync="inputQuery"
            placeholder="Начните вводить город или населенный пункт"
            :token="token"
            fromBound="city"
            toBound="city"
            :onChange="getAddress"
        />
        <div class="row">
        <button v-if="!canCreate.length" class="btn btn-primary centre-align col s12" disabled>Показать погоду</button>
        <button v-else class="btn btn-primary centre-align col s12" type="submit" >Показать погоду</button>
          <div class="row center">&nbsp;</div>
        <a v-if="items.length" class="waves-effect waves-teal btn-flat right col s2 offset-s2" @click="removeAllItems">удалить все</a>
        </div>
      </div>

    </form>
    <div v-if="loading">
      <div class="progress">
        <div class="indeterminate"></div>
      </div>
    </div>

    <div v-if="items.length">
      <div v-for="item in items" v-bind:key="item.id">
        <div class="col s12 m7">

          <div class="card horizontal">
            <div class="card-image  weather-icon">
              <img  :src=item.weather.icon>
            </div>

            <div class="card-stacked">
              <a class="close-btn waves-effect waves-teal btn-flat grey-text pulse" @click="removeItems(item.id)"><i class="material-icons medium right">close</i></a>
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
      loading: true,
      needClear: false,
      inputQuery: '',
      inputQ: '',
      items: [],
      geo: {
        fullName: '',
        name: '',
        type: '',
        coordinates: {
          latitude: '',
          longitude: ''
        },
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
        },
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
      this.geo.coordinates.latitude = data.geo_lat
      this.geo.coordinates.longitude = data.geo_lon
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

      const result = await fetch(queryURL, options)
      const res = await result.json()

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
    },

    async createItems() {

      this.loading = true
      await this.getWeather(this.geo.coordinates.latitude, this.geo.coordinates.longitude)
      this.loading = false

      const {...item} = this.geo

      const newItem = await this.request('/api/items', 'POST', item)

      this.items.unshift(newItem)

      this.needClear = true
      this.$nextTick(function () {
        this.needClear = false
      })
      this.canCreate = ''
    },

    async removeItems(id) {
      await this.request(`/api/items/${id}`, 'DELETE')
      this.items = this.items.filter(c => c.id !== id)
    },

    async removeAllItems() {
      this.loading = true
      this.items.forEach(el => this.removeItems(el.id))
      this.loading = false
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
  color: #9e9e9e;
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


