/**
 * 封装操作localstorage本地存储的方法
 */
 export const storage = {
  // 存储
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  },
  // 取出数据
  get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      console.log(error);
    }
  },
  // 删除数据
  remove(key) {
    localStorage.removeItem(key);
  }
};

/**
 * 封装操作sessionStorage本地存储的方法
 */
export const mySessionStorage = {
  // 存储
  set(key, value) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  },
  // 取出数据
  get(key) {
    try {
      return JSON.parse(window.sessionStorage.getItem(key));
    } catch (error) {
      console.log(error);
    }
  },
  // 删除数据
  remove(key) {
    window.sessionStorage.removeItem(key);
  }
};
