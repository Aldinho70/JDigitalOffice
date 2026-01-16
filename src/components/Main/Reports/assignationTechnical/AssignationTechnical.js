import { viewReport } from "../Reports.js";
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
                                    <input type="date" class="form-control" name="fecha_estimada_fin" ${ (data.fecha_estimada_fin != null) ? `value="${data.fecha_estimada_fin}"` : `` } required>
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

                                <div class="col-md-6 visually-hidden">
                                    <label class="form-label">Ticket id</label>
                                    <input type="text" class="form-control " value="${data.id_ticket}" name="id_ticket" disabled>
                                </div>

                                <div class="col-md-6 visually-hidden">
                                    <label class="form-label">Report id</label>
                                    <input type="text" class="form-control " value="${data.id}" name="id_report" disabled>
                                </div>
                            </div>

                            <div class="row mb-6">
                                
                                <div class="col-md-6">
                                    ${ (data.facturacion == null)
                                        ? `<button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                                Agregar factura
                                            </button>`
                                        : `<div class="col-md-6">
                                                <label class="form-label">Facturacion</label>
                                                <select class="form-select" name="facturacion" >
                                                    <option value="0" ${data.facturacion == 0 ? 'selected' : ''}>
                                                        No
                                                    </option>
                                                    <option value="1" ${data.facturacion === 1 ? 'selected' : ''}>
                                                        Si
                                                    </option>
                                                </select>
                                            </div> `
                                     }
                                    
                                </div>

                                <div class="collapse pt-2" id="collapseExample">
                                    <div class="card card-body">
                                        <div class="row mb-3">
                                            <div class="col-md-6 p-2">
                                                <label class="form-label">Costo técnico</label>
                                                <div class="input-group">
                                                    <span class="input-group-text">$</span>
                                                    <input 
                                                        ${ (data.costo_tecnico != null) ? `value="${data.costo_tecnico}"` : `` }
                                                        type="number"
                                                        class="form-control"
                                                        name="costo_tecnico"
                                                        step="0.01"
                                                        
                                                    >
                                                </div>
                                            </div>

                                            <div class="col-md-6 p-2">
                                                <label class="form-label">Costo cliente</label>
                                                <div class="input-group">
                                                    <span class="input-group-text">$</span>
                                                    <input
                                                        ${ (data.costo_cliente != null) ? `value="${data.costo_cliente}"` : `` }
                                                        type="number"
                                                        class="form-control"
                                                        name="costo_cliente"
                                                        step="0.01"
                                                        
                                                    >
                                                </div>
                                            </div>

                                            <div class="col-md-6 p-2">
                                                <label class="form-label">Folio</label>
                                                <input type="input" class="form-control" name="folio" >
                                            </div>
    
                                            <div class="col-md-6 p-2">
                                                <label class="form-label">Fecha limite de pago</label>
                                                <input type="date" class="form-control" name="fecha_limite_pago" ${ (data.fecha_limite_pago != null) ? `value="${data.fecha_limite_pago}"` : `` } >
                                            </div>

                                            <div class="col-md-6 p-2">
                                                <label class="form-label">Concepto de cobro</label>
                                                <input type="input" class="form-control" name="concepto" >
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label">Comentarios</label>
                                                <textarea class="form-control" name="comentarios_facturacion" rows="3"></textarea>
                                            </div>

                                            <button class="btn btn-danger" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" onClick="clearFactura()" >
                                                Cancelar factura.
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Estado de reparacion</label>
                                <select class="form-select" name="asignacion_status" required>
                                    <option value="" disabled ${data.asignacion_status == null ? 'selected' : ''}>
                                        Seleccione estado
                                    </option>
                                    <option value="pendiente" ${data.asignacion_status === 'pendiente' ? 'selected' : ''}>
                                        Pendiente
                                    </option>
                                    <option value="en_proceso" ${data.asignacion_status === 'en_proceso' ? 'selected' : ''}>
                                        En proceso
                                    </option>
                                    <option value="terminado" ${data.asignacion_status === 'terminado' ? 'selected' : ''}>
                                        Terminado
                                    </option>
                                    <option value="reprogramado" ${data.asignacion_status === 'reprogramado' ? 'selected' : ''}>
                                        Reprogramado
                                    </option>
                                </select>

                            </div>

                            <div class="mb-3">
                                <label class="form-label">Comentarios</label>
                                <textarea class="form-control" name="comentarios" rows="3">${data.asignacion_comentarios?.trim() ?? ''}</textarea>

                            </div>

                            <div class="text-end">
                                <button class="btn btn-secondary me-2" type="reset">Limpiar</button>
                                ${ data.costo_cliente != null 
                                    ? `<button class="btn btn-info" type="button" onClick="editAssignationTechnical(${data.id_asignacion})">Editar</button>` 
                                    : `<button class="btn btn-success" type="submit">Guardar</button>`
                                }
                                
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

    if(data.nombre_tecnico != null) {
        const $select = $("#select-Tecnico");
        $select.append(`<option value="${data.tecnico_id}" selected }>${data.nombre_tecnico}</option>`); 
    }

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById("modal_AssignationTechnical"));
    modal.show();
}

