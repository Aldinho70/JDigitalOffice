import { changeView } from "../Menu/MenuLeft/MenuLeft.js";

export const Reports = () => {
  return `
    <div class="p-3">
    
      <table id="tblReports" class="table table-striped table-hover w-100">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Responsable</th>
            <th>Cliente</th>
            <th>Nombre de unidad</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `;
};

export const loadReportsTable = async () => {
    try {
        const url = "http://ws4cjdg.com/JDigitalReports/src/api/routes/reports/getReports.php";
        const resp = await fetch(url);
        const data = await resp.json();

        // Por si el endpoint envía un solo objeto en lugar de array
        const rows = Array.isArray(data) ? data : [data];

        // Limpiar instancia previa
        if ($.fn.DataTable.isDataTable("#tblReports")) {
            $("#tblReports").DataTable().destroy();
        }

        // Poblar manualmente el tbody
        const tbody = document.querySelector("#tblReports tbody");
        tbody.innerHTML = rows.map(r => `
            <tr>
                <td>${r.id}</td>
                <td>${r.fechaReporte}</td>
                <td>${r.monitorista}</td>
                <td>${r.cliente}</td>
                <td>${r.nombreUnidad}</td>
                <td>${r.tipoReporte}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-primary me-1" data-id="${r.Idunidad}" onClick="viewReport('${r.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning me-1" data-id="${r.id}" onClick="editReport('${r.id}')">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" data-id="${r.id}" onClick="deleteReport('${r.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join("");

        // Inicializar DataTable
        $("#tblReports").DataTable({
          responsive: true,
          order: [[0, 'desc']],
          pageLength: 10,
          scrollY: "65vh",     
          scrollCollapse: true,
          paging: true,
          language: {
              url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-MX.json"
          },
          dom: '<"d-flex justify-content-between align-items-center mb-2"lfB>rtip',
          buttons: [
            {
              text: 'Nuevo reporte',
              className: 'btn btn-success',
              action: function () {
                changeView('4')
              }
            }
          ]
        }
      );
    } catch (err) {
        console.error("Error cargando datos:", err);
    }
};

const viewReport = async (id) => {

    // Modal inicial con loader
    const modalHTML = `
        <div class="modal fade" id="ViewReportModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">

                    <div class="modal-header bg-warning text-white">
                        <h5 class="modal-title"><i class="bi bi-file-text me-2"></i>Detalle del Reporte</h5>
                        <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        <div class="d-flex justify-content-center py-5" id="report-loader">
                            <div class="spinner-border"></div>
                        </div>

                        <div id="report-content" class="visually-hidden"></div>
                    </div>

                </div>
            </div>
        </div>
    `;

    // Clean previous modals
    $("#ViewReportModal").remove();
    $("body").append(modalHTML);

    const modal = new bootstrap.Modal(document.getElementById("ViewReportModal"));
    modal.show();

    // Fetch del reporte
    try {
        const res = await axios.post(
            "http://ws4cjdg.com/JDigitalReports//src/api/routes/reports/getReportById.php",
            { id }
        );

        const r = res.data.mensaje[0];

        // Construir vista del reporte
        const html = `
            <div class="container-fluid">

                <!-- Fecha -->
                <div class="mb-3 text-end">
                    <span class="badge bg-secondary">
                        <i class="bi bi-calendar-event me-1"></i> ${r.fechaReporte}
                    </span>
                </div>

                <!-- Ficha del reporte -->
                <div class="p-3 border rounded bg-light shadow-sm">

                    <h5 class="mb-3"><i class="bi bi-card-heading me-2"></i> Información General</h5>

                    <div class="row mb-2">
                        <div class="col-md-6">
                            <strong>Monitorista:</strong>
                            <div>${r.monitorista}</div>
                        </div>

                        <div class="col-md-6">
                            <strong>Cliente:</strong>
                            <div>${r.cliente}</div>
                        </div>
                    </div>

                    <hr>

                    <h6 class="mb-3"><i class="bi bi-truck me-2"></i> Unidad</h6>

                    <div class="row mb-2">
                        <div class="col-md-6">
                            <strong>ID Unidad:</strong>
                            <div>${r.Idunidad}</div>
                        </div>

                        <div class="col-md-6">
                            <strong>Nombre Unidad:</strong>
                            <div>${r.nombreUnidad}</div>
                        </div>
                    </div>

                    <hr>

                    <h6 class="mb-3"><i class="bi bi-exclamation-diamond me-2"></i> Tipo de Reporte</h6>
                    <p class="mb-3 badge bg-warning text-dark fs-6">${r.tipoReporte}</p>

                    <hr>

                    <h6 class="mb-2"><i class="bi bi-chat-left-text me-2"></i> Comentario</h6>

                    <div class="border rounded p-2 bg-white">
                        ${r.comentario || "<span class='text-muted'>Sin comentarios</span>"}
                    </div>

                </div>
            </div>
        `;

        // Inject content
        $("#report-content").html(html).removeClass("visually-hidden");
        $("#report-loader").addClass("visually-hidden");

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

const editReport = async (id) => {

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
                                    <label class="form-label">Monitorista</label>
                                    <input type="text" class="form-control" name="monitorista" disabled />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Cliente</label>
                                    <input type="text" class="form-control" name="cliente" disabled />
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">ID Unidad</label>
                                    <input type="text" class="form-control" name="Idunidad" disabled />
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Nombre Unidad</label>
                                    <input type="text" class="form-control" name="nombreUnidad" disabled />
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Tipo de Reporte</label>
                                <input type="text" class="form-control" name="tipoReporte" disabled />
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
            "http://ws4cjdg.com/JDigitalReports//src/api/routes/reports/getReportById.php",
            { id }
        );

        const r = res.data.mensaje[0];

        const fecha = new Date(r.fechaReporte);
        const fechaISO = fecha.toISOString().slice(0, 10); // YYYY-MM-DD

        $("#edit-report-form input[name='id']").val(r.id);
        $("#edit-report-form input[name='monitorista']").val(r.monitorista);
        $("#edit-report-form input[name='cliente']").val(r.cliente);
        $("#edit-report-form input[name='Idunidad']").val(r.Idunidad);
        $("#edit-report-form input[name='nombreUnidad']").val(r.nombreUnidad);
        $("#edit-report-form input[name='tipoReporte']").val(r.tipoReporte);
        $("#edit-report-form textarea[name='comentario']").val(r.comentario);
        $("#edit_fecha").val(fechaISO);  // ✅ correcto


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
    $("#btn-save-edit").off().on("click", async function () {
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
                data
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
            "http://ws4cjdg.com/JDigitalReports/src/api/routes/reports/deleteReport.php",
            { id }
        );

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
                loadReportsTable();
            }
        }, 1000);

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