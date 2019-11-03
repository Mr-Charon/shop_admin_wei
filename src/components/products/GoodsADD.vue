<template>
<div class="goods-add">
  <!-- 我是goodsadd -->
  <!-- 步骤条 -->
  <el-steps :active="active" finish-status="success">
    <el-step title="步骤 1" description='基本信息'></el-step>
    <el-step title="步骤 2" description='商品图片'></el-step>
    <el-step title="步骤 3" description='商品内容'></el-step>
  </el-steps>
  <!-- tab栏 -->
  <el-tabs
      tab-position="left"
      @tab-click='handleClick'
      v-model="activeTab" >
    <el-tab-pane name='0' label="基本信息">
      <el-form
        :model='form'
        label-width='80px'>
        <el-form-item label='商品名称'>
          <el-input v-model='form.goods_name' placeholder='请输入商品名称'></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="form.goods_price" placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="form.goods_weight" placeholder="请输入商品重量"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="form.goods_number" placeholder="请输入商品数量"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-cascader
          :props="props"
          v-model="form.goods_cat"
          :options="options">
          </el-cascader>
        </el-form-item>

      </el-form>
      <!-- 下一步 -->
      <el-button type="primary" @click="goNext">下一步</el-button>
    </el-tab-pane>
    <el-tab-pane name='1' label="商品图片">
      <el-upload
          :headers="headers"
          multiple
          name="file"
          action="http://localhost:8888/api/private/v1/upload"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
      </el-upload>
      <!-- 下一步 -->
      <el-button type="primary" @click="goNext">下一步</el-button>
    </el-tab-pane>
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <!-- 富文本编辑器 -->
    <el-tab-pane name='2' label="商品内容">
      <quill-editor v-model="form.goods_introduce"></quill-editor>
      <el-button type='primary' @click="addGoods">添加</el-button>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
export default {
  data () {
    return {
      // 步骤
      active: 0,
      activeTab: '0',

      // 基本信息表单
      form: {
        goods_name: '',
        goods_cat: [], // 商品分类, 将来给级联绑定的
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [] // 图片数组, 存储着上传的图片对象
      },
      options: [],
      props: {
        value: 'cat_id', // 选中的 id 值, 数组
        label: 'cat_name', // 显示的级联文本
        children: 'children' // 子代展开
      },
      // 图片上传
      headers: {
        Authorization: localStorage.getItem('token')
      },
      // 图片预览
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  async created () {
    // 获取连级菜单数据
    const { meta, data } = await this.$axios.get('categories?type=3')
    if (meta.status === 200) {
      this.options = data
    } else {
      this.$message.error(meta.msg)
    }
  },
  methods: {
    handleClick (tab, event) {
      this.active = +tab.index
    },
    // 下一步
    goNext () {
      this.active++
      this.activeTab = this.active + ''
    },
    // 图片上传
    handleSuccess (response, file, fileList) {
      const { meta, data } = response
      if (meta.status === 200) {
        this.form.pics.push({
          pic: data.tmp_path
        })
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 图片删除
    handleRemove (file, fileList) {
      // console.log(file, fileList)
      // 找到路径，移除对应路径，筛选
      const path = file.response.data.tmp_path
      this.form.pics = this.form.pics.filter(item => item.pic !== path)
    },
    // 图片预览
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 添加
    async  addGoods () {
      const { meta } = await this.$axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join(',')
      })
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.quill-editor {
  background-color: #fff;
  ::v-deep .ql-editor {
    min-height: 300px;
  }
}
</style>
