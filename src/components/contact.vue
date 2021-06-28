<template>
  <div class="chatpapel">
    <div class="header">
      <div class="avatar">
        <img class="wxtx" :src="tximg" />
      </div>

      <div class="info">
        <span style="margin-left: 20px">{{ $store.getters.getrealName }}</span>

        <el-dropdown style="float: right">
          <span class="el-dropdown-link">
            <i
              class="el-icon-s-operation"
              style="font-size: 150%; margin-top: 10px"
            ></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updateuser"
                >修改个人信息
              </el-dropdown-item>
              <el-dropdown-item @click.native="newfriendVisible = true"
                >添加好友</el-dropdown-item
              >
              <el-dropdown-item @click.native="cancel"
                >注销</el-dropdown-item
              >
            </el-dropdown-menu>
          </span>
        </el-dropdown>
      </div>
    </div>

    <el-dialog
      title="修改个人信息"
      style="text-align: center"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" :rules="rules" ref="loginFormRef">
        <el-form-item
          label="昵称:"
          :label-width="formLabelWidth"
          prop="realName"
        >
          <el-input v-model="form.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="用户名:"
          :label-width="formLabelWidth"
          prop="userName"
        >
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="旧密码:"
          :label-width="formLabelWidth"
          prop="oldpassword"
        >
          <el-input
            type="password"
            v-model="form.oldpassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新密码:"
          :label-width="formLabelWidth"
          prop="newpassword"
        >
          <el-input
            type="password"
            v-model="form.newpassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitupdate">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="添加好友界面"
      :visible.sync="newfriendVisible"
      width="30%"
      center
    >
      <div style="text-align:center;display:inline;overflow:auto">
        <el-input
          v-model="addfriend"
          placeholder="请输入用户昵称"
          prefix-icon="el-icon-search"
          style="width: 80%"
        ></el-input>
        <el-button
          icon="el-icon-search"
          style="width: 20%"
          @click="searchnewfriend"
        ></el-button>
      </div>

      <div
        style="width: 90%; margin-top: 30px; margin-left: 10px"
        v-for="(searchfriend, i) in addfriends"
        :key="i"
        :index="(i + 1).toString()"
      >
        <img :src="searchfriend.avatarImg" class="wxtx" />
        <span style="margin-left: 20px; margin-right: 20px">{{
          searchfriend.realName
        }}</span>
        <el-button
          type="danger"
          icon="el-icon-delete"
          style="float: right; margin-right: -10px"
          circle
          @click="deleteadd(searchfriend)"
        ></el-button>
        <el-button
          type="success"
          icon="el-icon-check"
          style="float: right; margin-right: 20px"
          circle
          @click="correntadd(searchfriend)"
        ></el-button>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="newfriendVisible = false">关 闭 页 面</el-button>
      </div>
    </el-dialog>

    <div class="search_bar">
      <el-autocomplete
        class="inline-input"
        placeholder="搜索"
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        :trigger-on-focus="false"
        @select="handleSelect"
      >
      </el-autocomplete>
    </div>

    <div class="tab">
      <div class="tab_item">
        <el-button
          icon="el-icon-chat-round"
          @click="gochat"
          :type="leftstyle"
        ></el-button>
      </div>
      <div class="tab_item">
        <el-button
          icon="el-icon-notebook-2"
          @click="gobook"
          :type="rightstyle"
        ></el-button>
      </div>
    </div>

    <div class="contactitem">
      <el-col v-show="chatboolean" :span="24">
        <el-menu
          :default-active="navselected"
          :active="navselected"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item
            v-for="(friend, i) in Allfriend"
            :key="i"
            :index="(i + 1).toString()"
            @click="setContact(friend)"
          >
            <div class="avatar">
              <img
                :src="friend.avatarImg"
                alt=""
                :class="friend.online ? 'wxtx' : 'graywxtx'"
              />

              <i
                v-if="friend.remind"
                class="avatari"
            
              >
                <span class="avatarspan"></span>
              </i>
              <!-- 未读消息提醒 -->
            </div>
            <span slot="title">{{ friend.realName }}</span>
          </el-menu-item>
        </el-menu>
      </el-col>

      <el-col v-show="!chatboolean">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>好友申请列表</span>
            </template>

            <el-menu-item
              style="
                padding-left: 20px;
                dispaly: inline-block;
                text-align: left;
              "
              v-for="(apply, i) in applylist"
              :key="i"
              :index="(i + 1).toString()"
            >
              <img :src="apply.avatarImg" class="wxtx" />
              <span style="text-align: left">{{ apply.realName }}</span>

              <el-popover
                placement="right"
                width="200"
                style="right"
                v-model="visible"
              >
                <p style="text-align: center">
                  你要添加该好友{{ apply.realName }}么
                </p>
                <div style="text-align: center; margin: 0">
                  <el-button size="mini" type="text" @click="visible = false"
                    >取消</el-button
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    @click="commitadd(apply)"
                    >添加</el-button
                  >
                  <el-button
                    type="danger"
                    size="mini"
                    @click="commitdelete(apply)"
                    >删除</el-button
                  >
                </div>

                <el-button
                  slot="reference"
                  icon="el-icon-edit"
                  circle
                  style="width: 28%; margin-left: 20px"
                ></el-button>
              </el-popover>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </div>
  </div>
