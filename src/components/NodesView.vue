<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>目录结构</span>
              </div>
              <div class="text item">
                <el-tree :data="pathTree"
                         :props="defaultProps"
                         :default-expand-all="true"
                         :expand-on-click-node="false"
                         @node-click="nodeClick"/>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="2">
          <p/>
        </el-col>
        <el-col :span="14">
          <div class="grid-content bg-purple-light">
            <el-card class="box-card">

              <el-form :inline="true" :model="formInline" class="demo-form-inline">

                <el-form-item label-width="200px">
                  <el-input v-model="absolutePath" placeholder="请输入节点路径"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="node_query">搜索节点</el-button>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="quit">退出登录</el-button>
                </el-form-item>

              </el-form>

              <div slot="header" class="clearfix">
                <span>节点信息</span>
              </div>
              <div class="text item">
                <el-table
                    :data="node"
                    stripe border
                    style="width: 95%">
                  <el-table-column
                      prop="path"
                      label="Node">
                  </el-table-column>
                  <el-table-column
                      prop="value"
                      label="Value">
                  </el-table-column>
                  <el-table-column
                      label="操作">
                    <!--                    <template slot-scope="scope" with="180px">-->
                    <!--                        {{scope.row.id}}-->
                    <template>
                      <!--                        增加-->
                      <el-tooltip effect="dark" content="增加节点" placement="top" :enterable="false">
                        <el-button type="success" icon="el-icon-circle-plus-outline" circle size="mini"
                                   @click="addNode"></el-button>
                      </el-tooltip>
                      <!--                        修改-->
                      <el-tooltip effect="dark" content="修改节点" placement="top" :enterable="false">
                        <el-button type="primary" icon="el-icon-edit" circle size="mini"
                                   @click="updateNode"></el-button>
                      </el-tooltip>
                      <!--                        删除-->
                      <el-tooltip effect="dark" content="删除节点" placement="top" :enterable="false">
                        <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="delNode"></el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </div>

          <div>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>服务信息</span>
                <el-row>
                  <el-col :span="2">
                    <el-button size="mini" @click="getServers">刷新</el-button>
                  </el-col>
                </el-row>
              </div>
              <div class="text item">
                <el-table
                    :data="partInfo"
                    stripe border
                    style="width: 95%">
                  <el-table-column
                      prop="host"
                      label="Host">
                  </el-table-column>
                  <el-table-column
                      prop="port"
                      label="Port">
                  </el-table-column>
                  <el-table-column
                      prop="mode"
                      label="Mode">
                  </el-table-column>
                  <el-table-column
                      prop="status"
                      label="Status">
                  </el-table-column>
                </el-table>
                <el-pagination
                    background
                    layout="prev, pager, next, jumper"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="5"
                    :total="serverInfo.length / 5 + 1">
                </el-pagination>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>

    </el-main>

    <!--增加节点Dialog-->
    <el-dialog
        title="提示"
        :visible.sync="addDialogVisible"
        :before-close="addDialogClose"
        width="40%">
        <el-row>
          <el-col :span="6" style="line-height:1.7;font-size: 16px">节点路径:</el-col>
          <el-col :span="18">
            <el-input v-model="newNodePath">
              <template slot="prepend">{{this.absolutePath}}/</template>
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" style="line-height:1.7;font-size: 16px">节点值:</el-col>
          <el-col :span="18">
            <el-input v-model="newNodeValue"></el-input>
          </el-col>
        </el-row>
      <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="node_create">确 定</el-button>
            </span>
    </el-dialog>
    <!--修改节点Dialog-->
    <el-dialog
        title="提示"
        :visible.sync="updateDialogVisible"
        :before-close="updateDialogClose"
        width="40%">
      <el-row>
        <el-col :span="6" style="line-height:1.7;font-size: 16px">节点路径:</el-col>
        <el-col :span="18" style="line-height:1.7;font-size: 16px">
          {{this.absolutePath}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" style="line-height:1.7;font-size: 16px">原节点值:</el-col>
        <el-col :span="18" style="line-height:1.7;font-size: 16px">
          {{node[0].value}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" style="line-height:1.7;font-size: 16px">修改节点:</el-col>
        <el-col :span="18">
          <el-input v-model="newNodeValue" placeholder="请输入修改值"></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
            <el-button @click="updateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="node_update">确 定</el-button>
            </span>
    </el-dialog>
  </el-container>

</template>

<script>
import {request} from "@/network/request"
import qs from "qs"
import Vue from "vue";

Vue.prototype.$qs = qs

export default {
  name: "NodesView",
  data() {
    return {
      /*服务器地址*/
      addresses: '',
      /*新节点名称*/
      newNodePath: '',
      /*新节点的值*/
      newNodeValue: '',
      /*显示操作结果或节点信息*/
      nodeValue: 'NULL',
      /*节点绝对路径*/
      absolutePath: '',
      /*新增节点对话框*/
      addDialogVisible: false,
      /*修改节点对话框*/
      updateDialogVisible: false,
      /*目录结构树*/
      pathTree: [],
      /*Tree控件属性*/
      defaultProps: {
        children: 'children',
        label: 'label',
        path: ''
      },
      node: [{
        path: 'NULL',
        value: 'NULL'
      }],
      /*服务信息Table属性*/
      serverInfo: [{
        id: '',
        mode: '',
        status: '',
        host: '',
        port: ''
      }],
      partInfo: [{
        id: '',
        mode: '',
        status: '',
        host: '',
        port: ''
      }],
      // 分页中的当前页数
      currentPage: 1
    }
  },

  methods: {
    initWebSocket() { //初始化weosocket
      const wsuri = "ws://localhost:8081/webSocket";
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() { //连接建立之后执行send方法发送数据
      console.log("连接成功!");
    },
    websocketonerror() {//连接建立失败重连
      this.initWebSocket();
    },
    async websocketonmessage(e) { //数据接收
      const redata = e.data;
      console.log(redata)
      if (redata === "Rec Success!") {
        // alert("检测数据更新,同步中...")
        await this.getPathStruct(this.addresses);
      } else if (redata === "ServerStatChanged") {
        this.$message.info("检测到服务器状态更改,刷新服务器状态...");
        await this.getServers();
        this.$message.success("刷新完成");
      }
    },

    websocketclose(e) {  //关闭
      console.log('断开连接', e);
    },

    async getPathStruct(addresses) {
      const res = await request({
        url: '/nodetree/' + addresses,
        method: 'get',
      })
      this.pathTree = [];
      this.pathTree.push(res.data.data);
    },
    async node_query() {
      const res = await request({
        url: '/node',
        method: 'get',
        params: {
          path: this.absolutePath
        }
      })
      if (res.data.stat !== 200) {
        alert("节点不存在!,查询失败")
      } else {
        let queryData = res.data.data;
        if (queryData === "") {
          this.node[0].value = "NULL";
        } else {
          this.node[0].value = queryData;
        }
      }
    },
    /*Tree控件中节点点击事件*/
    nodeClick(data) {
      this.absolutePath = data.path;
      this.node[0].path = data.path;
      this.node_query();//查询值
      // this.node_getChild();//查询子节点
      // this.dialogVisible=true;//弹出对话框
    },
    async node_getChild() {
      const res = await request({
        url: '/list',
        method: 'post',
        data: {
          path: this.absolutePath
        }
      });
      let queryData = res.data.data.toString();
      if (queryData === "") {
        this.node[0].nodeChildren = "NULL";
      } else {
        this.node[0].nodeChildren = queryData;
      }
    },
    async node_create() {
      const pattern = /^\w+$/g;
      const flag = pattern.test(this.newNodePath);
      if (!flag) {
        this.$message.error('节点名仅支持数字、字母、下划线!');
        return;
      }

      let abPath = '';
      if (this.absolutePath === '/') {
        abPath = this.absolutePath + this.newNodePath;
      } else {
        abPath = this.absolutePath + '/' + this.newNodePath;
      }
      const res = await request({
        url: '/node',
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: [function (data) {
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
        data: {
          path: abPath,
          value: this.newNodeValue
        }
      });
      let ob = res.data;
      if (ob.stat !== 200) {
        if(ob.stat === 401) this.$message.error('没有修改权限！');
        else this.$message.error('创建失败,节点不存在!');
      } else {
        // await this.getPathStruct();
        // await this.node_getChild();
        this.addDialogVisible = false;
        this.$message.success('创建成功!');
      }
    },
    async node_update() {
      const res = await request({
        url: '/node',
        method: 'put',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: [function (data) {
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
        data: {
          path: this.absolutePath,
          value: this.newNodeValue
        }
      });
      let ob = res.data;
      if (ob.stat !== 200) {
        if(ob.stat === 401) this.$message.error('没有修改权限！');
        else this.$message.error('修改失败,节点不存在!');
      } else {
        // await this.getPathStruct();
        // await this.node_query();
        this.updateDialogVisible = false;
        this.$message.success('修改成功!');
      }
      this.res = res.value;
    },
    async node_delete() {
      const res = await request({
        url: '/node',
        method: 'delete',
        params: {
          path: this.absolutePath
        }
      });
      let ob = res.data;
      if (ob.stat !== 200) {
        if(ob.stat === 401) this.$message.error('没有修改权限！');
        else this.$message.error('删除失败,节点不存在!');
      } else {
        // await this.getPathStruct();
        this.node[0].nodeChildren = "NULL";
        this.node[0].nodePath = "NULL";
        this.node[0].nodeValue = "NULL";
        this.absolutePath = '';
        this.$message.success('删除成功!');
      }
    },
    addNode() {
      this.addDialogVisible = true;
    },
    addDialogClose() {
      this.newNodePath = '';
      this.newNodeValue = '';
      this.addDialogVisible = false;
    },
    updateNode() {
      this.updateDialogVisible = true;
    },
    updateDialogClose() {
      this.newNodeValue = '';
      this.updateDialogVisible = false;
    },
    async delNode() {
      const result = await this.$confirm('将删除此节点下所有数据及子节点,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)//return err的简写
      if (result !== 'confirm') {
        return this.$message.info('已取消');
      }
      await this.node_delete();
    },

    // async getServerInfo() {
    //   const res = await request({
    //     url: '/servers',
    //     method: 'get',
    //   })
    //   console.log(res);
    //   this.serverInfo = res.data.data;
    // },

    quit() {
      request({
        url: '/quit',
        method: 'delete',
      })
      this.$router.push({
        path: `/`,
      })
    },

    async handleCurrentChange(val) {
      this.currentPage = val;
      const res = await request({
        url: '/servers',
        method: 'get',
        params: {
          page: this.currentPage,
          pageSize: 5
        }
      })
      this.partInfo = res.data.data;
    },

    async getServers() {
      const res = await request({
        url: '/servers',
        method: 'get',
        params: {
          page: this.currentPage,
          pageSize: 5
        }
      })
      this.partInfo = res.data.data;
    }
  },
  created() {
    this.addresses = this.$route.query.addresses;
    this.getPathStruct(this.addresses);
    this.handleCurrentChange(1);
    this.initWebSocket();
  }

};
</script>

<style>
.body {
  background-color: #D3DCE6;
}

.el-header {
  background-color: #D3DCE6;
  color: #333;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  /*!*text-align: center;*!*/
  /*!*line-height: 200px;*!*/
}

.el-main {
  background-color: #D3DCE6;
  color: #333;
  /*text-align: center;*/
  /*line-height: 160px;*/
}
</style>