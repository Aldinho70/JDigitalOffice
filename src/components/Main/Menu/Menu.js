import { MenuLeft } from "./MenuLeft/MenuLeft.js"
import { Units } from "../Units/Units.js"

export const Menu = () => {
    return `
        <div class="container-fluid">
            <div class="row">
                <!-- SIDEBAR -->
                <div class="col-1 bg-warning" id="MenuLeft">
                    ${MenuLeft()}
                </div>

                <!-- CONTENIDO -->
                <div class="col-11 offset-1" id="RightContent">
                    ${Units()}
                </div>
            </div>
        </div>

    `
}