</template>
<script>
export default {
  name: "contact",
  data() {
    return {
      Allfriend: this.$store.getters.getAllfriends,
      state: "",
      chatboolean: true,
      tximg: this.$store.getters.getavatarImg,
      inputadvice: [],
      leftstyle: "success",
      rightstyle: "",
      onlinefriend: [],
      dialogFormVisible: false,
      newfriendVisible: false,
      navselected: "1",
      addfriend: "",
      addfriends: [],
      applylist: [],
      visible: false,
      form: {
        realName: "",
        username: "",
        oldpassword: "",
        newpassword: "",
      },
      formLabelWidth: "80px",
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 1,
            max: 11,
            message: "长度在 1 到 11 个字符",
            trigger: "blur",
          },
        ],
        realName: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          {
            min: 1,
            max: 11,
            message: "长度在 1 到 11 个字符",
            trigger: "blur",
          },
        ],
        oldpassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        newpassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {
    this.searchfriend();
    setInterval(this.setInvalfriend, 2000);
    setInterval(this.checkonlinefriend, 2000);
    setInterval(this.getallapplayfriend, 1000);
    setInterval(this.getUserWhoSendUnReadMessage, 1000);
  },
  watch: {
    onlinefriend: {
      handler() {
        let array = this.Allfriend;
        let brray = this.onlinefriend;
        let arrid = [];
        let brrid = [];
        let sameay = [];
        let downay = [];

        array.forEach((element) => {
          arrid.push(element.id);
        });

        brray.forEach((element) => {
          brrid.push(element.id);
        });

        for (let i = 0; i < arrid.length; i++) {
          if (brrid.length != 0) {
            for (let j = 0; j < brrid.length; j++) {
              if (arrid[i] == brrid[j]) {
                array[i].online = true;
                sameay.push(array[i]);
              }
            }
          }
        }

        downay = array.filter((i) => !sameay.includes(i));
        for (let k = 0; k < downay.length; k++) {
          let i = array.findIndex((item) => item.id == downay[k].id);
          array[i].online = false;
        }

        this.$store.commit("updateAllfriends", array);
      },
    },
  },
  methods: {
    setInvalfriend() {
      const that = this;
      let url =
        "http://115.159.156.211:8081/friend/getAllFriend/" +
        this.$store.getters.getid;

      this.$axios
        .post(url)
        .then((res) => {
          let temp = [];
          for (let items of res.data) {
            items.online = false;
            items.remind = false;
            temp.push(items);
          }
          if (that.$store.getters.getAllfriends.length != temp.length) {
            that.$store.commit("updateAllfriends", temp);
            that.Allfriend = temp;
            that.checkonlinefriend();
          }
        })
        .catch(function (error) {
          window.console.log(error);
        });
    },
    getUserWhoSendUnReadMessage() {
      const that = this;
      let array = this.Allfriend;

      let url =
        "http://115.159.156.211:8081/user/getUserWhoSendUnReadMessage/" +
        this.$store.getters.getid;

      this.$axios
        .post(url)
        .then((res) => {
          if (res.data.length == 0) {
            return;
          } else {
            for (let i = 0; i < array.length; i++) {
              for (let j = 0; j < res.data.length; j++) {
                if (array[i].id == res.data[j].id) {
                  array[i].remind = true;
                }
              }
            }
          }
        })
        .catch(function (error) {
          window.console.log(error);
        });
    },
    updateuser() {
      this.form.realName = this.$store.getters.getrealName;
      this.form.username = this.$store.getters.getusername;
      this.dialogFormVisible = true;
    },

    commitupdate() {
      this.dialogFormVisible = false;
      if (this.$store.getters.getpassword != this.form.oldpassword) {
        this.$message.error("旧密码错误");
        this.form.oldpassword = "";
        this.form.newpassword = "";
        return;
      }
      let username = this.form.username;
      let realName = this.form.realName;
      let password = this.form.newpassword;

      let url =
        "http://115.159.156.211:8081/user/update?userName=" +
        username +
        "&passWord=" +
        password +
        "&realName=" +
        realName +
        "&id=" +
        this.$store.getters.getid +
        "";
      const that = this;
      this.$axios
        .post(url)
        .then(() => {
          that.$store.commit("updateName", realName);
          that.$store.commit("updateusername", username);
          that.$store.commit("updatepassword", password);
        })
        .catch(function (error) {
          window.console.log(error);
        });

      this.$message.success("修改个人信息成功");
      this.form.oldpassword = "";
      this.form.newpassword = "";
    },

    checkonlinefriend() {
      let url =
        "http://115.159.156.211:8081/friend/getOnlineFriend/" +
        this.$store.getters.getid;
      const that = this;
      this.$axios
        .post(url)
        .then((res) => {
          let temp = [];
          for (let items of res.data) {
            temp.push(items);
          }

          that.onlinefriend = temp;
        })
        .catch(function (error) {
          window.console.log(error);
        });
    },
    getallapplayfriend() {
      let url =
        "http://115.159.156.211:8081/friendApplication/getAllFriendApplication/" +
        this.$store.getters.getid;
      const that = this;
      this.$axios
        .post(url)
        .then((res) => {
          let temp = [];
          for (let items of res.data) {
            temp.push(items);
          }
          that.applylist = temp;
        })
        .catch(function (error) {
          window.console.log(error);
        });
    },
    searchfriend() {
      let Allfriend = this.Allfriend;
      if (this.inputadvice.length == 0) {
        let item = [];
        for (let items of Allfriend) {
          item = items;
          item.value=items.realName;
          this.inputadvice.push(item);
        }
      }
    },

    searchnewfriend() {
      let addfriend = this.addfriend;
      let url =
        "http://115.159.156.211:8081/user/searchUser?realName=" +
        addfriend +
        "";
      const that = this;
      this.$axios
        .post(url)
        .then((res) => {
          let temp = [];
          for (let items of res.data) {
            temp.push(items);
          }
          that.addfriends = temp;
        })
        .catch(function (error) {
          window.console.log(error);
        });
    },

    querySearchAsync(queryString, cb) {
 
      let inputadvice = this.inputadvice;
  
      let results = queryString
        ? inputadvice.filter(this.createStateFilter(queryString))
        : inputadvice;
      
      
      cb(results);
    },

    createStateFilter(queryString) {
      return (state) => {
        return (
          state.realName
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) != -1
        );
      };
    },

    handleSelect(item) {
      this.setContact(item);
      let number = this.Allfriend.indexOf(item) + 1;
  
      this.navselected = number.toString();
    },
    handleOpen(key, keyPath) {
    
    },
    handleClose(key, keyPath) {
      
    },
    gochat() {
      this.chatboolean = true;
      this.leftstyle = "success";
      this.rightstyle = "";
    },
    gobook() {
      this.chatboolean = false;
      this.leftstyle = "";
      this.rightstyle = "success";
    },
    setContact(i) {
      i.remind=false;
      this.$emit("set-contact", i);
    },
    correntadd(searchfriend) {
      let myid = this.$store.getters.getid;
      let id = searchfriend.id;

      let addfriends = this.addfriends;
      let i = addfriends.indexOf(searchfriend);

      let url =
        "http://115.159.156.211:8081/friendApplication/insertFriendApplication/" +
        myid +
        "/" +
        id +
        "";
      const that = this;
      this.$axios
        .post(url)
        .then((res) => {
          that.$message.success("已向该用户发送好友申请");
          addfriends.splice(i, 1);
        })
        .catch(function (error) {
          window.console.log(error);
        });
    },
    deleteadd(searchfriend) {
      let addfriends = this.addfriends;
      let i = addfriends.indexOf(searchfriend);
      addfriends.splice(i, 1);
    },
    commitadd(addfriend) {
      this.visible = false;
      const that = this;

      let url =
        "http://115.159.156.211:8081/friend/insertFriend/" +
        this.$store.getters.getid +
        "/" +
        addfriend.id +
        "";
      this.$axios
        .post(url)
        .then((res) => {
          that.$message.success("成功添加好友");
        })
        .catch(function (error) {
          window.console.log(error);
        });

      this.axiosdelete(addfriend);
    },
    commitdelete(addfriend) {
      this.visible = false;
      this.axiosdelete(addfriend);
      this.$message.success("已删除该好友申请");
    },
    axiosdelete(addfriend) {
  
      let url =
        "http://115.159.156.211:8081/friendApplication/deleteFriendApplication/" +
        addfriend.id +
        "/" +
        this.$store.getters.getid +
        "";
      this.$axios
        .post(url)
        .then((res) => {})
        .catch(function (error) {
          window.console.log(error);
        });
    },cancel(){
        this.$router.push("/login");
        sessionStorage.clear();
    },
  
  },
};
</script>

