import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Qrcode from "./components/Qrcode";

// import MuseUI from "muse-ui";
import "muse-ui/dist/muse-ui.css";
// import MintUI from "mint-ui";
// import "mint-ui/lib/style.css";
import "vant/lib/index.css";
import Vant from "vant";
Vue.use(Vant);
import "muse-ui/lib/styles/base.less";
import { Paper, DataTable } from "muse-ui";
import "muse-ui/lib/styles/theme.less";
Vue.use(Qrcode);
Vue.use(Paper);
// Vue.use(DateInput);
Vue.use(DataTable);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
