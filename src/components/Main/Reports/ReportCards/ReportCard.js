import { changeView } from "../../Menu/MenuLeft/MenuLeft.js";
import { Technicals } from "../../Info/Technicals/Technicals.js";
import { viewFacturation } from "../../Info/Facturation/Facturation.js";

/* =========================
   CONFIG PAGINACIÓN
========================= */
const CARDS_PER_PAGE = 8;
let allReports = [];
let filteredReports = [];
let currentPage = 1;

/* =========================
   VISTA BASE
========================= */
export const ReportsCards = () => {
    return `
        <div class="container-fluid ">

            <div class="d-flex align-items-center gap-3 mb-2">

                <!-- PAGINADOR -->
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-semibold text-muted small">Páginas</span>

                    <nav>
                        <ul class="pagination pagination-sm mb-0" id="cards-pagination"></ul>
                    </nav>
                </div>

                <!-- BUSCADOR CENTRADO -->
                <div class="col-md-4 d-flex align-items-center gap-1 mx-auto">
                    <label for="cards-search" class="col-form-label mb-0">Buscar</label>
                    <input 
                        type="text"
                        id="cards-search"
                        class="form-control form-control-sm"
                        placeholder="Reporte, unidad, cliente..."
                    >
                </div>

                <!-- BOTONES -->
                <div class="d-flex gap-1 ms-auto">

                    <!--<button class="btn btn-sm btn-warning" onClick="Technicals('root_tecnico')">
                        Tecnicos
                    </button>-->

                    <button class="btn btn-sm btn-success" onClick="changeView('4')">
                        Nuevo reporte
                    </button>

                    <button class="btn btn-sm btn-warning" onClick="changeView('2')">
                        Cambiar vista
                    </button>
                    
                </div>

            </div>

            <div class="row g-3" id="reports-cards-container"></div>

        </div>
    `;
};

/* =========================
   CARGA DE CARDS
========================= */
export const loadReportsCards = async () => {
    try {
        const url = `http://ws4cjdg.com/JDigitalReportsV2/src/api/routes/reports/viewReportsTickets.php`;
        const resp = await fetch(url);
        const data = await resp.json();

        allReports = Array.isArray(data) ? data : [data];
        filteredReports = [...allReports.reverse()];
        currentPage = 1;

        renderCards();
        initCardsSearch();

    } catch (err) {
        console.error("Error cargando cards:", err);
    }
};

/* =========================
   RENDER CARDS + PAGINACIÓN
========================= */
const renderCards = () => {
    const container = document.getElementById("reports-cards-container");

    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;

    const pageData = filteredReports.slice(start, end);

    container.innerHTML = pageData.map(r => createReportCard(r)).join("");

    renderPagination();
};

const renderPagination = () => {
    const pagination = document.getElementById("cards-pagination");
    const totalPages = Math.ceil(filteredReports.length / CARDS_PER_PAGE);

    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    $("#cards-pagination .page-link").off().on("click", function (e) {
        e.preventDefault();
        currentPage = Number($(this).data("page"));
        renderCards();
    });
};

/* =========================
   BUSCADOR
========================= */
const initCardsSearch = () => {
    $("#cards-search").off().on("keyup", function () {
        const value = $(this).val().toLowerCase();

        filteredReports = allReports.filter(r => {
            const searchData = `
                ${r.id}
                ${r.nombreUnidad}
                ${r.Idunidad}
                ${r.cliente}
                ${r.tipoReporte}
                ${r.estado}
            `.toLowerCase();

            return searchData.includes(value);
        });

        currentPage = 1;
        renderCards();
    });
};

/* =========================
   CARD INDIVIDUAL
========================= */
const createReportCard = (r) => {
    console.log(r);
    
    const statusMap = {
        pending: "danger",
        completed: "success",
        in_progress: "warning",
    };

    const statusColor = statusMap[r.status_ticket] || "dark";

    return `
        <div class="col-12 col-md-6 col-lg-4 col-xl-3">
            <div class="card h-100 shadow-sm border-start border-4 border-${statusColor}">

                <!-- HEADER -->
                <div class="card-header d-flex justify-content-between align-items-center bg-light">
                    <div class="fw-bold">
                        <i class="bi bi-ticket-perforated me-1 text-${statusColor}"></i>
                        Report #${r.id_report}
                    </div>
                    <span class="badge bg-${statusColor}">
                    ${r.status_ticket}
                    </span>
                </div>

                <!-- BODY -->
                <div class="card-body">

                <!-- UNIDAD -->
                <div class="d-flex justify-content-between" >
                    <h6 class="fw-bold mb-1">
                        <i class="bi bi-truck me-1"></i>
                        ${r.unit_name}
                    </h6>
                    
                    <h6 class="fw-bold mb-1">
                        <i class="bi bi-person me-1"></i>
                        ${r.monitor_name}
                    </h6>

                </div>
                <!--<small class="text-muted d-block">
                    ID Unidad: ${r.Idunidad}
                </small>-->

                <!-- TIPO -->
                <span class="badge bg-warning text-dark">
                    ${r.report_type}
                </span>

                <hr class="my-2">

                <!-- INFO CLAVE -->
                <div class="small mb-2">
                    <div>
                        <i class="bi bi-person me-1"></i>
                        <strong>Cliente:</strong> ${r.client_name}
                    </div>

                    ${(r.technician_name != null ) 
                        ? ` <div>
                                <i class="bi bi-wrench-adjustable me-1"></i>
                                <strong>Técnico:</strong> ${r.technician_name}
                            </div>` 
                        : ``}
                    </div>

                    <!-- FECHAS -->
                    <div class="small text-muted">
                        <i class="bi bi-calendar-event me-1"></i>
                        Reporte: ${r.report_date}
                    </div>

                    <!-- INDICADORES -->
                    <div class="d-flex flex-wrap gap-1">
                        ${r.is_billable == 1 ? `<span class="badge bg-success">Facturable</span>` : ``}
                        ${r.assigned_at_technician != null ? `<span class="badge bg-info">Asig. Tecnico</span>` : ``}
                    </div>
                </div>

                <!-- FOOTER -->
                <div class="card-footer bg-white d-flex justify-content-between align-items-center">
                    <button class="btn btn-sm btn-success w-100 me-1" onClick="viewReport('${r.id_report}')">
                        <i class="bi bi-eye me-1"></i> Ver detalles
                    </button>

                    <!--<button class="btn btn-sm btn-warning" onClick="editReport('${r.id_report}')">
                        <i class="bi bi-pencil-square"></i>
                    </button>-->

                    <button class="btn btn-sm btn-danger" onClick="deleteReport('${r.id_report}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>

            </div>
        </div>

    `;
};
