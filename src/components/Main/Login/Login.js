import { Menu } from "../Menu/Menu.js";
import { Navbar } from "../../Navbar/Navbar.js";
import { changeView } from "../Menu/MenuLeft/MenuLeft.js";
import { AddReports, loadUnitsSelect2, loadTypeFailureSelect2, loadMonitoring} from "../Reports/AddReports/AddReports.js";

export const Login = () => {
    return `
        <div class="container-fluid login-container d-flex justify-content-center align-items-center bg-black">

            <div class="card login-card bg-secondary">

                <div class="logo-circle">
                    <img src="./src/assets/logojd.png" alt="Logo" class="d-inline-block align-text-top">
                </div>

                <div class="card-body">

                    <h4 class="text-center text-warning fw-bold mb-4">
                        Iniciar Sesión
                    </h4>

                    <form id="loginForm">
                    <div class="mb-3">
                        <input
                            type="text"
                            class="form-control"
                            id="username"
                            placeholder="Usuario"
                            required>
                    </div>

                    <div class="mb-4">
                        <input
                            type="password"
                            class="form-control"
                            id="password"
                            placeholder="Contraseña"
                            required>
                    </div>

                    <button
                        type="submit"
                        class="btn btn-warning w-100">
                        Entrar
                    </button>
                </form>

                </div>

            </div>

        </div>
    `
}

document.addEventListener("submit", login);

function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const users = {
        "Monitoreo 01": {
            password: "monitoreo01_2026TM",
            role: "monitoreo"
        },
        "Monitoreo 02": {
            password: "monitoreo02_2026LRD",
            role: "monitoreo"
        },
        "Soporte": {
            password: "Soporte_2026KO",
            role: "soporte"
        }
    };

    const user = users[username];

    if (user && user.password === password) {

        alert(`Bienvenido ${username}`);

        sessionStorage.setItem('session', true);
        sessionStorage.setItem('user', user.role);

        if( user.role == 'monitoreo' ){
            $("body").html(`
                ${AddReports()}
                ${loadMonitoring()}
                ${loadTypeFailureSelect2()}
            `);
        }else{
            $("body").html(`
                ${Navbar()}
                ${Menu()}
            `);
        }

    } else {

        sessionStorage.setItem('session', false);

        alert("Usuario o contraseña incorrectos");

    }
}