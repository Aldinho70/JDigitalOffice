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
const getFacturas = async () => {
    const response = await request(
        'http://ws4cjdg.com/JDigitalReports/src/api/routes/utils/getQuery.php',
        'POST',
        { query: "SELECT * FROM cobros_clientes" }
    );

    if (response.status !== 'ok') {
        alert('Error al obtener facturas');
        return [];
    }

    return response.mensaje;
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
                <div class="col-md-4 mx-auto">
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
export const loadFacturasCards = async () => {

    const data = await getFacturas();

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
        pendiente: "warning",
        pagado: "success",
        vencido: "danger"
    };

    const statusColor = statusMap[f.status_pago] || "secondary";

    return `
        <div class="col-12 col-md-6 col-lg-4 col-xl-3">
            <div class="card h-100 shadow-sm border-start border-4 border-${statusColor}">

                <!-- HEADER -->
                <div class="card-header d-flex justify-content-between align-items-center">
                    <strong>
                        <i class="bi bi-receipt me-1"></i>
                        ${f.folio}
                    </strong>
                    <span class="badge bg-${statusColor}">
                        ${f.status_pago}
                    </span>
                </div>

                <!-- BODY -->
                <div class="card-body small">
                    <div><strong>Cliente:</strong> ${f.cliente}</div>
                    <div><strong>Concepto:</strong> ${f.concepto}</div>
                    <div><strong>Tipo:</strong> ${f.tipo_cobro}</div>

                    <div class="fw-bold text-success fs-6 mt-1">
                        $${Number(f.costo_cliente).toLocaleString("es-MX")}
                    </div>

                    ${f.comentarios_facturacion ? `
                        <hr class="my-2">
                        <div class="text-muted">
                            <i class="bi bi-chat-left-text me-1"></i>
                            ${f.comentarios_facturacion}
                        </div>
                    ` : ``}
                </div>

                <!-- FOOTER -->
                <div class="card-footer small text-muted">
                    <div>Expedición: ${f.fecha_expedicion}</div>
                    <div>Límite pago: ${f.fecha_limite_pago}</div>
                    ${f.fecha_pago ? `
                        <div class="text-success">
                            Pagado: ${f.fecha_pago}
                        </div>
                    ` : ``}
                </div>

            </div>
        </div>
    `;
};
