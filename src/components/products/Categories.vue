<template>
  <div class="categories">
    <!-- 添加分类按钮 -->
    <el-button type='success' plain class='addBtn' @click="showEdit">添加分类</el-button>
    <!-- 表格 -->
    <el-table
      :data='categoryList'
      row-key="cat_id"
      v-loading="isLoading">
      <el-table-column label='分类名称' prop='cat_name'></el-table-column>
      <el-table-column label='是否有效'>
        <template v-slot:default='{row}'>
          {{row.cat_deleted?'否':'是'}}
        </template>
      </el-table-column>
      <el-table-column label='排序' prop='cat_level'></el-table-column>
      <el-table-column label='操作'>
        <template v-slot:default='{row}'>
          <el-button type='primary' plain icon='el-icon-edit' size='small'></el-button>
          <el-button type='danger' plain icon='el-icon-delete' size='small'></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加分类模态框 -->
    <el-dialog
      @close='closeEdit'
      title="添加分类"
      :visible.sync="dialogVisible"
      width="40%"
      >
      <el-form
        ref='form'
        :model='form'
        label-width='80px'
        :rules='rules'>
        <el-form-item label='分类名称' prop='cat_name'>
          <el-input v-model='form.cat_name' placeholder='请输入分类名称'></el-input>
        </el-form-item>
        <el-form-item label='父级名称' prop='cat_pid'>
           <el-cascader
            clearable
            v-model="form.cat_pid"
            :options="options"
            :props="prop"
           >
          </el-cascader>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button @click="addCategory" type="primary">确 定</el-button>
          </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
export default {
  //  进入页面拿到所有数据
  data () {
    return {
      categoryList: [],
      pagenum: 1,
      pagesize: 5,
      type: 0,
      total: 0,
      isLoading: false,
      // 添加分类模态框
      form: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      dialogVisible: false,
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      },
      // 连级选择
      options: [],
      prop: {
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    // 数据渲染
    async getCategoryList () {
      this.isLoading = true
      const { data, meta } = await this.$axios.get('categories', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          type: 3
        } })
      if (meta.status === 200) {
        // console.log(data)
        this.categoryList = data.result
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
      this.isLoading = false
    },
    // 分页
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum1 = 1
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoryList()
      // console.log(`当前页: ${val}`)
    },
    // 显示模态框
    async showEdit () {
      this.dialogVisible = true
      // 获取需要渲染的分类页
      const { meta, data } = await this.$axios.get('categories?type=2')
      if (meta.status === 200) {
        this.options = data
      }
    },
    // 添加分类
    async addCategory () {
      try {
        // 先校验
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('categories', {
          // 父级id,就是拿到cat_id数组的最后一项
          // 0表示没有父级
          cat_pid: this.form.cat_pid[this.form.cat_pid.length - 1] || 0,
          cat_name: this.form.cat_name,
          cat_level: this.form.cat_level
        })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          // 隐藏模态框
          this.dialogVisible = false
          this.getCategoryList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭清空模态框
    closeEdit () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang='scss' scoped>
  .categories{
    .addBtn{
      margin-bottom: 10px;
    }
  }
</style>
