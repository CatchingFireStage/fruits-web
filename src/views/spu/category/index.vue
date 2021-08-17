<!--
 * @Description:
 * @Author: LaughingZhu
 * @Date: 2021-08-17 09:50:17
 * @LastEditros:
 * @LastEditTime: 2021-08-17 18:19:40
-->
<template>
  <div class="app-container">
    <div class="search">
      <el-input v-model="keyword" clearable class="keyword" placeholder="请输入查找分类名称" @clear="_getCategoryDatas">
        <el-button slot="append" icon="el-icon-search" @click="_getCategoryDatas" />
      </el-input>

      <el-button type="primary" class="add">添加分类</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        fixed
        align="center"
        prop="id"
        label="分类Id"
        width="150"
      />
      <el-table-column
        prop="name"
        align="center"
        label="姓名"
      />
      <!-- <el-table-column
        prop="updateTime"
        align='center'
        label="更新时间"
        >
      </el-table-column> -->
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <div class="table_tools">
            <el-popconfirm
              icon="el-icon-info"
              icon-color="red"
              :title="'确定要删除分类--(' + scope.row.name + ')?'"
              @onConfirm="handleDelete(scope.row.id)"
            >
              <el-button slot="reference" type="danger" size="small">删除</el-button>
            </el-popconfirm>

            <el-button size="small">编辑</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :current-page="page"
      :page-sizes="[10, 50, 100, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
import { getCategoryList, deleteCategoryById } from '@/api/spu'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
const lodash = require('lodash')
export default {
  name: 'SpuCategory',
  data() {
    return {
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 1,
      keyword: ''
    }
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    page: function(newPage, oldPage) {
      if (newPage === oldPage) return false
      this.debouncedGetCategoryDatas()
    },
    pageSize: function(newPageSize, oldPageSize) {
      if (newPageSize === oldPageSize) return false
      this.debouncedGetCategoryDatas()
    },
    keyword: function(newWord, oldWord) {
      if (newWord === oldWord) return false
      this.debouncedGetCategoryDatas()
    }
  },
  created: function() {
    this.debouncedGetCategoryDatas = lodash.debounce(this.getCategoryDatas, 500)

    setTimeout(() => {
      this.debouncedGetCategoryDatas()
    }, 50)
  },
  methods: {
    /**
     * 分页列表数据获取
     */
    async getCategoryDatas() {
      const params = {
        keyword: this.keyword,
        page: this.page,
        pageSize: this.pageSize
      }

      const res = await getCategoryList(params)
      if (res.code === 0) {
        // 获取成功
        this.tableData = res.data.list
        this.total = res.data.total
      }
    },

    /**
     * 分页-页数改变
     * @param pageSize: 改变后每页的数量
     */
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
    },

    /**
     * 分页-当前页改变
     * @param page: 改变后的页数
     */
    handlePageChange(page) {
      this.page = page
    },

    /**
     * 删除分类，成功更新数据
     * @param id: 分类id
     */
    async handleDelete(id) {
      const res = await deleteCategoryById(id)
      if (res.code === 200) {
        this.$message({
          message: res.msg,
          type: 'success',
          onClose: () => {
            // 删除成功后更新list数据
            this.debouncedGetCategoryDatas()
          }
        })
      }
    }
  }
}
</script>

<style scoped>

  .search {
    margin: 20px 0 40px 20px;
  }
  .add {
    margin-left: 50px;
  }
  .keyword {
    width: 400px;
  }
  .pagination {
    margin: 30px auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .table_tools {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
</style>
