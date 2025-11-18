import config from "./src/config/config.js";
import { Navbar } from "./src/components/Navbar/Navbar.js";

$( () => {
    
    $("#root-title").html(config.index.title)
    
} )

window.Navbar = Navbar