export const initAssignationTechnical = async () => {
    const tecnicos = await request('http://ws4cjdg.com/JDigitalReports/src/api/routes/utils/getQuery.php', 'post', { "query": 'SELECT * FROM tecnicos'})

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
        facturacion: ( form.find('[name="folio"]').val() ? 'si' : 'no'),
        fecha_limite_pago: form.find('[name="fecha_limite_pago"]').val(),
        folio: form.find('[name="folio"]').val() ?? '',
        concepto: form.find('[name="concepto"]').val() ?? '',
        tipo_cobro: 'servicio',
        comentarios_facturacion: form.find('[name="comentarios_facturacion"]').val() ?? '',
        comentarios: form.find('[name="comentarios"]').val()
    };

    // console.log( payload );

    try {
        const resAssign = await saveAssignation(payload);

        if (resAssign.status !== 'ok') throw new Error();

        // solo si hay facturación relevante
        if (payload.facturacion == 'si') {
            console.log(payload);
            
            const resFact = await saveFacturation(payload);
            if (resFact.status !== 'ok') throw new Error();
        }

        if (resAssign.status === 'ok') {
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

                bootstrap.Modal.getInstance(
                    document.getElementById("ReportFullView")
                ).hide();

                viewReport(form.find('[name="id_report"]').val())
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
    
    // try {
    //     const response = await request(
    //         'http://ws4cjdg.com//JDigitalReports/src/api/routes/assignationTechnical/assignationTechnical.php',
    //         'POST',
    //         payload
    //     );

    //     if (response.status === 'ok') {
    //         msgBox.html(`
    //             <div class="alert alert-success alert-dismissible fade show">
    //                 Asignación guardada correctamente.
    //                 <button class="btn-close" data-bs-dismiss="alert"></button>
    //             </div>
    //         `);

    //         setTimeout(() => {
    //             bootstrap.Modal.getInstance(
    //                 document.getElementById("modal_AssignationTechnical")
    //             ).hide();

    //             bootstrap.Modal.getInstance(
    //                 document.getElementById("ReportFullView")
    //             ).hide();

    //             viewReport(form.find('[name="id_report"]').val())
    //         }, 2000);
    //     } else {
    //         throw new Error();
    //     }

    // } catch (err) {
    //     msgBox.html(`
    //         <div class="alert alert-danger">
    //             Error al guardar la asignación.
    //         </div>
    //     `);
    // }
});

const editAssignationTechnical = async ( id ) => {
    const form = $("#form-asignacion");
    const msgBox = $("#msg-response-asignacion");

    const payload = {
        ticket_id: form.find('[name="id_ticket"]').val(),
        tecnico_id: $("#select-Tecnico").val(),
        unidad: form.find('[name="unidad"]').val(),
        cliente: form.find('[name="cliente"]').val(),
        fecha_estimada_fin: form.find('[name="fecha_estimada_fin"]').val(),
        costo_tecnico: form.find('[name="costo_tecnico"]').val(),
        costo_cliente: form.find('[name="costo_cliente"]').val(),
        facturacion: ( form.find('[name="folio"]').val() ? 'si' : 'no'),
        fecha_limite_pago: form.find('[name="fecha_limite_pago"]').val(),
        folio: form.find('[name="folio"]').val() ?? '',
        concepto: form.find('[name="concepto"]').val() ?? '',
        tipo_cobro: 'servicio',
        comentarios_facturacion: form.find('[name="comentarios_facturacion"]').val() ?? '',
        comentarios: form.find('[name="comentarios"]').val()
    };

    // console.log(payload);
    
    try {
        const response = await request(
            'http://ws4cjdg.com//JDigitalReports/src/api/routes/assignationTechnical/editAssignationTechnical.php',
            'POST',
            payload
        );

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

                bootstrap.Modal.getInstance(
                    document.getElementById("ReportFullView")
                ).hide();

                viewReport(form.find('[name="id_report"]').val())
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
    
}
window.editAssignationTechnical = editAssignationTechnical;

const clearFactura = () => {
    const form = $("#form-asignacion");

    form.find('[name="costo_tecnico"]').val('')
    form.find('[name="costo_cliente"]').val('')
    form.find('[name="facturacion"]').val('')
    form.find('[name="fecha_limite_pago"]').val('')
    form.find('folio').val('')
}
window.clearFactura = clearFactura

const saveAssignation = (payload) => {
    return request(
        'http://ws4cjdg.com/JDigitalReports/src/api/routes/assignationTechnical/assignationTechnical.php',
        'POST',
        payload
    );
};

const saveFacturation = (payload) => {
    return request(
        'http://ws4cjdg.com/JDigitalReports/src/api/routes/facturation/addFacturation.php',
        'POST',
        payload
    );
};

const editAssignation = (payload) => {
    return request(
        'http://ws4cjdg.com//JDigitalReports/src/api/routes/assignationTechnical/editAssignationTechnical.php',
        'POST',
        payload
    );
};

const editFacturation = (payload) => {
    return request(
        'http://ws4cjdg.com/JDigitalReports/src/api/routes/facturation/editFacturation.php',
        'POST',
        payload
    );
};
