<template>
  <div class="person" v-if="!empty">
    <div class="person-header">
      <h1 class="person-names">
        <span class="person-names-main">
          {{ person.name }}
        </span>
      </h1>
    </div>
    <div class="person-main">
      <div class="person-section">
        <h2 class="person-section-header">发表文献</h2>
        <div class="person-section-content">
          <ul class="query-results">
            <li v-for="paperId in person.papers" :key="paperId">
              <div v-if="papers[paperId]">
                <div class="record-title">
                  <router-link :to="{ name: 'record', params: {key: papers[paperId]._id}}">
                    {{ papers[paperId].title }}
                  </router-link>
                </div>
                <div class="record-authors">
                  <span v-for="author in papers[paperId].authors" :key="author.name">
                    <router-link :to="{ name: 'person', params: {key: author.ids[0]}}"
                                 custom v-slot="{ navigate, href }">
                      <el-link :href="href" @click="navigate" :underline="false"
                               :disabled="author.ids[0] === $route.params.key">
                        <i v-if="author.ids[0] === $route.params.key">
                          {{ author.name }}
                        </i>
                        <template v-else>
                          {{ author.name }}
                        </template>
                      </el-link>
                    </router-link>
                  </span>
                </div>
                <div class="record-abstract">
                  {{ papers[paperId].shortAbstract }}
                </div>
                <div class="record-metadata">
                  <span v-if="papers[paperId].doi">
                    <el-link href="https://doi.org/{{ papers[paperId].doi }}" target="_blank">
                      doi:{{ papers[paperId].doi }}
                    </el-link>
                  </span>
                  <span v-for="field in papers[paperId].fieldsOfStudy" :key="field">
                    <i>{{ field }}</i>
                  </span>
                  <span class="record-journal-name" v-if="papers[paperId].journalName">
                    <strong>Journal: </strong>
                    {{ papers[paperId].journalName }}
                  </span>
                  <span class="record-year" v-if="papers[paperId].year">
                    {{ papers[paperId].year }}
                  </span>
                </div>
              </div>
              <div v-else>
                <el-skeleton :rows="1" animated />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <el-empty description="数据为空"></el-empty>
  </div>
</template>

<script>
import axios from "axios";
import { ElMessage } from 'element-plus';

export default {
  name: 'Record',
  components: {},
  data() {
    return {
      person: {},
      papers: {},
      empty: true,
    }
  },
  mounted() {
    this.loadData()
  },
  beforeRouteUpdate(to, from, next) {
    this.loadData(to)
    next()
  },
  methods: {
    async loadData(route) {
      if (!route)
        route = this.$route
      axios.get(`/api/author/${route.params.key}`)
          .then(async (res) => {
            this.person = res.data
            for (let paperId of res.data.papers) {
              try {
                const resp = await axios({
                  url: `/api/record/${paperId}`,
                  method: 'GET',
                  params: {no_record_history: true}
                })
                this.papers[paperId] = resp.data
              } catch (err) {
                console.error(err)
              }
            }
            this.empty = false
          })
          .catch((reason) => {
            ElMessage.error("载入失败：" + reason)
            this.empty = true
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
.record-authors > span:after {
  content: ', ';
}
.record-authors > span:last-child:after {
  content: '';
}
.record-authors > span:hover {
  text-decoration: underline;
}
.record-metadata span:after {
  content: '; ';
}
.record-metadata span:last-child:after {
  content: '';
}
</style>