<style lang="less" scoped>
.chatpapel {
  margin-left: 200px;
  margin-top: 80px;
  float: left;
  width: 15%;
  height: 80%;
  background-color: #545c64;
  overflow: hidden;
}

.header {
  padding: 18px;
  height: 40px;
  background-color: rgb(179, 240, 170);
  overflow: hidden;
}

.avatar {
  width: 40px;
  height: 40px;
  display: inline;
  position: relative;
}

.avatari {
  background: url(../assets/img/allwx.png);
  background-position: -451px -380px;
  position: absolute;
  top: -20px;
  right: -6px;
  color: #fff;
  display: inline-block;
  width: 22px;
  height: 16px;
}

.avatarspan {
  position: absolute;
  top: -32px;
  right: 9px;
  font-size: 14px;
}

.wxtx {
  width: 50px;
  height: 50px;
  vertical-align: middle;
  margin-top: 0px;
  border-radius: 25%;
}

.graywxtx {
  width: 50px;
  height: 50px;
  vertical-align: middle;
  margin-top: 0px;
  filter: grayscale(100%);
  border-radius: 25%;
}

.info {
  display: inline;
  width: 200px;
  font-size: 18px;
  line-height: 40px;
  overflow: hidden;
}

.search_bar {
  padding-left: 12px;
  padding-top: 9px;
  height: 50px;
  background: rgb(151, 218, 212);
}

button {
  cursor: pointer;
}

.autowidth {
  width: 95%;
}

.tab {
  height: 50px;
  background-color: white;
  overflow: hidden;
}

.tab_item {
  float: left;
  width: 50%;
  background: greenyellow;
  height: 100%;
}

.tab_item button {
  width: 100%;
  height: 100%;
  font-size: 150%;
}

.contactitem {
  width: 100%;
  height: 72%;
  margin: 0px auto;
  padding: 0px;
  background-color: #545c64;
  overflow: auto;
}

.contactitem span {
  margin-left: 20px;
}

.contactitem i {
  font-size: 200%;
}

.contactitem li {
  height: 80px;
  line-height: 80px;
}
</style>
