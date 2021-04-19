<template>
  <div id="outer-container">
    <div class="record-header">
      <h1 class="record-title">
        <span class="record-title-content">
          一个基于XXX的个性化文献推荐系统的系统设计架构
        </span>
        <span class="record-title-info">
          <el-tooltip placement="right">
          <template #content>
            <div class="record-title-info-popup">
              doi:10.1000/draft<br>ECCV 2025
            </div>
          </template>
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
        </span>
      </h1>
      <el-space :size="10" wrap class="record-authors">
        <div v-for="i in 5" :key="i">
          <el-link type="primary">Jay Chou (周杰伦)</el-link>
        </div>
      </el-space>
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
    <div class="record-main">
      <div class="record-section">
        <h2 class="record-section-header">摘要</h2>
        <div class="record-section-content">
          本课题旨在…… <a href="#">点击展开</a>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {h} from "vue";
import {ElDivider} from "element-plus";

export default {
  name: 'App',
  components: {},
  data() {
    return {
      spacer: h(ElDivider, { direction: 'vertical' }),
    }
  }
}
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  font-size: 14px;
}
#outer-container {
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 0;
}
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
