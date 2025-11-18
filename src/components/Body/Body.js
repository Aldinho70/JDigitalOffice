import { Menu } from "../Main/Menu/Menu.js";
import { Navbar } from "../Navbar/Navbar.js";

$( () => {
    $("body").append(`
        ${Navbar()}

        ${Menu()}
    `)

    
})