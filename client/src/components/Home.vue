
<template>
<!--  <div class="row">-->
<!--    <form class="col s12">-->
<!--      <div class="row">-->
<!--        <div class="input-field col s12">-->
<!--          <input id="email" type="email" class="validate">-->
<!--          <label for="email">Город или населенный пункт</label>-->
<!--          <span class="helper-text" data-error="wrong" data-success="right">Helper text</span>-->
<!--        </div>-->
<!--      </div>-->
<!--    </form>-->
<!--  </div>-->
  <div class="hello">
    <h1>{{ msg }}</h1>
    <form class="form-inline mb-3" @submit.prevent="createItems">
      <div class="form-group mr-3">
        <label for="city" class="mr-3">Город или населенный пункт</label>
<!--        <input type="text" class="form-control" id="city1" name="city" data-dadata="city" v-model="form.city">-->
              <input type="text" id="city1" name="city" data-dadata="city">

      </div>
      <button class="btn btn-primary" type="submit" :disabled="!canCreate">Показать погоду</button>
    </form>

  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {
    msg: String
  },
  data() {
    return {
      loading: false,
      form: {
        city: '',
      },
      items: []
    }
  },
  computed: {
    canCreate() {
      return this.form.city.trim()
    }
  },
  methods: {
    async createItems() {
      const {...item} = this.form

      const newItem = await this.request('/api/items', 'POST', item)

      this.items.unshift(newItem)

      this.form.city = ''
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

        const response = await fetch(url, {
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
</style>
