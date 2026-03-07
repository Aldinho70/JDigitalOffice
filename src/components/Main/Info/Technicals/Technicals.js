/* =========================
   DEPENDENCIAS
========================= */
import { request } from "../../../../Utils/request.js";

/* =========================
   CONFIG PAGINACIÓN
========================= */
const CARDS_PER_PAGE = 8;
let allTechnician = [];
let filteredTechnician = [];
let currentPage = 1;

/* =========================
   CONSULTA BACKEND
========================= */
const getTechnician = async ( filter = null ) => {
    try {
        const response = await request(
            'http://ws4cjdg.com/JDigitalReportsV2/src/api/routes/technician/getCountJobTechnician.php',
            'GET',
            { }
        );

        console.log(response);
        
        if (response.status !== 'ok') {
            alert('Error al obtener el historial de tecnicos');
            return [];
        }

        return response.mensaje;        
    } catch (error) {
        
    }
};

/* =========================
   VISTA BASE
========================= */
export const TechnicianCards = () => {
    return `
        <div class="container-fluid">

            <div class="d-flex align-items-center gap-3 mb-2">

                <!-- PAGINACIÓN -->
                <nav>
                    <ul class="pagination pagination-sm mb-0" id="technician-pagination"></ul>
                </nav>

                <!-- BUSCADOR -->
                <div class="col-md-4 d-flex align-items-center gap-1 mx-auto">
                    <label for="cards-search" class="col-form-label mb-0">Buscar</label>
                    <input 
                        type="text"
                        id="technician-search"
                        class="form-control form-control-sm"
                        placeholder="Buscar folio, cliente, concepto..."
                    >
                </div>

            </div>

            <div class="row g-3" id="technician-container"></div>
        </div>
    `;
};

/* =========================
   CARGA DE CARDS
========================= */
export const loadTechnicianCards = async ( filter ) => {

    const data = await getTechnician( filter );

    allTechnician = Array.isArray(data) ? data.reverse() : [];
    filteredTechnician = [...allTechnician];
    currentPage = 1;

    renderTechnicians();
    initTechnicianSearch();
};

/* =========================
   RENDER + PAGINACIÓN
========================= */
const renderTechnicians = () => {

    const container = document.getElementById("technician-container");

    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;

    const pageData = filteredTechnician.slice(start, end);

    container.innerHTML = pageData.map(f => TechnicianCard(f)).join("");

    renderTechniciansPagination();
};

const renderTechniciansPagination = () => {

    const pagination = document.getElementById("technician-pagination");
    const totalPages = Math.ceil(filteredTechnician.length / CARDS_PER_PAGE);

    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    $("#technician-pagination .page-link").off().on("click", function (e) {
        e.preventDefault();
        currentPage = Number($(this).data("page"));
        renderTechnicians();
    });
};

/* =========================
   BUSCADOR
========================= */
const initTechnicianSearch = () => {

    $("#technician-search").off().on("keyup", function () {

        const value = $(this).val().toLowerCase();

        filteredTechnician = allTechnician.filter(f => `
            ${f.folio}
            ${f.cliente}
            ${f.concepto}
            ${f.tipo_cobro}
            ${f.status_pago}
        `.toLowerCase().includes(value));

        currentPage = 1;
        renderTechnicians();
    });
};

/* =========================
   CARD INDIVIDUAL
========================= */
const TechnicianCard = (f) => {
    console.log(f);
    
    // const statusMap = {
    //     pending: "warning",
    //     paid: "success",
    //     overdue: "secondary"
    // };

    const statusColor = "secondary";

    // const id_report = await getIdReport(f.ticket_id);
    return `
        <div class="col-12 col-md-6 col-lg-4 col-xl-3">
            <div class="card h-100 shadow-sm border-start border-4 border-${statusColor}">

                <!-- HEADER -->
                <div class="card-header d-flex justify-content-between align-items-center">
                    <strong>
                        <i class="bi bi-receipt me-1"></i>
                        ${f.technician_name}
                    </strong>
                    <!--<span class="badge bg-${statusColor}">
                        ${f.payment_status}
                    </span>-->
                </div>

                <!-- BODY -->
                <div class="card-body small">
                    <div><strong>Telefono:</strong> ${f.technician_phone}</div>
                    <div><strong>Ciudad:</strong> ${f.technician_city}</div>
                    <div><strong>Trabajos asignados:</strong> ${f.count_assignation}</div>

                    <!--<div class="fw-bold text-success fs-6 mt-1">
                        $${Number(f.amount).toLocaleString("es-MX")}
                    </div>-->

                    ${f.comment_payment ? `
                        <hr class="my-2">
                        <div class="text-muted">
                            <i class="bi bi-chat-left-text me-1"></i>
                            ${f.comment_payment}
                        </div>
                    ` : ``}
                </div>

                <!-- FOOTER -->
                <div class="card-footer small text-muted d-flex justify-content-between">
                    <!--<div>
                        <span>Expedición: ${f.created_at_payment}</span> <br>
                        ${f.paid_at_payment ? `
                            <div class="text-success">
                            Pagado: ${f.paid_at_payment}
                            </div>
                            ` : ``}
                    </div> -->
                    <div>
                        <button class="btn btn-sm btn-warning" type="button" >
                            <i class="bi bi-eye"></i>
                            Ver mas detalles
                        </button>
                    </div>    
                </div>
            </div>
        </div>
    `;
};


const getIdReport = async ( id_ticket ) => {
    
    const report = await request('http://ws4cjdg.com/JDigitalReports/src/api/routes/utils/getQuery.php', 'post', { "query": `SELECT id_reporte FROM tickets_soporte WHERE id_ticket = ${id_ticket}`})
    if( report.status == 'ok' ){
        return report.mensaje[0].id_reporte;
    }
    return 0;
}