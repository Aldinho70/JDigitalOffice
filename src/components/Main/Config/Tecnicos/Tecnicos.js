import { request } from '../../../../Utils/request.js';
import { UI } from '../../../sharedComponents/sharedComponents.js';

/* =========================
   ESTADO GLOBAL DEL MODULO
========================= */
let tecnicoMode = 'add'; // add | edit
let tecnicoSelected = null;

/* =========================
   COMPONENTE PRINCIPAL
========================= */
export const Tecnicos = () => {
    return `
        <div class="col-md-4">
            <div class="card h-100 shadow-sm config-card">
                <div class="card-body text-center">

                    <i class="bi bi-person-badge display-4 text-primary mb-3"></i>

                    <h6 class="fw-bold">Técnicos</h6>
                    <p class="text-muted small">
                        Gestiona técnicos, información de contacto y permisos.
                    </p>

                    <button class="btn btn-outline-primary btn-sm"
                        onClick="listTecnicos()">
                        Lista de tecnicos
                    </button>

                    <button class="btn btn-outline-success btn-sm" onClick="openAddTecnico()">
                        Agregar técnico nuevo
                    </button>

                </div>
            </div>
        </div>
    `;
};

/* =========================
   LISTA DE TECNICOS
========================= */
export const listTecnicos = async () => {

    $("#TecnicosModal").remove();

    $("body").append(`
        <div class="modal fade" id="TecnicosModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title">Lista de técnicos</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body" id="root-modal-body-tecnicos"></div>

                </div>
            </div>
        </div>
    `);

    const response = await request(
        'http://ws4cjdg.com/JDigitalReports/src/api/routes/utils/getQuery.php',
        'POST',
        { query: "SELECT * FROM tecnicos" }
    );

    if (response.status !== 'ok') {
        alert('Error al obtener técnicos');
        return;
    }

    const columns = [
        { title: "ID", data: "id" },
        { title: "Nombre", data: "nombre" },
        { title: "Ciudad", data: "ciudad" },
        { title: "Celular", data: "numero_telefono" },
        {
            title: "Acciones",
            data: null,
            orderable: false,
            searchable: false,
            render: (_, __, row) => `
                <div class="d-flex gap-1 justify-content-center">
                    <button class="btn btn-sm btn-warning btn-editar" data-id="${row.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-borrar" data-id="${row.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `
        }
    ];

    UI.Table("root-modal-body-tecnicos", response.mensaje, columns);

    new bootstrap.Modal("#TecnicosModal").show();
};

window.listTecnicos = listTecnicos;

/* =========================
   MODAL FORM REUTILIZABLE
========================= */
const tecnicoFormModal = () => `
<div class="modal fade" id="TecnicoFormModal" tabindex="-1">
  <div class="modal-dialog modal-md modal-dialog-centered">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title" id="tecnicoModalTitle"></h5>
        <button class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        <form id="tecnicoForm">
          <input type="hidden" id="tecnico_id">

          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" id="tecnico_nombre">
          </div>

          <div class="mb-3">
            <label class="form-label">Ciudad</label>
            <input type="text" class="form-control" id="tecnico_ciudad">
          </div>

          <div class="mb-3">
            <label class="form-label">Celular</label>
            <input type="text" class="form-control" id="tecnico_telefono">
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button class="btn btn-primary" id="btnSaveTecnico">Guardar</button>
      </div>

    </div>
  </div>
</div>
`;

/* =========================
   ABRIR ADD
========================= */
const openAddTecnico = () => {
    tecnicoMode = 'add';
    tecnicoSelected = null;

    $("#TecnicoFormModal").remove();
    $("body").append(tecnicoFormModal());

    $("#tecnicoModalTitle").text("Agregar técnico");
    $("#tecnicoForm")[0].reset();

    new bootstrap.Modal("#TecnicoFormModal").show();
};

window.openAddTecnico = openAddTecnico;

/* =========================
   ABRIR EDIT
========================= */
$(document).on("click", ".btn-editar", function () {

    tecnicoMode = 'edit';

    const row = $("#root-modal-body-tecnicos_table")
        .DataTable()
        .row($(this).closest("tr"))
        .data();

    tecnicoSelected = row;

    $("#TecnicoFormModal").remove();
    $("body").append(tecnicoFormModal());

    $("#tecnicoModalTitle").text("Editar técnico");
    $("#tecnico_id").val(row.id);
    $("#tecnico_nombre").val(row.nombre);
    $("#tecnico_ciudad").val(row.ciudad);
    $("#tecnico_telefono").val(row.numero_telefono);

    new bootstrap.Modal("#TecnicoFormModal").show();
});

/* =========================
   GUARDAR ADD / EDIT
========================= */
$(document).on("click", "#btnSaveTecnico", async () => {

    const payload = {
        id: $("#tecnico_id").val(),
        nombre: $("#tecnico_nombre").val(),
        ciudad: $("#tecnico_ciudad").val(),
        numero_telefono: $("#tecnico_telefono").val()
    };

    if (tecnicoMode === 'add') {
        console.log("ADD:", payload);
        // request INSERT
    } else {
        console.log("EDIT:", payload);
        // request UPDATE
    }

    bootstrap.Modal.getInstance(
        document.getElementById("TecnicoFormModal")
    ).hide();
});

/* =========================
   ELIMINAR
========================= */
$(document).on("click", ".btn-borrar", async function () {
    const id = $(this).data("id");
    console.log("DELETE:", id);
    // confirmación + DELETE + reload tabla
});
