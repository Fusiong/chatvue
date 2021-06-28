<template>
  <div class="login_container">
    <div class="login_box">
      <p class="chatp">网页版聊天室</p>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        label-width="80px"
      >
        <el-form-item label="账号:" prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
            placeholder="账号"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="密码:" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="密码"
            type="password"
          >
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button class="letterbtns" type="primary" @click="send" round
            >登陆</el-button
          >

          <router-link to="/register">
            <el-button class="rightbtns" type="info" round>注册</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      name: "login",
      socket: "",
      path: "ws://115.159.156.211:8081/login",
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入登陆名称", trigger: "blur" },
          {
            min: 1,
            max: 11,
            message: "长度在 1 到 11 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
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
    this.init();
  },
  methods: {
    init: function () {
      if (typeof WebSocket === "undefined") {
        alert("你的浏览器不支持webscoket");
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
        this.socket.close = this.close;
      }
    },
    open: function () {

    },
    error: function () {
      window.console.log("连接错误");
    },
    getMessage: function (msg) {
      let message = JSON.parse(msg.data);

      switch (message.result) {
        case 0:
          this.$message.error("输入信息错误");
          break;
        case 1:
          this.$store.commit("updateimg", message.Data.avatarImg);
          this.$store.commit("updateid", message.Data.id);
          this.$store.commit("updateName", message.Data.realName);
          this.$store.commit("updateusername", message.Data.userName);
          this.$store.commit("updatepassword", message.Data.passWord);
 
          let url =
            "http://115.159.156.211:8081/friend/getAllFriend/" +
            message.Data.id;
    
          const that = this;
          this.$axios
            .post(url)
            .then((res) => {
              let temp = [];
              for (let items of res.data) {
                items.online=false;
                items.remind=false;
                temp.push(items);
              }
            
              that.$store.commit("updateAllfriends", temp);
            })
            .catch(function (error) {
              window.console.log(error);
            });

          this.$message.success("登陆成功");
          setTimeout(() => {
            this.$router.push("/chat");
          }, 1000);
          break;
      }
    },
    send: function () {
      var msg = {
        userName: this.loginForm.username,
        passWord: this.loginForm.password,
      };
      this.socket.send(JSON.stringify(msg));
    },
    close: function () {
     
     window.onbeforeunload = function() {
        this.socket.close();
    }
    },
  },
};
</script>

<style lang="less" scoped>
.chatp {
  text-align: center;
  font-size: 30px;
  margin-top: 30px;
  margin-bottom: 40px;
}

.login_container {
  background-image: url("../assets/img/log.jpg");
  height: 100%;
  background-size: cover;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  padding-right: 40px;
}

.letterbtns {
  position: relative;
  float: left;
}

.rightbtns {
  position: relative;
  float: right;
}

.imgdiv {
  margin: 0px auto;
  text-align: center;
  margin-bottom: 20px;

  img {
    width: 40%;
    height: 40%;
    background-color: #eee;
  }

  a {
    float: right;
  }
}
</style>
