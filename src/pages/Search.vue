<template>
  <div class="container">
    <el-input v-model="queryStr" placeholder="请输入搜索内容"
              @keyup.enter="getQueryResults"></el-input>
    <el-divider></el-divider>
    <ul class="query-results">
      <li v-for="record in records" :key="record._id">
        <div class="record-title">
          <router-link :to="{ name: 'record', params: {key: record._id}}">
            {{ record.title }}
          </router-link>
        </div>
        <div class="record-authors">
          <router-link v-for="author in record.authors" :key="author.name"
                       :to="{ name: 'person', params: {key: author.ids[0]}}">
            {{ author.name }}
          </router-link>
        </div>
        <div class="record-abstract">
          {{ record.shortAbstract }}
        </div>
        <div class="record-metadata">
          <span v-if="record.doi">
            <el-link href="https://doi.org/{{ record.doi }}" target="_blank">
              doi:{{ record.doi }}
            </el-link>
          </span>
          <span v-for="field in record.fieldsOfStudy" :key="field">
            <i>{{ field }}</i>
          </span>
          <span class="record-journal-name" v-if="record.journalName">
            <strong>Journal: </strong>
            {{ record.journalName }}
          </span>
          <span class="record-year" v-if="record.year">
            {{ record.year }}
          </span>
        </div>
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
    this.debouncedGetQueryResults = debounce(this.getQueryResults, 1000)
  },
  watch: {
    queryStr () {
      if (this.queryStr.endsWith(' ')) {
        this.getQueryResults()
      } else {
        this.debouncedGetQueryResults()
      }
    }
  },
  methods: {
    getQueryResults() {
      axios.post('/api/search/record',
          null,
          {params: {'query_str': this.queryStr}})
        .then(resp => {
          for (let record of resp.data.records) {
            let index = record.paperAbstract.indexOf(' ', 100)
            if (index !== -1) {
              record.shortAbstract = record.paperAbstract.slice(0, index) + '...'
            } else {
              record.shortAbstract = record.paperAbstract
            }
          }
          this.records = resp.data.records
        })
    }
  }
}
</script>

<style scoped>
.query-results {
  list-style: none;
  padding: 0;
  margin: 0;
}
.query-results li {
  margin-bottom: 20px;
  padding-bottom: 5px;
  border-bottom: 1px solid black;
}
.query-results li:hover {
  background-color: #f0f0f0;
}
.query-results li * {
  color: #2c3e50 !important;
}
.query-results li a {
  text-decoration: none;
}
.record-title {
  font-weight: bold;
}
.record-authors a:after {
  content: ', ';
}
.record-authors a:last-child:after {
  content: '';
}
.record-metadata span:after {
  content: '; ';
}
.record-metadata span:last-child:after {
  content: '';
}
</style>