/* =========================
   COMPONENTE UI
========================= */
export const TiposFallas = () => {
    return `
        <div class="col-md-4">
            <div class="card h-100 shadow-sm config-card">
                <div class="card-body text-center">

                    <i class="bi bi-exclamation-triangle display-4 text-warning mb-3"></i>

                    <h6 class="fw-bold">Tipos de fallas</h6>
                    <p class="text-muted small">
                        Administra las categorías, gravedad y tipos de fallas del sistema.
                    </p>

                    <button class="btn btn-outline-success btn-sm"
                        onClick="openAddFailure()">
                        Agregar nuevo tipo de falla
                    </button>

                </div>
            </div>
        </div>
    `;
};

/* =========================
   MODAL
========================= */
const failureModal = () => `
<div class="modal fade" id="FailureModal" tabindex="-1">
  <div class="modal-dialog modal-md modal-dialog-centered">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title">Agregar tipo de falla</h5>
        <button class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        <form id="form-type-failure-modal" class="border rounded-3 p-3 bg-light">

          <div class="mb-3">
            <label class="form-label">Nombre de falla</label>
            <input type="text" class="form-control" name="nombre_falla" required>
          </div>

          <div class="mb-3">
            <label class="form-label">Categoría</label>
            <select class="form-select" id="select-categoria-modal" required>
              <option value="general">General</option>
              <option value="sensores">Sensores</option>
              <option value="temperatura">Temperatura</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Gravedad</label>
            <select class="form-select" id="select-gravedad-modal" required>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>

          <div class="text-end">
            <button type="reset" class="btn btn-secondary me-2">Limpiar</button>
            <button type="submit" class="btn btn-success">Guardar</button>
          </div>

          <div id="msg-response-modal" class="mt-3"></div>

        </form>
      </div>

    </div>
  </div>
</div>
`;

/* =========================
   ABRIR MODAL
========================= */
const openAddFailure = () => {

    $("#FailureModal").remove();
    $("body").append(failureModal());

    new bootstrap.Modal("#FailureModal").show();
};

window.openAddFailure = openAddFailure;

/* =========================
   SUBMIT FORM
========================= */
$(document).on("submit", "#form-type-failure-modal", async function (e) {
    e.preventDefault();

    const btn = $(this).find("button[type='submit']");
    const msgBox = $("#msg-response-modal");

    btn.prop("disabled", true).html(`
        <span class="spinner-border spinner-border-sm me-2"></span>
        Guardando...
    `);

    const payload = {
        nombre_falla: $("input[name='nombre_falla']").val(),
        categoria: $("#select-categoria-modal").val(),
        criticidad: $("#select-gravedad-modal").val(),
    };

    try {
        await axios.post(
            "http://ws4cjdg.com/JDigitalReports/src/api/routes/config/type_failure/addTypeFailure.php",
            payload
        );

        msgBox.html(`
            <div class="alert alert-success alert-dismissible fade show">
                Tipo de falla guardado correctamente.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);

        this.reset();

        setTimeout(() => {
            bootstrap.Modal.getInstance(
                document.getElementById("FailureModal")
            ).hide();
        }, 800);

    } catch (err) {
        msgBox.html(`
            <div class="alert alert-danger">
                Error al guardar tipo de falla.
            </div>
        `);
        console.error(err);
    }

    btn.prop("disabled", false).text("Guardar");
});
