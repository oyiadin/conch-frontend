<template>
  <div class="record" v-if="!empty">
    <div class="record-header">
      <h1 class="record-title">
        <span class="record-title-content">
          {{ record.title }}
        </span>
        <span class="record-title-info">
          <el-tooltip placement="right">
          <template #content>
            <div class="record-title-info-popup">
              <div class="record-title-info-popup-doi" v-if="record.doi">
                <a :href="'https://doi.org/' + record.doi">doi:{{ record.doi }}</a>
              </div>
              <div class="record-title-info-popup-booktitle">
                {{ record.journalName }} {{ record.year }}
              </div>
            </div>
          </template>
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
        </span>
      </h1>
      <div class="record-authors">
        <el-space :size="10" wrap class="record-authors">
          <div v-for="author in record.authors" :key="author.name">
            <router-link :to="{ name: 'person', params: {key: author.ids[0]}}">
              {{ author.name }}
            </router-link>
          </div>
        </el-space>
      </div>
      <div class="record-tags">
        <el-space :size="10" wrap class="record-tags">
          <div v-for="i in 5" :key="i" class="record-tag-item">
            <el-link>
              <i class="el-icon-collection-tag"></i>
              <span style="margin-left: 0">个性化推荐</span>
            </el-link>
          </div>
          <div class="record-tag-item record-tags-more">
            <el-link>
              <span>更多 (4+)</span>
            </el-link>
          </div>
        </el-space>
      </div>
    </div>
    <div class="record-main">
      <div class="record-section">
        <h2 class="record-section-header">摘要</h2>
        <div class="record-section-content">
          {{ record.paperAbstract }}
        </div>
      </div>
      <div class="record-section">
        <h2 class="record-section-header">相似论文</h2>
        <div class="record-section-content" v-loading="loadingRecommendIds">
          <ul class="query-results">
            <li v-for="index in ((remainCount < 10) ? remainCount : 10)"
                :key="index + (currentPage - 1) * 10">
              <template v-for="record in [papers[recommendIds[index - 1 + (currentPage - 1) * 10]]]" :key="record">
                <div v-if="record">
                  <div class="record-title">
                    <router-link :to="{ name: 'record', params: {key: record._id}}">
                      {{ record.title }}
                    </router-link>
                  </div>
                  <div class="record-authors">
                    <span v-for="author in record.authors" :key="author.name">
                      <router-link :to="{ name: 'person', params: {key: author.ids[0]}}"
                                   custom v-slot="{ navigate, href }"
                      >
                        <el-link :href="href" @click="navigate">
                          {{ author.name }}
                        </el-link>
                      </router-link>
                    </span>
                  </div>
                  <div class="record-abstract" v-if="record.shortAbstract">
                    <i>ABSTRACT</i> | {{ record.shortAbstract }}
                  </div>
                  <div class="record-metadata">
                    <span v-if="record.doi">
                      <el-link :href="'https://doi.org/' + record.doi" target="_blank">
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
                </div>
                <div v-else>
                  <el-skeleton animated>
                    <template #template>
                      <el-skeleton-item variant="text" />
                    </template>
                  </el-skeleton>
                </div>
              </template>
            </li>
          </ul>
          <el-pagination
              v-loading="loadingRecommendIds"
              v-model:currentPage="currentPage"
              :page-size="10"
              layout="prev, pager, next"
              :total="recommendIds.length">
          </el-pagination>
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
      record: {},
      empty: true,
      loadingRecommendIds: true,
      recommendIds: [],
      papers: {},
      loadedPapersCount: 0,
      currentPage: 1,
      checkRecommendResultIntervalId: null,
      checkRecommendResultTimeoutId: null,
    }
  },
  computed: {
    remainCount() {
      return this.recommendIds.length - (this.currentPage - 1) * 10
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
    loadData(route) {
      if (this.checkRecommendResultTimeoutId)
        clearTimeout(this.checkRecommendResultTimeoutId)
      this.checkRecommendResultTimeoutId = null
      if (!route)
        route = this.$route
      this.loadingRecommendIds = true
      axios.get(`/api/record/${route.params.key}`)
          .then((res) => {
            this.record = res.data
            this.empty = false
            this.loadRecommendIds()
          })
          .catch((reason) => {
            ElMessage.error("载入失败：" + reason)
            this.empty = true
          })
    },
    async loadRecommendIds() {
      axios({
        url: `/api/recommend/record/${this.$route.params.key}`,
        method: 'PUT'
      })
          .then((resp) => {
            const resultId = resp.data.result_id
            let checkResult = async () => {
              axios.get(`/api/recommend/result/${resultId}`)
                .then(async (res) => {
                  if (res.data.status === 'ok') {
                    this.loadingRecommendIds = false
                    if (this.checkRecommendResultIntervalId)
                      clearInterval(this.checkRecommendResultIntervalId)
                    this.checkRecommendResultIntervalId = null
                    this.recommendIds = res.data.paper_ids

                    for (let paperId of res.data.paper_ids) {
                      try {
                        const resp = await axios({
                          url: `/api/record/${paperId}`,
                          method: 'GET',
                          params: {no_record_history: true}
                        })
                        let index = resp.data.paperAbstract.indexOf(' ', 100)
                        if (index !== -1) {
                          resp.data.shortAbstract = resp.data.paperAbstract.slice(0, index) + '...'
                        } else {
                          resp.data.shortAbstract = resp.data.paperAbstract
                        }
                        this.papers[paperId] = resp.data
                        this.loadedPapersCount++
                      } catch (err) {
                        console.error(err)
                      }
                    }
                  } else if (res.data.status !== 'pending') {
                    ElMessage.error("载入失败：" + res.data)
                  }
                })
                .catch((reason) => {
                  ElMessage.error("载入失败：" + reason)
                })
            }
            this.checkRecommendResultIntervalId = setInterval(checkResult, 1000)
            this.checkRecommendResultTimeoutId = setTimeout(() => {
              if (this.checkRecommendResultIntervalId)
                clearInterval(this.checkRecommendResultIntervalId)
              this.checkRecommendResultIntervalId = null
              if (this.loadedPapersCount !== this.recommendIds.length)
                ElMessage.error("载入失败：超时")
            }, 60000)
          })
    }
  }
}
</script>

