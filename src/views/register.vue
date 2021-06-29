<template>
  <div>
    <div class="header">
      <div class="account">
        已有账号？
        <router-link to="/login">
          <a class="login">请登录</a>
        </router-link>
      </div>
    </div>
    <div class="imgcon">
      <div class="container">
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginFormRef"
          label-width="55px"
        >
          <el-form-item
            label="请输入你的账号:"
            label-width="140px"
            prop="username"
          >
            <el-input
              v-model="loginForm.username"
              prefix-icon="el-icon-user"
              placeholder="账号"
            >
            </el-input>
          </el-form-item>

          <el-form-item
            label="请输入你的密码:"
            label-width="140px"
            prop="password"
          >
            <el-input
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
              placeholder="密码"
              type="password"
            >
            </el-input>
          </el-form-item>

          <el-form-item label-width="240px" style="margin-top: 30px">
            <router-link to="/register">
              <el-button class="rightbtns" type="warning" @click="reg"
                >注册</el-button
              >
            </router-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script >
export default {
  name: "register",

  data() {
    return {
      socket: "",
      path: "ws://115.159.156.211:8081/register",
      loginForm: {
        username: "",
        password: "",
        repe: false,
        name: "",
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
          { required: true, message: "请选择密码", trigger: "blur" },
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
    reg() {
      var msg = {
        userName: this.loginForm.username,
        passWord: this.loginForm.password,
      };
       window.console.log(msg);
      this.socket.send(JSON.stringify(msg));
    },
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
      window.console.log(message);
      
      switch (message.result) {
        case 0:
          this.$message("用户名存在！");
          break;
        case 1:
          this.$message("注册成功");
          setTimeout(() => {
            this.$router.push("/login");
          }, 1000);
          break;
        case 2:
          this.$message("输入信息错误！");
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
 
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  background-color: #e9eef3;
  color: #333;
  text-align: right;
  height: 120px;
  line-height: 160px;
}

.header a {
  margin-right: 50px;
  text-decoration: none;
  color: red;
}

.header a :hover {
  text-decoration: underline;
}

.imgdiv {
  margin-left: 60px;
  margin-top: -140px;
  width: 210px;
  height: 100px;

  img {
    width: 100%;
    height: 100%;
  }
}

.container {
  width: 450px;
  height: 630px;
  margin: 0px auto;
  padding-top: 80px;
}

.imgcon {
  background-image: url("../assets/img/reg.jpg");
  background-size: cover;
}
</style>
