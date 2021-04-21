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
              <div class="record-title-info-popup-doi" v-if="record.doi_short">
                <a :href="record.doi">{{ record.doi_short }}</a>
              </div>
              <div class="record-title-info-popup-booktitle">
                {{ record.booktitle || record.journal }} {{ record.year }}
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
            <router-link :to="{ name: 'person', params: {key: author.name}}">
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
          本课题旨在…… <a href="#">点击展开</a>
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
      axios.get(`/api/records/dblp_key/${this.$route.params.key}`)
          .then((res) => {
            if (res.data.doi) {
              res.data.doi_short = res.data.doi.replace(/^(https?:\/\/doi\.org\/)/, "")
            }
            this.record = res.data
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
</style>
