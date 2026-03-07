import { MenuLeft } from "./MenuLeft/MenuLeft.js"
import { Reports, loadReportsTable } from "../Reports/Reports.js"
import { ReportsCards, loadReportsCards } from "../Reports/ReportCards/ReportCard.js"
import { Dashboard, initDashboard } from "../Dashboard/Dashboard.js"
import { viewReport } from "../Reports/Reports.js"
import { FacturasCards, loadFacturasCards } from "../Info/Facturation/Facturacion.js"
import { TechnicianCards, loadTechnicianCards } from "../Info/Technicals/Technicals.js"

export const Menu = () => {
    return `
        <div class="">
            <div class="row">
                <!-- SIDEBAR -->
                <div class="col-1 bg-dark" id="MenuLeft">
                    ${MenuLeft()}
                </div>

                <!-- CONTENIDO -->
                <div class="col-11" id="RightContent">
                    ${ TechnicianCards() }
                    ${ loadTechnicianCards() }
                </div>
            </div>
        </div>

    `
}