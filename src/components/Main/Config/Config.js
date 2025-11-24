export const Config = () => {
    return `
        <div class="d-flex flex-row gap-3 p-5" >
            <div class=" border p-5" >
                <h6>Tipos de fallas</h6>
                <button type="button" class="btn btn-primary" onClick="addNewFailure()" >Agregar mas tipos de fallas</button>
            </div>
        </div>
    `;
}

const addNewFailure = () => {
    const modalHTML = `
        <div class="modal fade" id="FailureModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title">Agregar tipo de falla</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">

                        <form id="form-type-failure-modal" class="border rounded-3 p-3 bg-light">

                            <div class="row mb-3">
                                <div class="col-md-12">
                                    <label class="form-label">Nombre de falla</label>
                                    <input type="text" class="form-control" name="nombre_falla" required>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label ">Categoria</label>
                                <select id="select-categoria-modal" class="form-select" name="categoria" required>
                                    <option value="general">General</option>
                                    <option value="sensores">Sensores</option>
                                    <option value="temperatura">Temperature</option>
                                </select>

                                <label class="form-label">Gravedad de tipo de falla</label>
                                <select class="form-select" name="gravedad" id="select-gravedad-modal" required>
                                    <option value="baja">Baja</option>
                                    <option value="media">Media</option>
                                    <option value="alta">Alta</option>
                                    <option value="critica">Critica</option>
                                </select>
                            </div>

                            <div class="text-end">
                                <button class="btn btn-secondary me-2" type="reset">Limpiar</button>
                                <button class="btn btn-success" type="submit">Guardar</button>
                            </div>

                            <div id="msg-response-modal" class="mt-3"></div>

                        </form>

                    </div>
                </div>
            </div>
        </div>
    `;

    // limpiar previos
    $("#FailureModal").remove();

    // inject
    $("body").append(modalHTML);

    // abrir modal
    const modal = new bootstrap.Modal(document.getElementById("FailureModal"));
    modal.show();
};
window.addNewFailure = addNewFailure;

$(document).on("submit", "#form-type-failure-modal", async function (e) {
    e.preventDefault();

    const btn = $(this).find("button[type='submit']");
    const msgBox = $("#msg-response-modal");

    btn.prop("disabled", true).html(`
        <span class="spinner-border spinner-border-sm me-2"></span>
        Guardando...
    `);

    const data = {
        nombre_falla: $("input[name='nombre_falla']").val(),
        categoria: $("#select-categoria-modal").val(),
        criticidad: $("#select-gravedad-modal").val(),
    };

    console.log("Datos enviados desde modal:", data);

    try {
        const res = await axios.post(
            "http://ws4cjdg.com/JDigitalReports/src/api/routes/config/type_failure/addTypeFailure.php",
            data
        );

        msgBox.html(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Éxito:</strong> El nuevo tipo de falla fue guardado correctamente.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);

        $("#form-type-failure-modal")[0].reset();

        setTimeout(() => {
            $("#FailureModal").modal("hide");
        }, 1000);

    } catch (err) {
        msgBox.html(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> No se pudo guardar el tipo de falla.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        console.error(err);
    }

    btn.prop("disabled", false).html("Guardar");
});
