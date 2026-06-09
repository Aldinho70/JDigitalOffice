import { Menu } from "../Main/Menu/Menu.js";
import { Navbar } from "../Navbar/Navbar.js";
import { Login } from "../Main/Login/Login.js";
import { changeView } from "../Main/Menu/MenuLeft/MenuLeft.js";
import { AddReports, loadUnitsSelect2, loadTypeFailureSelect2, loadMonitoring } from "../Main/Reports/AddReports/AddReports.js";

$(() => {
    const session = sessionStorage.getItem('session');
    const role = sessionStorage.getItem('user');

    if (session) {
        if( role == 'monitoreo' ){
           $("body").html(`
                ${AddReports()}
                ${loadMonitoring()}
                ${loadTypeFailureSelect2()}
            `);
        }else{
            $("body").append(`
                ${Navbar()}
                ${Menu()}
            `)
        }
    } else {
        $("body").append(`
            ${Login()}
        `)
    }
})