<template>
  <div class="person" v-if="!empty">
    <div class="person-header">
      <h1 class="person-names">
        <span class="person-names-main">
          {{ person.names[0] }}
        </span>
        <span class="person-names-uname" v-if="person.uname">
          ({{ person.uname }})
        </span>
      </h1>
      <div class="person-names-remains" v-if="person.names.length > 1">
        <el-space :size="10" wrap>
          <div v-for="name in person.names.slice(1)" :key="name">
            {{ name }}
          </div>
        </el-space>
      </div>
    </div>
    <div class="person-main">
      <div class="person-section" v-if="person.affiliations && person.affiliations.length">
        <h2 class="person-section-header">所属机构</h2>
        <div class="person-section-content">
          <el-timeline>
            <el-timeline-item
                v-for="(affiliation, index) in person.affiliations"
                :key="index"
                :timestamp="affiliation.label">
              {{ affiliation.text }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <div class="person-section">
        <h2 class="person-section-header">个人主页</h2>
        <div class="person-section-content">
          <el-timeline>
            <el-timeline-item timestamp="DBLP 个人主页">
              <el-link
                  :href="person.dblp_homepage"
                  target="_blank">{{ person.dblp_homepage }}</el-link>
            </el-timeline-item>
            <el-timeline-item
                v-for="(url, index) in person.urls"
                :key="index"
                :timestamp="url.type">
              <el-link
                  :href="url.text"
                  target="_blank">{{ url.text }}</el-link>
            </el-timeline-item>
          </el-timeline>
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
      empty: true,
    }
  },
  mounted() {
    this.loadData()
  },
  watch: {
    '$route.params'() {
      this.loadData()
    }
  },
  methods: {
    loadData() {
      axios.get(`/api/authors/datafeeder_key/${this.$route.params.key}`)
          .then((res) => {
            this.person = res.data
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

<style>

</style>
