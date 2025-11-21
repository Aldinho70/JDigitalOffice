import { changeView } from "../../Menu/MenuLeft/MenuLeft.js"

export const AddReports = () => {
    return `
        <form id="form-reporte" class="border rounded-3 m-4 p-3 bg-light">

            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">Monitorista</label>
                    <input type="text" class="form-control" name="monitorista" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Cliente</label>
                    <input type="text" class="form-control" name="cliente" required>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">ID Unidad</label>
                    <input type="text" class="form-control" name="Idunidad" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Nombre Unidad</label>
                    <input type="text" class="form-control" name="nombreUnidad" required>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Tipo de Reporte</label>
                <select class="form-select" name="tipoReporte" required>
                    <option value="">Seleccione...</option>
                    <option value="Falla">Falla</option>
                    <option value="Revisión">Revisión</option>
                    <option value="Error Sensor">Error Sensor</option>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label">Comentario</label>
                <textarea class="form-control" name="comentario" rows="3"></textarea>
            </div>

            <div class="text-end">
                <button class="btn btn-secondary me-2" type="reset">Limpiar</button>
                <button class="btn btn-success" type="submit">Guardar</button>
            </div>

            <div id="msg-response" class="mt-3"></div>

        </form>
    `
}

$(document).on("submit", "#form-reporte", async function (e) {
    e.preventDefault();

    const btn = $(this).find("button[type='submit']");
    const msgBox = $("#msg-response");

    // spinner en el botón
    btn.prop("disabled", true).html(`
        <span class="spinner-border spinner-border-sm me-2"></span>
        Guardando...
    `);

    const data = {
        monitorista: $("input[name='monitorista']").val(),
        cliente: $("input[name='cliente']").val(),
        Idunidad: $("input[name='Idunidad']").val(),
        nombreUnidad: $("input[name='nombreUnidad']").val(),
        tipoReporte: $("select[name='tipoReporte']").val(),
        comentario: $("textarea[name='comentario']").val()
    };

    try {
        const res = await axios.post(
            "http://ws4cjdg.com/JDigitalReports/src/api/routes/reports/addReport.php",
            data
        );

        msgBox.html(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Éxito:</strong> El reporte fue guardado correctamente.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);

        // limpiar formulario
        $("#form-reporte")[0].reset();

        setTimeout(() => {
            changeView("2"); 
        }, 1500);

    } catch (err) {
        msgBox.html(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> No se pudo guardar el reporte. Intente de nuevo.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        console.error(err);
    }

    // restaurar botón
    btn.prop("disabled", false).html("Guardar");
});