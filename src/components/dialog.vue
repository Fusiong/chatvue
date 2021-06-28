<template>
  <div class="dialogpapel">
    <div class="header">
      <span v-if="contact">{{ contact.realName }}</span>
    </div>

    <div class="mainchat">
      <div v-if="$store.getters.getSessionmes.length && contact">
        <div v-for="(msg, i) in $store.getters.getSessionmes" :key="i">
          <div class="leftmessage" v-if="msg.fromId == contact.id">
            <div class="leftavatar">
              <img :src="contact.avatarImg" style="width: 40px; height: 40px" />
            </div>
            <div class="content">
              <div class="plain">
                <span>{{ msg.content }}</span>
              </div>
            </div>
          </div>

          <div
            class="rightmessage"
            v-if="
              msg.fromId == $store.getters.getid &&
              msg.only.includes(contact.id)
            "
          >
            <div class="rightavatar">
              <img
                :src="$store.getters.getavatarImg"
                style="width: 40px; height: 40px"
              />
            </div>
            <div class="rightcontent">
              <div class="rightplain">
                <span>{{ msg.content }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="middlebutton" v-if="contact">
      <el-button
        size="mini"
        icon="el-icon-time"
        style="height: 100%; float: right; border-color: white"
        @click="getallhistory"
      >
      </el-button>
    </div>

    <el-dialog
      :visible.sync="histroydialog"
      width="45%"
      center
      :before-close="handleClose"
    >
      <div class="topcheck" slot="title">
        <el-input
          v-model="input"
          placeholder="请输入内容"
          style="width: 40%"
        ></el-input>
        <el-button style="font-size: 14px" @click="selectContect"
          >搜索</el-button
        >

        <el-date-picker
          v-model="value"
          style="width: 30%; margin-left: 3%"
          align="right"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="selectTime"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </div>
      <div
        class="oldmainchat"
        style="background: white; border-bottom: 1px white solid"
      >
        <div v-if="oldhistory.length && contact">
          <div v-for="(msg, i) in oldhistory" :key="i">
            <div style="text-align: center">
              <span v-if="i%10==0">{{ msg.createTime }}</span>
            </div>
            <div class="leftmessage" v-if="msg.fromId == contact.id">
              <div class="leftavatar">
                <img
                  :src="contact.avatarImg"
                  style="width: 40px; height: 40px"
                />
              </div>
              <div class="content">
                <div class="plain">
                  <span>{{ msg.content }}</span>
                </div>
              </div>
            </div>

            <div
              class="rightmessage"
              v-if="
                msg.fromId == $store.getters.getid &&
                msg.only.includes(contact.id)
              "
            >
              <div class="rightavatar">
                <img
                  :src="$store.getters.getavatarImg"
                  style="width: 40px; height: 40px"
                />
              </div>
              <div class="rightcontent">
                <div class="rightplain">
                  <span>{{ msg.content }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="histroydialog = false">取 消</el-button>
        <el-button type="primary" @click="histroydialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <div class="bottomchat" v-if="contact">
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
        v-model="textarea"
        resize="none"
        class="messageText"
      >
      </el-input>
    </div>

    <div class="enterbutton" v-if="contact">
      <el-button class="gobutton" @click="tosend">发送</el-button>
      <span style="float:right">按下ctrl+enter发送</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "Dialog",
  props: {
    contact: {
      type: Object,
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(date) {
          let zero = new Date().setHours(0, 0, 0, 0);
          if (date.getTime() <= zero) {
            return false;
          }
          return true;
        },
      },
      textarea: "",
      socket: null,
      path: "ws://115.159.156.211:8081/chatSocketOneToOne/",
      msgList: this.$store.getters.getSessionmes,
      histroydialog: false,
      input: "",
      value: "",
      oldhistory: [],
    };
  },
  mounted() {
    this.handler();
  },
  created() {
    document.addEventListener("keydown", this.keyEnter, false);
  },
  watch: {
    contact: {
      handler() {
        if (typeof WebSocket === "undefined") {
          alert("你的浏览器不支持webscoket");
        } else {
          // 实例化socket
          this.socket = new WebSocket(this.path + this.$store.getters.getid);
          // 监听socket连接
          this.socket.onopen = this.open;
          // 监听socket错误信息
          this.socket.onerror = this.error;
          // 监听socket消息
          this.socket.onmessage = this.getMessage;
          this.socket.close = this.close;
        }
      },

    },
  },
  methods: {
    handler() {
      if (typeof WebSocket === "undefined") {
        alert("你的浏览器不支持webscoket");
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.path + this.$store.getters.getid);
        // 监听socket错误信息
        this.socket.onopen = function () {
   
        };
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
        this.socket.close = this.close;
      }
    },
    keyEnter(e) {
      if (e.keyCode == 13 && e.ctrlKey) {
        this.tosend();
       
      }
    },
    tosend() {
      if (!this.textarea) {
        this.$message.error("信息不可为空");
        return;
      }
      let msg = {
        fromId: this.$store.getters.getid,
        toId: this.contact.id,
        content: this.textarea,
        type: 1,
        roomId: this.$store.getters.getid,
        msgType: 1,
      };
      this.socket.send(JSON.stringify(msg));
      this.textarea = "";
     
    },
    open() {
      let url =
        "http://115.159.156.211:8081/message/getUnReadMessage" +
        "/" +
        this.contact.id +
        "/" +
        this.$store.getters.getid;
      const that = this;

      this.$axios
        .post(url)
        .then((res) => {
          for (let items of res.data) {
            items.only = [that.contact.id, that.$store.getters.getid];
            that.$store.commit("updateSessionmes", items);
          }
        })
        .catch(function (error) {
          window.console.log(error);
        });

      //发送通知
      let msg = {
        fromId: this.contact.id,
        toId: this.$store.getters.getid,
        msgType: 0, // Msgtype:0 未读消息已读,请求更新消息为已读
      };

      this.socket.send(JSON.stringify(msg)); //发送message给websocket
      setTimeout(()=>{
      this.ScrollToBottom();
      },0)
    },
    error: function () {
      window.console.log("连接错误");
    },
    getMessage: function (msg) {
      let msglist = JSON.parse(msg.data);
      if (msglist.fromId == this.$store.getters.getid) {
        msglist.only = [this.contact.id, this.$store.getters.getid];
      } else if (msglist.fromId != this.$store.getters.getid) {
        msglist.only = [msglist.fromId, this.$store.getters.getid];
      }
 
      this.$store.commit("updateSessionmes", msglist);
      setTimeout(()=>{
      this.ScrollToBottom();
      },100)
    },

    close: function () {
      this.socket.close();
    },
    getallhistory() {
      let all = [];
      this.histroydialog = true;
      const that = this;

      let url =
        "http://115.159.156.211:8081/message/getMessage" +
        "/" +
        this.contact.id +
        "/" +
        this.$store.getters.getid;

      this.$axios
        .post(url)
        .then((res) => {
          for (let item of res.data) {
            item.only = [that.contact.id, that.$store.getters.getid];

            all.push(item);
          }
        })
        .catch(function (error) {
          window.console.log(error);
        });

      this.oldhistory = all;
      this.$store.commit("updatehistory", all);

    },
    handleClose() {
      this.value = "";
      this.input = "";
      this.histroydialog = false;
    },
    selectContect() {
      let history = this.$store.getters.gethistory;
      let value = this.input;
      let content;
      if (!value) {
        this.oldhistory = history;
      } else {
        this.oldhistory = history.filter((item, i) => {
          content = item.content;
          return !content.indexOf(value);
        });
      }
    },
    selectTime() {
      let history = this.$store.getters.gethistory;
      let data1;
      let data2 = this.value;
      if (!data2) {
        this.oldhistory = history;
      } else {
        this.oldhistory = history.filter((item, i) => {
          data1 = item.createTime.substring(0, item.createTime.length - 9);
          return data1 == data2;
        });
      }
    },
    ScrollToBottom(){
      this.$nextTick(()=>{
        let box = this.$el.querySelector(".mainchat");
        box.scrollTop = box.scrollHeight;
      })
    }
  },
  destroyed() {
    document.removeEventListener("keydown", this.keyEnter, false);
  },
 
};
</script>

