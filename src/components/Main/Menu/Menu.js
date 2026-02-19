import { MenuLeft } from "./MenuLeft/MenuLeft.js"
import { Reports, loadReportsTable } from "../Reports/Reports.js"
import { Dashboard, initDashboard, initKpiPopovers } from "../Dashboard/Dashboard.js"

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
                    ${Dashboard()}
                    ${initDashboard()}
                    ${initKpiPopovers()}
                </div>
            </div>
        </div>

    `
}