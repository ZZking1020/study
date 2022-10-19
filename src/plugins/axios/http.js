import axios from 'axios';
import { Toast } from 'vant';

export default class {
  constructor(config) {
    // 创建axios实例
    this.axiosInstance = axios.create(config);
    this.requestInterceptor();
    this.responseInterceptor();
  }
  /** 请求拦截器 */
  requestInterceptor() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (config.loading) {
          this.loading = Toast.loading({
            message: '加载中...',
            forbidClick: true, // 禁止点击
            duration: 0, // 持续时间 0 为不自动关闭
          });
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }
  /** 响应拦截器 */
  responseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response) => this.handleResponse(response.data),
      (error) => this.handleError(error.response)
    );
  }

  /** 处理响应数据 */
  handleResponse({ code, message, data }) {
    // 清除loading
    this.loading && this.loading.clear();
    if (code === 200) {
      return message ? Toast.success(message) : data;
    }
    // 错误处理 提示错误信息
    Toast.fail(message);
  }
  /** 处理错误响应 */
  handleError(error) {
    // 清除loading
    this.loading && this.loading.clear();

    const status = error && error.status;
    let message = '';
    switch (status) {
      case 400:
        message = '请求错误';
        break;
      case 401:
        message = '未授权，请登录';
        // 跳转登录页
        break;
      case 404:
        message = '请求地址出错';
        break;
      case 500:
        message = '服务器内部错误';
        break;
      default:
        message = '未知错误';
        break;
    }
    Toast.fail(message);
  }

  /** get请求 */
  get(config) {
    return this.axiosInstance.request({ method: 'GET', ...config });
  }
  /** post请求 */
  post(config) {
    return this.axiosInstance.request({ method: 'POST', ...config });
  }
  /** post请求 */
  delete(config) {
    return this.axiosInstance.request({ method: 'DELETE', ...config });
  }
  /** put请求 */
  put(config) {
    return this.axiosInstance.request({ method: 'PUT', ...config });
  }
}
