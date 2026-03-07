import { Config } from "../../Config/Config.js";
import { Calendar } from "../../Calendar/Calendar.js";
import { Reports, loadReportsTable } from "../../Reports/Reports.js";
import { Dashboard, initDashboard } from "../../Dashboard/Dashboard.js";
import { ReportsCards, loadReportsCards } from "../../Reports/ReportCards/ReportCard.js";
import { FacturasCards, loadFacturasCards } from "../../Info/Facturation/Facturacion.js";
import { TechnicianCards, loadTechnicianCards } from "../../Info/Technicals/Technicals.js";
import { AddReports, loadUnitsSelect2, loadTypeFailureSelect2, loadMonitoring } from "../../Reports/AddReports/AddReports.js";

export const MenuLeft = () => {
  return `
    <div class="d-flex flex-column align-items-center gap-3 p-3 menu-left-buttons">

      <button class="btn btn-warning rounded-circle  menu-btn" onClick="changeView('1')" data-title="Dashboard">
        <i class="bi bi-speedometer2 fs-4"></i>
      </button>

      <!-- <button class="btn btn-warning rounded-circle  menu-btn" onClick="changeView('2')" data-title="Unidades">
        <i class="bi bi-truck fs-4"></i>
      </button>-->

      <button class="btn btn-warning rounded-circle  menu-btn" onClick="changeView('3')" data-title="Reportes">
        <i class="bi bi-file-bar-graph fs-4"></i>
      </button>

      <button class="btn btn-warning rounded-circle  menu-btn" onClick="changeView('7')" data-title="Facturas">
        <i class="bi bi bi-cash-coin fs-4"></i>
      </button>

      <button class="btn btn-warning rounded-circle  menu-btn" onClick="changeView('8')" data-title="Pago de tecnicos">
        <div class="d-flex aling-align-items-baseline justify-content-center p-1" style=" max-width: 25px; height: 35px;">
          <span class="">$</span>
          <span class="material-symbols-outlined">engineering</span>
        </div>
      </button>

      <button class="btn btn-warning rounded-circle  menu-btn" onClick="changeView('6')" data-title="Calendario">
        <i class="bi bi-calendar-date fs-4"></i>
      </button>

      <button class="btn btn-warning rounded-circle  menu-btn" onClick="changeView('5')" data-title="Configuración">
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
      initDashboard();
      break;

    case "2":
      root.innerHTML = Reports();
      loadReportsTable('allReports');
      break;

    case "3":
      root.innerHTML = ReportsCards();
      loadReportsCards('allReports');
      break;

    case "4":
      root.innerHTML = AddReports();
      loadMonitoring();
      loadTypeFailureSelect2();
      // loadUnitsSelect2();
      break;

    case "5":
      root.innerHTML = Config();
      break;

    case "6":
      root.innerHTML = Calendar();
      break;

    case "7":
      root.innerHTML = FacturasCards();
      loadFacturasCards();
      break;

    case "8":
      root.innerHTML = TechnicianCards();
      loadTechnicianCards();
      break;

    default:
      root.innerHTML = "<h3>Vista no encontrada</h3>";
  }
};


window.changeView = changeView;