import { createApp } from "vue";
import Search from "./Search.vue";
import "./styles.css";

// Mount function to start the app
const mount = (el) => {
  const app = createApp(Search);
  app.mount(el);

  // Return a cleanup function for when the component unmounts
  return () => {
    app.unmount();
  };
};

// If we are in development and running in isolation,
// mount immediately
if (process.env.NODE_ENV === "development") {
  const devRoot = document.querySelector("#app");
  if (devRoot) {
    mount(devRoot);
  }
}

export { mount };
