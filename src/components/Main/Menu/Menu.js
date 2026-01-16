import { MenuLeft } from "./MenuLeft/MenuLeft.js"
import { Reports, loadReportsTable } from "../Reports/Reports.js"
import { Dashboard, initDashboard } from "../Dashboard/Dashboard.js"
import { viewReport } from "../Reports/Reports.js"

export const Menu = () => {
    return `
        <div class="container-fluid">
            <div class="row">
                <!-- SIDEBAR -->
                <div class="col-1 bg-dark" id="MenuLeft">
                    ${MenuLeft()}
                </div>

                <!-- CONTENIDO -->
                <div class="col-11 offset-1 " id="RightContent">
                    
                    ${viewReport(349)}
                </div>
            </div>
        </div>

    `
}