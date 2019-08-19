// import Main from "@/views/main";
export default [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Main.vue")
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue")
  }
];
