
<template>
  <div class="hello" v-cloak>
    <h1>{{ msg }}</h1>
    <form class="form-inline mb-3" @submit.prevent="createItems">
      <div class="form-group">
        <vue-dadata
            :query="inputQuery"
            placeholder="Начните вводить город или населенный пункт"
            :token="token"
            fromBound="city"
            toBound="city"
            :onChange="sendAddress"
        />
      </div>
      <button class="btn btn-primary" type="submit" >Показать погоду</button>
    </form>
    <div v-if="loading">
      <div style="display: flex;justify-content: center;align-items: center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

<!--    <div v-else-if="items.length">-->
<!--      <div v-for="item in items" v-bind:key="item.id">-->
<!--        <div class="row">-->
<!--          <div class="col s12 m7">-->
<!--            <div class="card">-->
<!--              <div class="card-content">-->
<!--                <span class="card-title grey-text text-darken-4">{{item.city}}<a class="waves-effect waves-teal btn-flat  grey-text text-darken-4" @click="removeItems(item.id)"><i class="material-icons medium right">close</i></a></span>-->
<!--                <p>I am a very simple card. I am good at containing small bits of information.-->
<!--                  I am convenient because I require little markup to use effectively.</p>-->
<!--              </div>-->
<!--              <div class="card-action">-->
<!--                <a href="#">Подробнее</a>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <div v-else-if="items.length">
      <div v-for="item in items" v-bind:key="item.id">
        <div class="col s12 m7">

          <div class="card horizontal ">
            <div class="card-image">
              <img src="https://lorempixel.com/100/190/nature/6">
            </div>
            <div class="card-stacked">
              <h2 class="header">{{item.city}}</h2>
              <a class="waves-effect waves-teal btn-flat grey-text" @click="removeItems(item.id)"><i class="material-icons medium right">close</i></a>

              <div class="card-content">
                <p>I am a very simple card. I am good at containing small bits of information.</p>
              </div>

              <div class="card-action">
                <a href="#">This is a link</a>
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
    msg: String
  },
  data() {
    return {
      token: '873caad551646c02d031085a569ed0503c168569',
      loading: false,
      city: '',
      inputQuery: '',
      items: [],
      coordinates: {
        latitude: '',
        longitude: ''
      },
      geo: {
        fullName: '',
        name: '',
        type: ''
      },
    }
  },
  computed: {
    canCreate() {
      console.log(this.geo.fullName)
      return this.geo.fullName
    }
  },
  methods: {
    sendAddress: function(suggestion) {
      const data = suggestion.data;

      const geo_full_name = data.city_with_type;
      const geo_name = data.city;
      const geo_type = data.city_type_full;

      const geo_lat = data.geo_lat;
      const geo_lon = data.geo_lon;

      this.coordinates.latitude = data.geo_lat
      this.coordinates.longitude = data.geo_lon

      this.geo.fullName = data.city_with_type
      this.geo.name = data.city
      this.geo.type = data.city_type_full

      console.log(geo_full_name);
      console.log(geo_name);
      console.log(geo_type);
      console.log(geo_lat);
      console.log(geo_lon);
    },
    async createItems() {
      console.log(this.geo)
      const {...item} = this.geo
      console.log(item)
      const newItem = await this.request('/api/items', 'POST', item)

      this.items.unshift(newItem)

      this.inputQuery = ''
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

.card-title {
  display: flex;
  justify-content: space-between;
}

</style>