<style lang="less" scoped>
.dialogpapel {
  float: left;
  margin-top: 80px;
  width: 55%;
  height: 80%;
  background: rgb(238, 238, 238);
}

.header {
  font-size: 22px;
  height: 10%;
  border-top: 1px rgb(214, 214, 214) solid;
  border-bottom: 1px rgb(214, 214, 214) solid;
  text-align: center;
  line-height: 60px;
}

.topcheck {
  height: 10%;
  background-color: white;
}

.mainchat {
  height: 60%;
  background-color: rgb(238, 238, 238);
  border-bottom: 1px rgb(214, 214, 214) solid;
  overflow: hidden !important;
  overflow-y: auto !important;
}

.oldmainchat {
  height: 60%;
  background-color: rgb(238, 238, 238);
  border-bottom: 1px rgb(214, 214, 214) solid;
  overflow: hidden !important;
  overflow-y: auto !important;
}

.middlebutton {
  height: 5%;
  background-color: white;
}

.bottomchat {
  height: 17.5%;
  background-color: white;
}

.enterbutton {
  height: 7.1%;
  background-color: white;
}

.enterbutton span {
  font-size: 18px;
  display: inline-block;
  height: 100%;
  line-height: 42.67px;
  margin-right: 30px;
}

.gobutton {
  float: right;
  margin-right: 20px;
}

.leftmessage {
  padding-top: 20px;
  padding-left: 20px;
  width: 100%;
  max-width: 100%;
  float: left;
}

.rightmessage {
  padding-top: 20px;
  padding-right: 20px;
  width: 100%;
  max-width: 100%;
  float: right;
}

.leftavatar {
  width: 50px;
  height: 50px;
  border-radius: 25%;
  float: left;
}

.rightavatar {
  width: 50px;
  height: 50px;
  border-radius: 25%;
  float: right;
}

.content {
  float: left;
  width: 80.7%;
  line-height: 40px;
  font-size: 18px;
  margin-left: 20px;
  position: relative;
}

.rightcontent {
  float: right;
  width: 80.7%;
  line-height: 40px;
  font-size: 18px;
  margin-right: 20px;
  position: relative;
}

.plain {
  display: inline-block;
  padding-right: 10px;
  padding-left: 10px;
  border-radius: 5px;
  background-color: #b2e281;
}

.plain::before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  left: -17px;
  top: 12px;
  border: 9px solid;
  border-color: transparent #b2e281 transparent transparent;
}

.rightplain {
  float: right;
  padding-right: 10px;
  padding-left: 10px;
  border-radius: 5px;
  background-color: #b2e281;
}

.rightplain::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  right: -17px;
  top: 12px;
  border: 9px solid;
  border-color: transparent transparent transparent #b2e281;
}

.content span {
  word-wrap: break-word;
  word-break: break-all;
}

.rightcontent span {
  word-wrap: break-word;
  word-break: break-all;
}
</style>
