import { request } from "../../../Utils/request.js";
import { changeView } from "../Menu/MenuLeft/MenuLeft.js";
import { loadReportsCards } from "./ReportCards/ReportCard.js";
import {
  AssignationTechnical,
  initAssignationTechnical,
} from "./assignationTechnical/AssignationTechnical.js";

export const Reports = () => {
  return `
        <div class="">

            <div class="card shadow-sm border-0">

                <!-- HEADER 
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0 fw-semibold">
                            <i class="bi bi-ticket-perforated me-1"></i>
                            Reportes de Soporte
                        </h6>
                        <small class="text-muted">Gestión y seguimiento de tickets</small>
                    </div>
                </div>
                -->

                <!-- BODY -->
                <div class="card-body p-2">
                    <table id="tblReports" class="table table-hover align-middle mb-0 w-100">
                        <thead class="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Gestor</th>
                                <th>Cliente</th>
                                <th>Unidad</th>
                                <th>Tipo</th>
                                <th class="text-center">
                                    <i class="bi bi-person-workspace"
                                       data-bs-toggle="tooltip"
                                       title="Estatus soporte">
                                    </i>
                                </th>
                                <th class="text-center">
                                    <i class="bi bi-tools"
                                       data-bs-toggle="tooltip"
                                       title="Estatus técnico">
                                    </i>
                                </th>
                                <th class="text-center">
                                    <i class="bi bi-cash-coin"
                                       data-bs-toggle="tooltip"
                                       title="Estatus factura">
                                    </i>
                                </th>
                                <th class="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>

            </div>

        </div>
    `;
};

export const loadReportsTable = async (filter) => {
  try {
    const url = `http://ws4cjdg.com/JDigitalReportsV2/src/api/routes/reports/viewReportsTickets.php?filter=${filter}`;
    const resp = await fetch(url);
    const data = await resp.json();

    const rows = Array.isArray(data) ? data : [data];
    console.log(data);

    // Configuración visual de estados
    const estadosUI = {
      pending: {
        icon: "bi-x-circle-fill",
        color: "text-danger",
        tooltip: "Asunto pendiente",
      },
      in_progress: {
        icon: "bi-clock-fill",
        color: "text-warning",
        tooltip: "En proceso",
      },
      completed: {
        icon: "bi-person-check-fill",
        color: "text-success",
        tooltip: "Asunto resuelto",
      },
      default: {
        icon: "bi-x-circle-fill",
        color: "text-danger",
        tooltip: "Asunto pendiente",
      },
    };

    const tecnicoUI = {
      pending: {
        icon: "bi-x-circle-fill",
        color: "text-danger",
        tooltip: "Pendiente por atender",
      },
      in_progress: {
        icon: "bi-person-check-fill",
        color: "text-warning",
        tooltip: "En proceso",
      },
      completed: {
        icon: "bi-person-check-fill",
        color: "text-success",
        tooltip: "Terminado",
      },
      default: {
        icon: "bi-person-x-fill",
        color: "text-danger",
        tooltip: "Sin asignación",
      },
    };

    const facturaUI = {
      pending: {
        icon: "bi-cash-coin",
        color: "text-warning",
        tooltip: "Factura pendiente",
      },
      overdue: {
        icon: "bi-cash-coin",
        color: "text-danger",
        tooltip: "Factura vencida",
      },
      paid: {
        icon: "bi-cash-stack",
        color: "text-success",
        tooltip: "Factura pagada",
      },
      cancelled: {
        icon: "bi-cash-coin",
        color: "text-secondary",
        tooltip: "Factura cancelada",
      },
      default: {
        icon: "bi-cash-coin",
        color: "text-danger",
        tooltip: "Sin facturar",
      },
    };

    if ($.fn.DataTable.isDataTable("#tblReports")) {
      $("#tblReports").DataTable().destroy();
    }

    const tbody = document.querySelector("#tblReports tbody");

    tbody.innerHTML = rows
      .map((r) => {
        const estado = estadosUI[r.status_ticket] ?? estadosUI.default;

        const tecnicoEstado = tecnicoUI[r.status_technician] ?? tecnicoUI.default;

        const facturaEstado = facturaUI[r.payment_status] ?? facturaUI.default;

        return `
            <tr>
                <td>${r.id_report}</td>
                <td>${r.report_date.split(" ")[0]}</td>
                <td>${r.monitor_name}</td>
                <td>${r.client_name}</td>
                <td>${r.unit_name}</td>
                <td>${r.report_type}</td>
                <td class="table-info text-center">
                    <i class="bi ${estado.icon} ${estado.color}"
                       data-bs-toggle="tooltip"
                       title="${estado.tooltip}">
                    </i>
                </td>
                <td class="table-warning text-center">
                    <i class="bi ${tecnicoEstado.icon} ${tecnicoEstado.color}"
                    data-bs-toggle="tooltip"
                    title="${tecnicoEstado.tooltip}">
                    </i>
                </td>
                <td class="table-success text-center">
                    <i class="bi ${facturaEstado.icon} ${facturaEstado.color}"
                    data-bs-toggle="tooltip"
                    title="${facturaEstado.tooltip}">
                    </i>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-primary me-1" onClick="viewReport('${r.id_report}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <!--<button class="btn btn-sm btn-warning me-1" onClick="editReport('${r.id_report}')">
                        <i class="bi bi-pencil-square"></i>
                    </button>-->
                    <button class="btn btn-sm btn-danger" onClick="deleteReport('${r.id_report}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
            `;
      })
      .join("");

    $("#tblReports").DataTable({
      responsive: true,
      info: false,
      order: [[0, "desc"]],
      pageLength: 10,
      scrollY: "65vh",
      scrollCollapse: true,
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-MX.json",
      },
      dom: '<"d-flex justify-content-between align-items-center mb-2"lfB>rtip',
      buttons: [
        {
          text: "Nuevo reporte",
          className: "btn btn-success",
          action: () => changeView("4"),
        },
        {
          text: "Cambiar vista a panel",
          className: "btn btn-warning",
          action: () => changeView("3"),
        },
      ],
    });

    // Activar tooltips
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );
    [...tooltipTriggerList].map((el) => new bootstrap.Tooltip(el));
  } catch (err) {
    console.error("Error cargando datos:", err);
  }
};

