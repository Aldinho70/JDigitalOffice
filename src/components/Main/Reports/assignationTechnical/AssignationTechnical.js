import { request } from "../../../../Utils/request.js"

export const AssignationTechnical = async ( data ) => {
    const modalHTML =  `
        <div class="modal fade" id="modal_AssignationTechnical" tabindex="-1">
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">

                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title">
                            <i class="bi bi-file-earmark-text me-2"></i> Asignar unidad a cliente
                        </h5>
                        <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        <form id="form-asignacion" class="border rounded-3 m-4 p-3 bg-light">

                            <div class="row mb-3">

                                <div class="col-md-6">
                                    <label class="form-label">Técnico</label>
                                    <select class="form-select" name="tecnico_id" id="select-Tecnico" required></select>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Fecha estimada de fin</label>
                                    <input type="date" class="form-control" name="fecha_estimada_fin" required>
                                </div>

                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Unidad</label>
                                    <input type="text" class="form-control" value="${data.nombreUnidad}" name="unidad" disabled>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Cliente</label>
                                    <input type="text" class="form-control" value="${data.cliente}" name="cliente" disabled>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Ticket id</label>
                                    <input type="text" class="form-control visually-hidden" value="${data.id_ticket}" name="id_ticket" disabled>
                                </div>
                            </div>

                            <div class="row mb-3">

                                <div class="col-md-6">
                                    <label class="form-label">Costo técnico</label>
                                    <div class="input-group">
                                        <span class="input-group-text">$</span>
                                        <input 
                                            type="number"
                                            class="form-control"
                                            name="costo_tecnico"
                                            step="0.01"
                                            required
                                        >
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Costo cliente</label>
                                    <div class="input-group">
                                        <span class="input-group-text">$</span>
                                        <input
                                            type="number"
                                            class="form-control"
                                            name="costo_cliente"
                                            step="0.01"
                                            required
                                        >
                                    </div>
                                </div>

                            </div>

                            <div class="mb-3">
                                <label class="form-label">Comentarios</label>
                                <textarea class="form-control" name="comentarios" rows="3"></textarea>
                            </div>

                            <div class="text-end">
                                <button class="btn btn-secondary me-2" type="reset">Limpiar</button>
                                <button class="btn btn-success" type="submit">Guardar</button>
                            </div>

                            <div id="msg-response-asignacion" class="mt-3"></div>

                        </form>                        
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>

                </div>
            </div>
        </div>
    `

    // Eliminar modal previo si existe
    $("#modal_AssignationTechnical").remove();
    $("body").append(modalHTML);

    await initAssignationTechnical();

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById("modal_AssignationTechnical"));
    modal.show();
}

export const initAssignationTechnical = async () => {
    const tecnicos = await request('http://ws4cjdg.com/JDigitalReports/src/api/routes/utils/getQuery.php', 'post', { "query": 'SELECT * FROM tecnicos'})
    console.log(tecnicos);

    if( tecnicos.status == 'ok' ){
        const $select = $("#select-Tecnico");

        // limpiar contenido previo
        $select.empty();

        // opción inicial
        $select.append('<option value="">Selecciona un tecnico...</option>');

        tecnicos.mensaje.forEach(t => {
            $select.append(`
                <option 
                    value="${t.id}" 
                    data-id="${t.id}"
                >
                    ${t.nombre}
                </option>
            `);
        });

        $select.select2({
            dropdownParent: $('#modal_AssignationTechnical'),
            placeholder: "Seleccione una unidad...",
            width: "100%",
        });
    }
}   

$(document).on("submit", "#form-asignacion", async function (e) {
    e.preventDefault();

    const form = $(this);
    const msgBox = $("#msg-response-asignacion");

    const payload = {
        ticket_id: form.find('[name="id_ticket"]').val(),
        tecnico_id: $("#select-Tecnico").val(),
        unidad: form.find('[name="unidad"]').val(),
        cliente: form.find('[name="cliente"]').val(),
        fecha_estimada_fin: form.find('[name="fecha_estimada_fin"]').val(),
        costo_tecnico: form.find('[name="costo_tecnico"]').val(),
        costo_cliente: form.find('[name="costo_cliente"]').val(),
        comentarios: form.find('[name="comentarios"]').val()
    };

    try {
        const response = await request(
            'http://ws4cjdg.com//JDigitalReports/src/api/routes/assignationTechnical/assignationTechnical.php',
            'POST',
            payload
        );

        console.log(response);
        

        if (response.status === 'ok') {
            msgBox.html(`
                <div class="alert alert-success alert-dismissible fade show">
                    Asignación guardada correctamente.
                    <button class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `);

            setTimeout(() => {
                bootstrap.Modal.getInstance(
                    document.getElementById("modal_AssignationTechnical")
                ).hide();
            }, 2000);
        } else {
            throw new Error();
        }

    } catch (err) {
        msgBox.html(`
            <div class="alert alert-danger">
                Error al guardar la asignación.
            </div>
        `);
    }
});