import { changeView } from "../../Menu/MenuLeft/MenuLeft.js";
import { viewFacturation } from "../../Info/Facturation/Facturation.js";

/* =========================
   CONFIG PAGINACION
========================= */
const CARDS_PER_PAGE = 12;
const MAX_VISIBLE_PAGES = 7;
let allReports = [];
let filteredReports = [];
let currentPage = 1;

/* =========================
   VISTA BASE
========================= */
export const ReportsCards = () => {
    return `
        <div class="container-fluid px-2 px-md-3" style="max-height: 90vh; overflow: auto;" >

            <div class="row g-2 g-md-3 align-items-center mb-2">

                <!-- PAGINADOR -->
                <div class="col-12 col-md-auto">
                    <div class="d-flex align-items-center gap-2" style="min-width: 0;">
                        <span class="fw-semibold text-muted small text-nowrap">Paginas</span>

                        <nav class="flex-grow-1" style="min-width: 0;">
                            <div class="overflow-auto" style="max-width: 100%;">
                                <ul class="pagination pagination-sm mb-0 flex-nowrap" id="cards-pagination"></ul>
                            </div>
                        </nav>
                    </div>
                </div>

                <!-- BUSCADOR -->
                <div class="col-12 col-md-5 col-lg-4">
                    <div class="d-flex align-items-center gap-1">
                        <label for="cards-search" class="col-form-label mb-0 text-nowrap">Buscar</label>
                        <input 
                            type="text"
                            id="cards-search"
                            class="form-control form-control-sm"
                            placeholder="Reporte, unidad, cliente..."
                        >
                    </div>
                </div>

                <!-- BOTONES -->
                <div class="col-12 col-md">
                    <div class="d-flex gap-1 justify-content-start justify-content-md-end flex-wrap">

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

            </div>
            
            <nav id="nav-filter-cards" class="mb-3">

                <div class="nav nav-pills gap-2 flex-wrap" id="nav-tab-reports_card" role="tablist">

                    <button class="nav-link active bg-danger text-white"
                        data-bs-toggle="tab"
                        type="button"
                        onClick="loadReportsCards('allReports')">
                        <i class="bi bi-clock"></i> Todos los reportes
                    </button>

                    <button class="nav-link bg-warning text-dark"
                        data-bs-toggle="tab"
                        type="button"
                        onClick="loadReportsCards('pending')">
                        <i class="bi bi-clock"></i> Pendientes
                    </button>

                    <button class="nav-link bg-success text-white"
                        data-bs-toggle="tab"
                        type="button"
                        onClick="loadReportsCards('completed')">
                        <i class="bi bi-check-circle"></i> Terminados
                    </button>

                    <button class="nav-link bg-primary text-white"
                        data-bs-toggle="tab"
                        type="button"
                        onClick="loadReportsCards('isBillable')">
                        <i class="bi bi-receipt"></i> Facturados
                    </button>

                    <button class="nav-link bg-dark text-white"
                        data-bs-toggle="tab"
                        type="button">
                        <i class="bi bi-people"></i> Técnicos
                    </button>

                </div>

            </nav>

            <div class="row g-3" id="reports-cards-container"></div>

        </div>
    `;
};

/* =========================
   CARGA DE CARDS
========================= */
export const loadReportsCards = async ( filter ) => {
    try {
        // const url = `http://ws4cjdg.com/JDigitalReportsV2/src/api/routes/reports/viewReportsTickets.php`;
        const url = `http://ws4cjdg.com/JDigitalReportsV2/src/api/routes/reports/viewReportsTickets.php?filter=${filter}`;
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
window.loadReportsCards = loadReportsCards;
/* =========================
   RENDER CARDS + PAGINACION
========================= */
const renderCards = () => {
    const container = document.getElementById("reports-cards-container");
    const totalPages = Math.max(1, Math.ceil(filteredReports.length / CARDS_PER_PAGE));

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;
    const pageData = filteredReports.slice(start, end);

    container.innerHTML = pageData.map(r => createReportCard(r)).join("");

    renderPagination(totalPages);
};

const buildPagesToShow = (totalPages, activePage) => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];
    const innerSlots = MAX_VISIBLE_PAGES - 2;
    let start = Math.max(2, activePage - Math.floor(innerSlots / 2));
    let end = start + innerSlots - 1;

    if (end >= totalPages) {
        end = totalPages - 1;
        start = end - innerSlots + 1;
    }

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);
    return pages;
};

const renderPagination = (totalPages) => {
    const pagination = document.getElementById("cards-pagination");

    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    const pagesToShow = buildPagesToShow(totalPages, currentPage);
    const prevDisabled = currentPage === 1 ? "disabled" : "";
    const nextDisabled = currentPage === totalPages ? "disabled" : "";

    let html = `
        <li class="page-item ${prevDisabled}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Anterior">&laquo;</a>
        </li>
    `;

    html += pagesToShow.map(p => {
        if (p === "...") {
            return `
                <li class="page-item disabled" aria-disabled="true">
                    <span class="page-link">...</span>
                </li>
            `;
        }

        return `
            <li class="page-item ${p === currentPage ? "active" : ""}">
                <a class="page-link" href="#" data-page="${p}">${p}</a>
            </li>
        `;
    }).join("");

    html += `
        <li class="page-item ${nextDisabled}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Siguiente">&raquo;</a>
        </li>
    `;

    pagination.innerHTML = html;

    $("#cards-pagination .page-link").off().on("click", function (e) {
        e.preventDefault();

        const page = Number($(this).data("page"));
        if (!Number.isInteger(page) || page < 1 || page > totalPages || page === currentPage) {
            return;
        }

        currentPage = page;
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
                ${r.id_report}
                ${r.id_ticket}
                ${r.unit_name}
                ${r.client_name}
                ${r.monitor_name}
                ${r.report_type}
                ${r.status_ticket}
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
                                <strong>Tecnico:</strong> ${r.technician_name}
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