export const viewReport = async (id_report) => {
  // Modal inicial con loader
  const modalHTML = `
        <div class="modal fade" id="ReportFullView" tabindex="-1">
            <div class="modal-dialog modal-fullscreen modal-dialog-centered">
                <div class="modal-content border-0">

                    <div class="modal-header bg-dark border-bottom py-3">
                        <div class="d-flex flex-column flex-md-row align-items-md-center gap-2 w-100">
                            <h5 class="modal-title text-light mb-0">
                                <i class="bi bi-file-earmark-text me-2"></i> Detalles del Reporte
                            </h5>
                            <span class="badge rounded-pill text-bg-dark fw-semibold px-3 py-2">
                                <i class="bi bi-hash me-1"></i> Reporte id: ${id_report}
                            </span>

                        </div>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body bg-light-subtle">

                        <!-- Loader -->
                        <div id="report-loader" class="d-flex flex-column align-items-center justify-content-center text-center py-5 visually-hidden">
                            <div class="spinner-border text-warning"></div>
                            <p class="mt-3 mb-0 text-muted fw-semibold">Cargando detalle del reporte...</p>
                        </div>

                        <!-- Contenido final del reporte -->
                        <div id="report-content" class="visually-hidden"></div>

                    </div>

                </div>
            </div>
        </div>
    `;

  // Eliminar modal previo si existe
  $("#ReportFullView").remove();
  $("body").append(modalHTML);

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("ReportFullView"));
  modal.show();

  // Fetch del reporte
  try {
    const res = await axios.post(
      "http://ws4cjdg.com/JDigitalReportsV2/src/api/routes/reports/getReportById.php",
      { id_report },
    );

    const r = res.data.mensaje[0];

    const col_class =
      r.assigned_to_technician == null && r.id_payment == null
        ? "col-6"
        : "col-4";

    // HTML final del reporte
    const html = `
            <div class="container-fluid px-2 px-md-3">
                <div class="row g-2">

                    <!-- GENERAL -->
                    <div class="${col_class}">
                        <div class="card h-100 border-0 shadow-sm">
                            <div class="card-header bg-dark text-warning d-flex flex-wrap justify-content-between align-items-center gap-2">
                                <div class="d-flex align-items-center gap-2">
                                    <i class="bi bi-card-heading"></i>
                                    <span class="fw-semibold">Informacion general</span>
                                </div>
                                <div class="d-flex align-items-center gap-2">
                                    <span class="small text-secondary fw-semibold">Fecha de registro</span>
                                    <span class="badge rounded-pill text-bg-secondary">
                                        <i class="bi bi-calendar-event me-1"></i> ${r.report_date.split(" ")[0]}
                                    </span>
                                </div>
                            </div>

                            <div class="card-body bg-white">
                                <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
                                    <span class="badge text-bg-warning text-dark px-3 py-2">
                                        <i class="bi bi-exclamation-diamond me-1"></i> ${r.report_type}
                                    </span>
                                </div>

                                <div class="p-3 rounded-3 border border-secondary-subtle bg-secondary-subtle mb-3">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <div class="small text-secondary fw-semibold">Gestor</div>
                                            <div class="fw-semibold text-dark">${r.monitor_name}</div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="small text-secondary fw-semibold">Cliente</div>
                                            <div class="fw-semibold text-dark">${r.client_name}</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="p-3 rounded-3 border border-secondary-subtle bg-secondary-subtle mb-3">
                                    <div class="small text-secondary fw-semibold mb-1">
                                        <i class="bi bi-truck me-2"></i> Unidad
                                    </div>
                                    <div class="fw-semibold text-dark">${r.unit_name}</div>
                                </div>

                                <div class="p-3 rounded-3 border border-secondary-subtle bg-white">
                                    <div class="small text-secondary fw-semibold mb-1">
                                        <i class="bi bi-chat-left-text me-2"></i> Comentario del gestor
                                    </div>
                                    <div class="text-dark">
                                        ${r.comment_report || "<span class='text-secondary'>Sin comentarios</span>"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SOPORTE -->
                    <div class="${col_class}">
                        <div class="card h-100 border-0 shadow-sm">
                            <div class="card-header bg-dark text-warning d-flex flex-wrap justify-content-between align-items-center gap-2">
                                <div class="d-flex align-items-center gap-2">
                                    <i class="bi bi-pc-display"></i>
                                    <span class="fw-semibold">Soporte tecnico</span>
                                </div>
                                <div class="d-flex align-items-center gap-2">
                                    <span class="badge rounded-pill text-bg-secondary">
                                        <i class="bi bi-calendar-event me-1"></i> ${r.ticket_date?.split(" ")[0] || ''}
                                    </span>
                                    <button class="btn btn-sm btn-warning text-dark" id="btnEditarSoporte">
                                        <i class="bi bi-pencil-square me-1"></i> Editar
                                    </button>
                                </div>
                            </div>

                            <div class="card-body bg-white">
                                <fieldset class="border border-warning-subtle rounded-3 p-3 mb-3 bg-secondary-subtle">
                                    <legend class="float-none w-auto fw-semibold text-warning-emphasis">Datos de soporte tecnico</legend>
                                    <div id="soporte-view">

                                        <div class="mb-3">
                                            <div class="small text-secondary fw-semibold">
                                                <i class="bi bi-chat-dots me-2"></i> Comentario principal
                                            </div>
                                            <div class="mt-2 p-3 rounded-3 border border-secondary-subtle bg-white">
                                                ${r.comment_ticket || "<span class='text-secondary'>Sin comentarios de soporte tecnico</span>"}
                                            </div>
                                        </div>

                                        <div class="row g-3 mb-3">
                                            <div class="col-md-6">
                                                <div class="p-3 rounded-3 border border-secondary-subtle bg-white h-100">
                                                    <div class="small text-secondary fw-semibold mb-1">
                                                        <i class="bi bi-gear me-2"></i> Tipo de accion
                                                    </div>
                                                    <div class="fw-semibold text-dark">
                                                        ${
                                                        {
                                                            technician: "Escalado con tecnico",
                                                            internal: "Solucion en oficina",
                                                        }[r.resolution_type_ticket] || "No data"
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-6">
                                                <div class="p-3 rounded-3 border border-secondary-subtle bg-white h-100">
                                                    <div class="small text-secondary fw-semibold mb-1">
                                                        <i class="bi bi-flag me-2"></i> Estado de reporte
                                                    </div>
                                                    <div class="fw-semibold text-dark">
                                                        ${
                                                            {
                                                                pending: 'Pendiente',
                                                                completed: 'Completado',
                                                                in_progress: 'En proceso'
                                                            }
                                                        [r.status_ticket] || "Pendiente"
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <div class="p-3 rounded-3 border border-secondary-subtle bg-white h-100">
                                                    <div class="small text-secondary fw-semibold mb-1">Escalado con tecnico</div>
                                                    <div class="fw-semibold text-dark">
                                                        ${
                                                        r.assigned_to_technician === null
                                                            ? "Sin asignacion de tecnico"
                                                            : ({
                                                                0: "No",
                                                                1: "Si",
                                                            }[r.assigned_to_technician] ??
                                                            "")
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            ${
                                            r.assigned_to_technician == null
                                                ? `
                                                    <div class="col-md-6">
                                                        <div class="p-3 rounded-3 border border-secondary-subtle bg-white h-100 d-flex align-items-center">
                                                            <button class="btn btn-secondary w-100" id="btn_asginar_tecnico" onClick="assigTech('${id_report}')">
                                                                <i class="bi bi-person-plus me-2"></i> Asignar a tecnico
                                                            </button>
                                                        </div>
                                                    </div>
                                                `
                                                : ""
                                            }
                                        </div>

                                    </div>
                                </fieldset>

                                <!-- FORMULARIO DE EDICION (OCULTO AL INICIO) -->
                                <div id="soporte-edit" class="visually-hidden border border-warning-subtle rounded-3 p-3 bg-secondary-subtle">

                                    <!-- Comentario -->
                                    <label class="form-label fw-semibold">Comentario principal</label>
                                    <textarea id="editComentarioSoporte" class="form-control" rows="2">${r.comment_ticket || ""}</textarea>

                                    <!-- Accion -->
                                    <label class="form-label fw-semibold mt-3">Tipo de accion</label>
                                    <select id="editAccion" class="form-select">
                                        <option value="internal"   ${r.resolution_type_ticket == "internal" ? "selected" : ""}>Solucionado en oficina</option>
                                        <option value="technician" ${r.assigned_to_technician == "technician" ? "selected" : ""}>Revision fisica con tecnico</option>
                                    </select>

                                    <!-- Solucionado 
                                    <label class="form-label fw-bold mt-3">¿Equipo solucionado?</label>
                                    <select id="editSolucionado" class="form-select">
                                        <option value="si">Sí</option>
                                        <option value="no">No</option>
                                    </select> -->

                                    <!-- Resolución final 
                                    <label class="form-label fw-bold mt-3">Resolución final</label>
                                    <textarea id="editResolucion" class="form-control" rows="2">${r.resolucion || ""}</textarea> -->

                                    <!-- Estado del reporte -->
                                    <label class="form-label fw-semibold mt-3">Estado del reporte</label>
                                    <select id="editEstado" class="form-select">
                                        <option value="pending"     ${r.status_ticket == "pending"     ? "selected" : ""} >Pendiente</option>
                                        <option value="in_progress" ${r.status_ticket == "in_progress" ? "selected" : ""} >En proceso</option>
                                        <option value="completed"   ${r.status_ticket == "completed"   ? "selected" : ""} >Completado</option>
                                    </select>

                                    <label class="form-label fw-semibold mt-3">Escalado con tecnico</label>
                                    <select id="edit_scale_technician" class="form-select">
                                        <option value=1 ${r.assigned_to_technician == 1 ? "selected" : ""}> Si </option>
                                        <option value=0 ${r.assigned_to_technician == 0 ? "selected" : ""}> No </option>
                                    </select>

                                    <div id="msg-response" class="mt-3"></div>

                                    <div class="text-end mt-3">
                                        <button class="btn btn-outline-secondary" id="cancel-edit-btn">
                                            <i class="bi bi-x-square me-2"></i> Cancelar edicion
                                        </button>

                                        <button class="btn btn-warning text-dark" id="btnGuardarSoporte">
                                            <i class="bi bi-save me-2"></i> Guardar cambios
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${
                      r.assigned_to_technician == 1 || r.is_billable == 1
                        ? `
                        <div class="col-4">
                            <div class="card h-100 border-0 shadow-sm">
                                <div class="card-header bg-dark text-warning d-flex flex-wrap justify-content-between align-items-center gap-2">
                                    <div class="d-flex align-items-center gap-2">
                                        <i class="bi bi-tools"></i>
                                        <span class="fw-semibold">Seguimiento tecnico y facturacion</span>
                                    </div>
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="badge rounded-pill text-bg-secondary">
                                            <i class="bi bi-calendar-event me-1"></i> ${r.assigned_at_technician}
                                        </span>
                                        <button class="btn btn-sm btn-warning text-dark" id="btnEditarTecnico" onClick="assigTech('${id_report}')">
                                            <i class="bi bi-pencil-square me-1"></i> Editar
                                        </button>
                                    </div>
                                </div>

                                <div class="card-body bg-white">
                                    <div id="tecnico-view" class="d-grid gap-3">
                                        <fieldset class="border border-warning-subtle rounded-3 p-3 bg-secondary-subtle">
                                            <legend class="float-none w-auto fw-semibold px-2 text-warning-emphasis">Datos de tecnico</legend>
                                            <div class="row g-3">
                                                <div class="col-md-6">
                                                    <div class="p-3 rounded-3 border border-secondary-subtle bg-white h-100">
                                                        <div class="small text-secondary fw-semibold mb-1">
                                                            <i class="me-2 bi bi-person-gear"></i> Tecnico instalador
                                                        </div>
                                                        <div class="fw-semibold text-dark">
                                                            ${r.technician_name || "<span class='text-secondary'>Sin tecnico</span>"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="p-3 rounded-3 border border-secondary-subtle bg-white h-100">
                                                        <div class="small text-secondary fw-semibold mb-1">
                                                            <i class="me-2 bi bi-currency-dollar"></i> Costo de reparacion
                                                        </div>
                                                        <div class="fw-semibold text-dark">
                                                            $${r.service_cost_technician || "<span class='text-secondary'>0.00</span>"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="p-3 rounded-3 border border-secondary-subtle bg-white">
                                                        <div class="small text-secondary fw-semibold mb-1">
                                                            <i class="me-2 bi bi-arrow-bar-right"></i> Estatus de reparacion
                                                        </div>
                                                        <div class="fw-semibold text-dark">
                                                            ${
                                                              {
                                                                pending: "Pendiente",
                                                                in_progress: "En proceso",
                                                                completed: "Terminado",
                                                              }[r.status_technician] || "Sin estatus"
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="p-3 rounded-3 border border-secondary-subtle bg-white">
                                                        <div class="small text-secondary fw-semibold mb-1">
                                                            <i class="me-2 bi bi-chat-left-dots"></i> Comentarios
                                                        </div>
                                                        <div class="text-dark">
                                                            ${r.comment_technician || "<span class='text-secondary'>Sin comentarios de tecnico aun</span>"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>

                                        <fieldset class="border border-warning-subtle rounded-3 p-3 bg-secondary-subtle position-relative">
                                            <legend class="float-none w-auto fw-semibold px-2 text-warning-emphasis">Facturacion</legend>
                                            ${
                                              r.id_payment != null 
                                              ? `<button class="btn btn-sm btn-warning text-dark position-absolute" onClick="viewFacturation(${r.id_payment})" style="right: 8px; top: 8px;">
                                                  <i class="bi bi-eye me-1"></i> Ver factura
                                                </button>`
                                              : ``
                                            }
                                            <div class="row g-3">
                                                <div class="col-md-6">
                                                    <div class="p-3 rounded-3 border border-secondary-subtle bg-white h-100">
                                                        <div class="small text-secondary fw-semibold mb-1">Facturacion</div>
                                                        <div class="fw-semibold text-dark">
                                                            ${ (r.is_billable == 0 || r.is_billable == null) ? "No" : "Si" || "No data"}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="col-md-6">
                                                    <div class="p-3 rounded-3 border border-secondary-subtle bg-white h-100">
                                                        <div class="small text-secondary fw-semibold mb-1">
                                                            <i class="me-2 bi bi-book"></i> Folio
                                                        </div>
                                                        <div class="fw-semibold text-dark">${r.invoice_folio || "No data"}</div>
                                                    </div>
                                                </div>

                                                <div class="col-md-6">
                                                    <div class="p-3 rounded-3 border border-secondary-subtle bg-white h-100">
                                                        <div class="small text-secondary fw-semibold mb-1">
                                                            <i class="me-2 bi bi-currency-dollar"></i> Costo de cobro a cliente
                                                        </div>
                                                        <div class="fw-semibold text-dark">$${r.amount || "0.00"}</div>
                                                    </div>
                                                </div>

                                                <div class="col-md-6">
                                                    <div class="p-3 rounded-3 border border-secondary-subtle bg-white h-100">
                                                        <div class="small text-secondary fw-semibold mb-1">
                                                            <i class="me-2 bi bi-calendar-date"></i> Fecha de pago
                                                        </div>
                                                        <div class="fw-semibold text-dark">${r.paid_at_payment?.split(" ")[0] || "Sin pago aun"}</div>
                                                    </div>
                                                </div>

                                                <div class="col-md-6">
                                                    <div class="p-3 rounded-3 border border-secondary-subtle bg-white h-100">
                                                        <div class="small text-secondary fw-semibold mb-1">
                                                            <i class="me-2 bi bi-bookmark-fill"></i> Status de pago
                                                        </div>
                                                        <div class="fw-semibold text-dark">
                                                            ${
                                                                {
                                                                    pending: 'Pendiente de pago',
                                                                    paid: 'Factura pagada',
                                                                    overdue: 'Vencida',
                                                                    cancelled: 'Cancelada'    
                                                                }
                                                              [r.payment_status] || `No data`
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="col-md-6">
                                                    <div class="p-3 rounded-3 border border-secondary-subtle bg-white h-100">
                                                        <div class="small text-secondary fw-semibold mb-1">
                                                            <i class="me-2 bi bi-bookmark-fill"></i> Concepto
                                                        </div>
                                                        <div class="fw-semibold text-dark">
                                                            ${
                                                                {
                                                                    warranty: 'Garantia',
                                                                    service: 'Servicio general',
                                                                    general: 'General',
                                                                }
                                                              [r.concept_payment] || `No data`
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="col-md-12">
                                                    <div class="p-3 rounded-3 border border-secondary-subtle bg-white">
                                                        <div class="small text-secondary fw-semibold mb-1">
                                                            <i class="me-2 bi bi-chat-left-dots"></i> Comentario de factura
                                                        </div>
                                                        <div class="text-dark">${r.comment_payment || "Sin comentario en la factura"}</div>
                                                    </div>
                                                </div>

                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>`
                        : ``
                    } 
                </div>
            </div>
        `;
    // Mostrar el contenido final
    $("#report-content").html(html).removeClass("visually-hidden");
    $("#report-loader").addClass("visually-hidden");

    // Activar modo edición
    $("#btnEditarSoporte").on("click", () => {
      $("#soporte-view").addClass("visually-hidden");
      $("#soporte-edit").removeClass("visually-hidden");
    });

    // Botón cancelar edición
    $("#cancel-edit-btn").on("click", () => {
      $("#soporte-view").removeClass("visually-hidden");
      $("#soporte-edit").addClass("visually-hidden");
    });

    // Guardar cambios
    $("#btnGuardarSoporte").on("click", async () => {
      const msgBox = $("#msg-response");
      const payload = {
        is_billable: null,
        report_id: r.id_report,
        status: $("#editEstado").val() || null,
        resolution_type: $("#editAccion").val() || null,
        comment: $("#editComentarioSoporte").val() || null,
        assigned_to_technician: $("#edit_scale_technician").val() || null,
      };

      try {
        let route =
          r.id_ticket == null ? "addTicket.php" : "editTicketById.php";

        let response = await axios.post(
          `http://ws4cjdg.com/JDigitalReportsV2/src/api/routes/tickets/${route}`,
          payload,
        );

        if (response.data.status == "ok") {
          msgBox.html(`
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            <strong>Éxito:</strong> El reporte fue guardado correctamente.
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    `);

          setTimeout(() => {
            viewReport(r.id_report);
            modal.hide();
          }, 1500);
        } else {
          alert(response);
        }
      } catch (e) {
        msgBox.html(`
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error:</strong> No se pudo guardar el reporte. Intente de nuevo.
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `);
        console.error(err);
      }
    });
  } catch (err) {
    $("#report-loader").html(`
            <div class="alert alert-danger text-center">
                Error al cargar el reporte.
            </div>
        `);
    console.error(err);
  }
};

window.viewReport = viewReport;

const editReport = async (report_id) => {
    console.log(report_id);
    
  // Crear modal base (con loader)
  const modalHTML = `
        <div class="modal fade" id="EditReportModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">

                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title"><i class="bi bi-pencil-square me-2"></i>Editar Reporte</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        
                        <div class="d-flex justify-content-center py-5" id="edit-loader">
                            <div class="spinner-border"></div>
                        </div>

                        <form id="edit-report-form" class="visually-hidden">
                            <input type="hidden" name="id" />

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Fecha del reporte</label>
                                    <input id="edit_fecha" type="date" name="fecha" class="form-control" >
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Gestor</label>
                                    <input type="text" class="form-control" name="monitorista" disabled/>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Cliente</label>
                                    <input type="text" class="form-control" name="cliente"  />
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">ID Unidad</label>
                                    <input type="text" class="form-control" name="Idunidad" disabled />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Nombre Unidad</label>
                                    <input type="text" class="form-control" name="nombreUnidad" />
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Tipo de Reporte</label>
                                <input type="text" class="form-control" name="tipoReporte"  />
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Comentario</label>
                                <textarea class="form-control" name="comentario" rows="3"></textarea>
                            </div>

                            <div id="edit-msg" class="mt-2"></div>
                        </form>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button class="btn btn-success" id="btn-save-edit">
                            Guardar cambios
                        </button>
                    </div>

                </div>
            </div>
        </div>
    `;

  // limpiar modal previa
  $("#EditReportModal").remove();
  $("body").append(modalHTML);

  const modal = new bootstrap.Modal(document.getElementById("EditReportModal"));
  modal.show();

  // CARGA DEL REPORTE
  try {
    const res = await axios.post(
      "http://ws4cjdg.com/JDigitalReportsV2/src/api/routes/reports/getReportById.php",
      { "id_report": report_id },
    );

    console.log(res.data.mensaje[0]);
    const r = res.data.mensaje[0];

    const fecha = new Date(r.report_date);
    const fechaISO = fecha.toISOString().slice(0, 10); // YYYY-MM-DD

    $("#edit-report-form input[name='id']").val(r.id_report);
    $("#edit-report-form input[name='monitorista']").val(r.monitorista);
    $("#edit-report-form input[name='cliente']").val(r.cliente);
    $("#edit-report-form input[name='Idunidad']").val(r.Idunidad);
    $("#edit-report-form input[name='nombreUnidad']").val(r.nombreUnidad);
    $("#edit-report-form input[name='tipoReporte']").val(r.tipoReporte);
    $("#edit-report-form textarea[name='comentario']").val(r.comentario);
    $("#edit_fecha").val(fechaISO);

    // mostrar form
    $("#edit-loader").addClass("visually-hidden");
    $("#edit-report-form").removeClass("visually-hidden");
  } catch (err) {
    $("#edit-loader").html(`
            <div class="alert alert-danger">Error al cargar el reporte.</div>
        `);
    console.error(err);
    return;
  }

  // EVENTO DE GUARDAR CAMBIOS
  $("#btn-save-edit")
    .off()
    .on("click", async function () {
      const btn = $(this);
      const msgBox = $("#edit-msg");

      msgBox.html("");

      // spinner
      btn.prop("disabled", true).html(`
            <span class="spinner-border spinner-border-sm me-2"></span>
            Guardando...
        `);

      const data = {
        id: $("#edit-report-form input[name='id']").val(),
        fechaReporte: $("#edit_fecha").val(),
        monitorista: $("#edit-report-form input[name='monitorista']").val(),
        cliente: $("#edit-report-form input[name='cliente']").val(),
        Idunidad: $("#edit-report-form input[name='Idunidad']").val(),
        nombreUnidad: $("#edit-report-form input[name='nombreUnidad']").val(),
        tipoReporte: $("#edit-report-form input[name='tipoReporte']").val(),
        comentario: $("#edit-report-form textarea[name='comentario']").val(),
      };

      try {
        const update = await axios.post(
          "http://ws4cjdg.com/JDigitalReports/src/api/routes/reports/editReportById.php",
          data,
        );

        msgBox.html(`
                <div class="alert alert-success p-2 mt-2">
                    Cambios guardados correctamente.
                </div>
            `);

        setTimeout(() => {
          modal.hide();
          if (typeof loadReportsTable === "function") {
            loadReportsTable();
          }
        }, 1200);
      } catch (err) {
        msgBox.html(`
                <div class="alert alert-danger p-2 mt-2">
                    Error al guardar los cambios.
                </div>
            `);
        console.error(err);
      } finally {
        btn.prop("disabled", false).html("Guardar cambios");
      }
    });
};

window.editReport = editReport;

const deleteReport = (id) => {
  const modalHTML = `
        <div class="modal fade" id="DeleteModal" tabindex="-1">
            <div class="modal-dialog  modal-dialog-centered">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title">Confirmar</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        <p>¿Realmente desea eliminar el reporte con id = ${id}?</p>
                        <div id="delete-msg" class="mt-2"></div>
                    </div>

                    <div class="modal-footer d-flex justify-content-between">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button class="btn btn-danger" onClick="confirmDelete(${id})">Eliminar</button>
                    </div>

                </div>
            </div>
        </div>
    `;

  // evitar duplicados
  $("#DeleteModal").remove();

  // insertar modal
  $("body").append(modalHTML);

  // abrir modal
  const modal = new bootstrap.Modal(document.getElementById("DeleteModal"));
  modal.show();
};
window.deleteReport = deleteReport;

const confirmDelete = async (id) => {
  const msgBox = $("#delete-msg");
  msgBox.html("");

  try {
    const res = await axios.post(
      "http://ws4cjdg.com/JDigitalReportsV2/src/api/routes/reports/deleteReport.php",
      { "id_report": id },
    );

    if( res.data.status == 'ok' ){
        msgBox.html(`
            <div class="alert alert-success p-2 mt-2">
                Registro eliminado correctamente.
            </div>
        `);

        // Cerrar modal después de un momento
        setTimeout(() => {
        $("#DeleteModal").modal("hide");

        // refrescar la tabla
        if (typeof loadReportsTable === "function") {
            loadReportsTable("allReports");
            loadReportsCards("allReports");
        }
        }, 1000);
    }
  } catch (err) {
    msgBox.html(`
            <div class="alert alert-danger p-2 mt-2">
                Ocurrió un error al eliminar.
            </div>
        `);
    console.error(err);
  }
};
window.confirmDelete = confirmDelete;

const assigTech = async (id_report) => {
  try {
    const res = await axios.post(
      "http://ws4cjdg.com/JDigitalReportsV2/src/api/routes/reports/getReportById.php",
      { id_report },
    );

    const r = res.data.mensaje[0];

    console.log(r);
    AssignationTechnical(r);
  } catch (error) {}
};
window.assigTech = assigTech;

