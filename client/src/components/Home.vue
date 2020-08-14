<template>
  <div class="hello" v-cloak>
    <!--    <h1>{{ msg }}</h1>-->
    <form class="form-inline mb-3" @submit.prevent="createItems">
      <!--@keydown.enter="createItems"   v-on:update:query="inputQuery = $event" -->
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
          <button v-if="!canCreate.length" class="btn btn-primary centre-align col s12" disabled>Показать погоду
          </button>
          <button v-else class="btn btn-primary waves-effect waves-teal centre-align col s12" type="submit">Показать
            погоду
          </button>
          <span v-if="itemExist.length">Похоже, что в списке уже есть <a :href="itemExistId">{{ itemExist }}</a></span>
          <div class="row center">&nbsp;</div>
          <a v-if="items.length" class="waves-effect waves-teal clear-all btn-flat right col s2 offset-s2"
             @click="removeAllItems">удалить все</a>
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

          <div class="card horizontal" :id="item.id">
            <div class="card-stacked">
              <a class="close-btn waves-effect waves-teal btn-flat grey-text pulse" @click="removeItems(item.id)"><i
                  class="material-icons medium right">close</i>
              </a>
              <h5 class="left header">{{ item.type }} {{ item.name }}</h5>
              <div class="row weather-info">
                <div class="col s4">
                  <div class="left card-image weather-icon">
                    <img :src=item.weather.icon alt="weather">
                  </div>
                  <h3 class="left temp-header">{{ item.weather.temp }} &#176;С</h3>
                </div>
                <div class="col s4">
                  <p class="left grey-text left-align"><span class="black-text">{{ item.weather.condition }}</span><br>ощущается
                    как <span class="black-text">{{ item.weather.feelsTemp }}	&#176;С</span><br>ветер <span
                        class="black-text">{{ item.weather.windSpeed }} м/с</span></p>
                </div>
                <div class="col s4">
                  <p class="black-text suggest right-align">
                    {{ item.weather.suggest }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="card horizontal" :id="item.id">
            <div class="card-stacked">
              <a class="close-btn waves-effect waves-teal btn-flat grey-text pulse" @click="removeItems(item.id)"><i
                  class="material-icons medium right">close</i>
              </a>
              <h5 class="left">{{ item.type }} {{ item.name }}</h5>
              <div class="row">
                <div class="card-image  weather-icon">
                  <img :src=item.weather.icon alt="weather">
                </div>
                <h3>{{ item.weather.temp }} &#176;С</h3>
              </div>

              <div class="card-content">
                <span>{{ item.weather.condition }} </span>

              </div>

              <div class="card-action">
                <a :href=item.weather.url target="_blank">Подробнее</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
          daytime: '',
          suggest: '',
          url: ''
        },
      },
      canCreate: '',
      itemExist: '',
      itemExistId: '',
    }
  },

  methods: {
    async getRuCondition(condition) {

      let ruCondition

      switch (condition) {
        case 'clear':
          ruCondition = 'ясно'
          break
        case 'partly-cloudy':
          ruCondition = 'малооблачно'
          break
        case 'cloudy':
          ruCondition = 'облачно с прояснениями'
          break
        case 'overcast':
          ruCondition = 'пасмурно'
          break
        case 'drizzle':
          ruCondition = 'морось'
          break
        case 'light-rain':
          ruCondition = 'небольшой дождь'
          break
        case 'rain':
          ruCondition = 'дождь'
          break
        case 'moderate-rain':
          ruCondition = 'умеренно сильный дождь'
          break
        case 'heavy-rain':
          ruCondition = 'сильный дождь'
          break
        case 'continuous-heavy-rain':
          ruCondition = 'длительный сильный дождь'
          break
        case 'showers':
          ruCondition = 'ливень'
          break
        case 'wet-snow':
          ruCondition = 'дождь со снегом'
          break
        case 'light-snow':
          ruCondition = 'небольшой снег'
          break
        case 'snow':
          ruCondition = 'снег'
          break
        case 'snow-showers':
          ruCondition = 'снегопад'
          break
        case 'hail':
          ruCondition = 'град'
          break
        case 'thunderstorm':
          ruCondition = 'гроза'
          break
        case 'thunderstorm-with-rain':
          ruCondition = 'дождь с грозой'
          break
        case 'thunderstorm-with-hail':
          ruCondition = 'гроза с градом'
          break
      }

      return ruCondition
    },

    async clothingSuggest(feelTemp, condition, daytime) {

      let firstAdvice
      let secondAdvice

      switch (condition) {
        case 'drizzle':
          secondAdvice = ' , возможно стоит взять с собой зонт'
          break
        case 'light-rain':
          secondAdvice = ' , возможно стоит взять с собой зонт'
          break
        case 'rain':
          secondAdvice = ' и взять зонт'
          break
        case 'moderate-rain':
          secondAdvice = ' и взять зонт'
          break
        case 'heavy-rain':
          secondAdvice = ' , обуть резиновые сапоги и взять зонт'
          break
        case 'continuous-heavy-rain':
          secondAdvice = ', обуть резиновые сапоги, надеть плащ или взять зонт'
          break
        case 'showers':
          secondAdvice = ' и взять зонт'
          break
        case 'hail':
          secondAdvice = '. Возможно стоит остаться дома'
          break
        case 'thunderstorm':
          secondAdvice = '. Возможно стоит остаться дома'
          break
        case 'thunderstorm-with-rain':
          secondAdvice = ' , также надеть плащ или взять зонт. Возможно стоит остаться дома'
          break
        case 'thunderstorm-with-hail':
          secondAdvice = '. Возможно стоит остаться дома'
          break
        default:
          secondAdvice = ''
      }

      if (daytime === 'd' && condition === 'clear') {
        secondAdvice = ' , возможно стоит надеть солнцезащитные очки'
      }

      if (feelTemp < -15) {
        firstAdvice = 'нужно надеть зимнюю утепленную куртку';
      } else if (feelTemp <= 0) {
        firstAdvice = 'стоит надеть зимнюю куртку';
      } else if (feelTemp > 0 && feelTemp <= 10) {
        firstAdvice = 'можно выйти в куртке';
      } else if (feelTemp > 10 && feelTemp <= 15) {
        firstAdvice = 'стоит надеть легкую куртку или кофту';
      } else if (feelTemp > 15 && feelTemp <= 20) {
        firstAdvice = 'можно выйти в футболке, но стоит подумать о длином рукаве';
      } else if (feelTemp > 20 && feelTemp < 25) {
        firstAdvice = 'можно выйти в футболке';
      } else {
        firstAdvice = 'можно выйти в футболке и шортах';
      }

      return `Сегодня ${firstAdvice}${secondAdvice}`
    },

    getAddress: function (suggestion) {
      const data = suggestion.data;

      this.geo.fullName = data.city_with_type
      this.geo.name = data.city
      this.geo.type = (data.city_type_full === 'город') ? '' : data.city_type_full
      this.geo.coordinates.latitude = data.geo_lat
      this.geo.coordinates.longitude = data.geo_lon
      this.canCreate = this.geo.fullName

      this.items.forEach(el => {
        if (el.fullName === this.geo.fullName) {
          this.itemExist = this.geo.fullName
          this.itemExistId = `#${el.id}`
          this.canCreate = ''
        }
      })
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
      this.geo.weather.condition = await this.getRuCondition(res.fact.condition)
      this.geo.weather.suggest = await this.clothingSuggest(res.fact.feels_like, res.fact.condition, res.fact.daytime)
      this.geo.weather.precType = res.fact.prec_type
      this.geo.weather.windSpeed = res.fact.wind_speed
      this.geo.weather.humidity = res.fact.humidity
      this.geo.weather.icon = `https://yastatic.net/weather/i/icons/blueye/color/svg/${res.fact.icon}.svg`
      this.geo.weather.phenomCondition = res.fact.phenom_condition
      this.geo.weather.phenomIcon = res.fact.phenom_icon
      this.geo.weather.url = res.info.url
    },

    async createItems() {

      if (!this.itemExist) {
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
      }

    },

    async removeItems(id) {
      await this.request(`/api/items/${id}`, 'DELETE')
      this.items = this.items.filter(c => c.id !== id)
    },

    async removeAllItems() {
      this.loading = true
      this.needClear = true
      this.$nextTick(function () {
        this.needClear = false
      })
      this.canCreate = ''
      this.itemExist = ''
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

.clear-all {
  text-align: right;
  color: #9e9e9e;
}

.header {
  display: flex;
  margin: 0 0 24px 24px;
}

.weather-info {
  margin-left: 0;
}

.temp-header {
  /*margin: 0;*/
}

.bold {
  font-weight: bold;
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

.suggest {
  margin-right: 18px;
}

.close-btn > i {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 -50% 0 0;
  transform: translate(-50%, -50%)
}


</style>


