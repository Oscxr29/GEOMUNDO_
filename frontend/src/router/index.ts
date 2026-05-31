import { createRouter, createWebHistory } from "vue-router";
import BienvenidaView from "../views/BienvenidaView.vue";
import SeleccionTemaView from "../views/SeleccionTemaView.vue";
import ActividadView from "../views/ActividadView.vue";
import RetroalimentacionView from "../views/RetroalimentacionView.vue";
import CalificacionView from "../views/CalificacionView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "bienvenida", component: BienvenidaView },
    { path: "/temas", name: "temas", component: SeleccionTemaView },
    { path: "/actividad/:temaId", name: "actividad", component: ActividadView, props: true },
    { path: "/retroalimentacion", name: "retroalimentacion", component: RetroalimentacionView },
    { path: "/calificacion", name: "calificacion", component: CalificacionView },
  ],
});

export default router;