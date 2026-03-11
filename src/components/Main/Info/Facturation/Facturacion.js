/* =========================
   DEPENDENCIAS
========================= */
import { request } from "../../../../Utils/request.js";

/* =========================
   CONFIG PAGINACIÓN
========================= */
const CARDS_PER_PAGE = 8;
let allFacturas = [];
let filteredFacturas = [];
let currentPage = 1;

/* =========================
   CONSULTA BACKEND
========================= */
const getFacturas = async ( filter = null ) => {
    try {
        const response = await request(
            'http://ws4cjdg.com/JDigitalReports/src/api/routes/utils/getQuery.php',
            'POST',
            { query: `SELECT
                        *
                      FROM
                        vw_reports_tickets 
                    WHERE id_payment IS NOT NULL ${ (filter) ? `AND payment_status = '${filter}'` : '' }` }
        );

        if (response.status !== 'ok') {
            alert('Error al obtener facturas');
            return [];
        }

        return response.mensaje;        
    } catch (error) {
        
    }
};

/* =========================
   VISTA BASE
========================= */
export const FacturasCards = () => {
    return `
        <div class="container-fluid">

            <div class="d-flex align-items-center gap-3 mb-2">

                <!-- PAGINACIÓN -->
                <nav>
                    <ul class="pagination pagination-sm mb-0" id="facturas-pagination"></ul>
                </nav>

                <!-- BUSCADOR -->
                <div class="col-md-4 d-flex align-items-center gap-1 mx-auto">
                    <label for="cards-search" class="col-form-label mb-0">Buscar</label>
                    <input 
                        type="text"
                        id="facturas-search"
                        class="form-control form-control-sm"
                        placeholder="Buscar folio, cliente, concepto..."
                    >
                </div>

            </div>

            <div class="row g-3" id="facturas-container"></div>
        </div>
    `;
};

/* =========================
   CARGA DE CARDS
========================= */
export const loadFacturasCards = async ( filter ) => {

    const data = await getFacturas( filter );

    allFacturas = Array.isArray(data) ? data.reverse() : [];
    filteredFacturas = [...allFacturas];
    currentPage = 1;

    renderFacturas();
    initFacturasSearch();
};

/* =========================
   RENDER + PAGINACIÓN
========================= */
const renderFacturas = () => {

    const container = document.getElementById("facturas-container");

    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;

    const pageData = filteredFacturas.slice(start, end);

    container.innerHTML = pageData.map(f => facturaCard(f)).join("");

    renderFacturasPagination();
};

const renderFacturasPagination = () => {

    const pagination = document.getElementById("facturas-pagination");
    const totalPages = Math.ceil(filteredFacturas.length / CARDS_PER_PAGE);

    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    $("#facturas-pagination .page-link").off().on("click", function (e) {
        e.preventDefault();
        currentPage = Number($(this).data("page"));
        renderFacturas();
    });
};

/* =========================
   BUSCADOR
========================= */
const initFacturasSearch = () => {

    $("#facturas-search").off().on("keyup", function () {

        const value = $(this).val().toLowerCase();

        filteredFacturas = allFacturas.filter(f => `
            ${f.folio}
            ${f.cliente}
            ${f.concepto}
            ${f.tipo_cobro}
            ${f.status_pago}
        `.toLowerCase().includes(value));

        currentPage = 1;
        renderFacturas();
    });
};

/* =========================
   CARD INDIVIDUAL
========================= */
const facturaCard = (f) => {

    const statusMap = {
        pending: "warning",
        paid: "success",
        overdue: "secondary"
    };

    const statusColor = statusMap[f.payment_status] || "secondary";

    // const id_report = await getIdReport(f.ticket_id);
    return `
        <div class="col-12 col-md-6 col-lg-4 col-xl-3">
            <div class="card h-100 shadow-sm border-start border-4 border-${statusColor}">

                <!-- HEADER -->
                <div class="card-header d-flex justify-content-between align-items-center">
                    <strong>
                        <i class="bi bi-receipt me-1"></i>
                        ${f.invoice_folio}
                    </strong>
                    <span class="badge bg-${statusColor}">
                        ${f.payment_status}
                    </span>
                </div>

                <!-- BODY -->
                <div class="card-body small">
                    <div><strong>Cliente:</strong> ${f.client_name}</div>
                    <div><strong>Concepto:</strong> ${f.concept_payment}</div>

                    <div class="fw-bold text-success fs-6 mt-1">
                        $${Number(f.amount).toLocaleString("es-MX")}
                    </div>

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
                    <div>
                        <span>Expedición: ${f.created_at_payment}</span> <br>
                        ${f.paid_at_payment ? `
                            <div class="text-success">
                            Pagado: ${f.paid_at_payment}
                            </div>
                            ` : ``}
                    </div>    
                    <div>
                        <button class="btn btn-sm btn-warning" type="button" onClick="viewReport('${ f.id_report }')">
                            <i class="bi bi-eye"></i>
                            Ver detalles
                        </button>
                    </div>    
                </div>
            </div>
        </div>
    `;
};


const getIdReport = async ( id_ticket ) => {
    
    const report = await request(
        'http://ws4cjdg.com/JDigitalReports/src/api/routes/utils/getQuery.php', 
        'post', 
        { "query": `SELECT id_reporte FROM tickets_soporte WHERE id_ticket = ${id_ticket}`}
    )
    
    if( report.status == 'ok' ){
        return report.mensaje[0].id_reporte;
    }
    return 0;
}