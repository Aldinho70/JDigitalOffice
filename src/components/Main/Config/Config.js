import { Tecnicos } from "./Tecnicos/Tecnicos.js";
import { TiposFallas } from "./TipoFallas/TipoFallas.js";

export const Config = () => {
    return `
        <div class="container py-5">

            <h4 class="mb-4 fw-semibold">
                Configuración general
            </h4>

            <div class="row g-4">

                ${TiposFallas()}

                ${Tecnicos()}

                <!-- Placeholder futuro -->
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm config-card border-dashed">
                        <div class="card-body text-center text-muted">

                            <i class="bi bi-gear display-4 mb-3"></i>

                            <h6 class="fw-bold">Más configuraciones</h6>
                            <p class="small">
                                Próximamente nuevas opciones del sistema.
                            </p>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;
};
