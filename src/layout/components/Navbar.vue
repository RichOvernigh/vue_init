<template>
  <div class="navbar" :style="{ background: sideTheme === 'theme-dark' ? variables.menuBg : variables.navBgColor }">
    <!-- <div class="navbar" :style="{ background: sideTheme === 'theme-dark' ? variables.menuBg : variables.navBgColor }"> -->
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img v-if="avatar" :src="avatar" class="user-avatar"> -->
          <img src="@/assets/images/user.jpg" class="user-avatar" alt="">
          <!-- <span v-else class="user-avatar-name">{{ name.substr(0,1) }}</span> -->
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <!-- <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';
import Screenfull from '@/components/Screenfull';
// import SizeSelect from '@/components/SizeSelect';
// import Search from '@/components/HeaderSearch';
// import RuoYiGit from '@/components/RuoYi/Git';
// import RuoYiDoc from '@/components/RuoYi/Doc';
import variables from '@/assets/styles/variables.scss';

export default {
  components: {
    // Breadcrumb,
    Hamburger,
    Screenfull
    // SizeSelect,
    // Search,
    // RuoYiGit,
    // RuoYiDoc
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'name'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        });
      }
    },
    variables() {
      return variables;
    },
    sideTheme() {
      return this.$store.state.settings.sideTheme;
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          // location.href = '/admin/index';
          location.href = '/index';
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user-avatar-name {
  width: 30px;
  height: 30px;
  border: 1px solid #ffffff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  margin-top: 10px;
}
.navbar {
  // height: 50px;
  height: 100px;
  overflow: hidden;
  position: relative;
  // background: #1890FF;
  background: #fff;
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 100px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 100px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 20px;
      height: 100%;
      font-size: 16px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      // line-height: 113px;
      .avatar-wrapper {
        // margin-top: 10px;
        position: relative;

        .user-avatar {
          margin-top: 29px;
          cursor: pointer;
          width: 50px;
          height: 50px;
          // border-radius: 10px;
          // background: #6374FF;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
