import { Units, loadUnitsTable } from "../../Units/Units.js";
import { Dashboard } from "../../Dashboard/Dashboard.js";

export const MenuLeft = () => {
  return `
    <div class="d-flex flex-column align-items-center gap-3 p-3 menu-left-buttons">

      <button class="btn btn-primary rounded-circle  menu-btn" onClick="changeView('1')" data-title="Dashboard">
        <i class="bi bi-speedometer2 fs-4"></i>
      </button>

      <button class="btn btn-primary rounded-circle  menu-btn" onClick="changeView('2')" data-title="Unidades">
        <i class="bi bi-truck fs-4"></i>
      </button>

      <button class="btn btn-primary rounded-circle  menu-btn" onClick="changeView('3')" data-title="Reportes">
        <i class="bi bi-file-bar-graph fs-4"></i>
      </button>

      <button class="btn btn-primary rounded-circle  menu-btn" onClick="changeView('4')" data-title="Configuración">
        <i class="bi bi-gear fs-4"></i>
      </button>

    </div>
  `;
};


export const changeView = (id) => {
    const root = document.getElementById("RightContent");

    switch (id) {
        case "1":
            root.innerHTML = Dashboard();
            break;

        case "2":
            root.innerHTML = Units();
            loadUnitsTable();
            break;

        case "3":
            root.innerHTML = "<h3>Reportes</h3>";
            break;

        case "4":
            root.innerHTML = "<h3>Configuración</h3>";
            break;

        default:
            root.innerHTML = "<h3>Vista no encontrada</h3>";
    }
};


window.changeView = changeView;