<style>
h1.record-title {
  margin-top: 0;
  margin-bottom: 0.2em;
  font-weight: normal;
  font-size: 1.6em;
}
span.record-title-info i {
  transform: rotate(180deg) scale(0.8, 0.8);
  color: #d7dae2;
  transition: color .8s;
}
span.record-title-info i:hover {
  color: grey;
}
div.record-title-info-popup {
  line-height: 1.6em;
  padding: 0 4px;
}
.record-title-info-popup * {
  color: white;
  font-style: italic;
}
.record-authors .el-button--text {
  min-height: 1em;
  padding-top: 0;
  padding-bottom: 0;
}
.record-tags {
  margin-top: 0.4em;
}
.record-tag-item {
  border: 1px solid #d7dae2;
  border-radius: 4px;
  padding: 1px 3px;
}
.record-tag-item .el-link:hover i {
  color: #409EFF;
}
.record-tag-item i {
  color: #d7dae2;
}
div.record-section {
  margin-top: 1em;
}
h2.record-section-header {
  margin-top: 0;
  margin-bottom: 0.2em;
  font-size: 1.6em;
  font-weight: bold;
}
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
.query-results .record-title {
  font-weight: bold;
}
.query-results .record-authors > span:after {
  content: ', ';
}
.query-results .record-authors > span:last-child:after {
  content: '';
}
.query-results .record-metadata span:after {
  content: '; ';
}
.query-results .record-metadata span:last-child:after {
  content: '';
}
</style>

<style>
.query-results .record-metadata .el-link {
  vertical-align: baseline;
}
.el-pagination {
  text-align: center;
}
</style>