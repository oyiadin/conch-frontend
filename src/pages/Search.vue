<template>
  <div class="container">
    <el-input v-model="queryStr" placeholder="请输入搜索内容"></el-input>
    <el-divider></el-divider>
    <ul>
      <li v-for="record in records" :key="record._id">
        <h2>
          <router-link :to="{ name: 'record', params: {key: record._id}}">
            {{ record.title }}
          </router-link>
        </h2>
      </li>
    </ul>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import axios from "axios";

export default {
  data () {
    return {
      queryStr: '',
      records: [],
    }
  },
  created () {
    this.debouncedGetQueryResults = debounce(this.getQueryResults, 1500)
  },
  watch: {
    queryStr () { this.debouncedGetQueryResults() }
  },
  methods: {
    getQueryResults() {
      axios.post('/api/search/record',
          null,
          {params: {'query_str': this.queryStr}})
        .then(resp => {
          this.records = resp.data.records
        })
    }
  }
}
</script>

<style scoped>

</style>