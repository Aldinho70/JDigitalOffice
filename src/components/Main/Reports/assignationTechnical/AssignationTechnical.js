import { viewReport } from "../Reports.js";
import { request } from "../../../../Utils/request.js"

let is_billable_check = 0;

export const AssignationTechnical = async ( data ) => {
    const modalHTML =  `
        <div class="modal fade" id="modal_AssignationTechnical" tabindex="-1">
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">

                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title">
                            <i class="bi bi-file-earmark-text me-2"></i> Asignar tecnico y factura a unidad
                        </h5>
                        <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        <form id="form-asignacion" class="border rounded-3 m-4 p-3 bg-light">

                            <div class="row mb-3">

                                <div class="col-md-6">
                                    <label class="form-label">Técnico</label>
                                    <select class="form-select" name="tecnico_id" id="select-Tecnico" required> 
                                        <option value="${data.technician_id}" ${ data.technician_name != null ? 'selected' : ''}>${ data.technician_name }</option>
                                    </select>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Fecha estimada de fin</label>
                                    <input type="date" class="form-control" name="fecha_estimada_fin" ${ (data.date_finish_technicial != null) ? `value="${data.date_finish_technicial.split(' ')[0]}"` : `` } required>
                                </div>

                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Unidad</label>
                                    <input type="text" class="form-control" value="${data.unit_name}" name="unidad" disabled>
                                </div>

                                <div class="col-md-6">
                                    <label class="form-label">Cliente</label>
                                    <input type="text" class="form-control" value="${data.client_name}" name="cliente" disabled>
                                </div>

                                <div class="col-md-6 visually-hidden">
                                    <label class="form-label">Ticket id</label>
                                    <input type="text" class="form-control " value="${data.id_ticket}" name="id_ticket" disabled>
                                </div>

                                <div class="col-md-6 visually-hidden">
                                    <label class="form-label">Report id</label>
                                    <input type="text" class="form-control " value="${data.id_report}" name="id_report" disabled>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label">Estado de reparacion</label>
                                    <select class="form-select" name="asignacion_status" >
                                        <option value="" disabled   ${data.status_technician == null ? 'selected' : ''}>Seleccione estado</option>
                                        <option value="pending"     ${data.status_technician === 'pending'     ? 'selected' : ''}>Pendiente</option>
                                        <option value="in_progress" ${data.status_technician === 'in_progress' ? 'selected' : ''}>En proceso</option>
                                        <option value="completed"   ${data.status_technician === 'completed'   ? 'selected' : ''}>Terminado</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Costo técnico</label>
                                        <div class="input-group">
                                            <span class="input-group-text">$</span>
                                            <input ${ (data.service_cost_technician != null) ? `value="${data.service_cost_technician}"` : `` } type="number" class="form-control" name="costo_tecnico" step="0.01">
                                        </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Comentarios de tecnico</label>
                                <textarea class="form-control" name="comentarios" rows="3">${data.comment_technician?.trim() ?? ''}</textarea>
                            </div>

                            <div class="row mb-6">
                                
                                <div class="col-md-6">
                                    ${ (data.is_billable == null || data.is_billable == 0 )
                                        ? ` <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" onClick="set_is_billable(1)">
                                                Agregar factura
                                            </button>`
                                        : ` <div class="col-md-6">
                                                <label class="form-label">Facturacion</label>
                                                <select class="form-select" name="facturacion" >
                                                    <option value="0" ${data.is_billable == 0 ? 'selected' : ''}>No</option>
                                                    <option value="1" ${data.is_billable == 1 ? 'selected' : ''}>Si</option>
                                                </select>
                                            </div>` 
                                     }
                                    
                                </div>
                                
                                <div class="${ ( data.is_billable == null || data.is_billable == 0 ) ? 'collapse ' : '' } pt-2" id="collapseExample">

                                    <div class="mb-3 form-check">
                                        <input type="checkbox" value=1 class="form-check-input" id="is_billable_check" checked disabled>
                                        <label class="form-check-label" for="is_billable_check">Este reporte es facturable</label>
                                    </div>    

                                    <div class="card card-body">
                                        <div class="row mb-3">
                                            
                                            <div class="col-md-6 p-2">
                                                <label class="form-label">Costo cliente</label>
                                                <div class="input-group">
                                                    <span class="input-group-text">$</span>
                                                    <input
                                                        ${ (data.amount != null) ? `value="${data.amount}"` : `0.00` }
                                                        type="number"
                                                        class="form-control"
                                                        name="costo_cliente"
                                                        step="0.01"
                                                    >
                                                </div>
                                            </div>

                                            <div class="col-md-6 p-2">
                                                <label class="form-label">Folio</label>
                                                <input type="input" ${ (data.invoice_folio != null) ? `value="${data.invoice_folio}"` : `Sin Folio` } class="form-control" name="folio" >
                                            </div>
    
                                            <div class="col-md-3 p-2">
                                                <label class="form-label">Fecha de pago</label>
                                                <input type="date" class="form-control" name="fecha_pago" ${ (data.paid_at_payment != null) ? `value="${data.paid_at_payment.split(" ")[0]}"` : `` } >
                                            </div>
                                            <div class="col-md-3 p-2">
                                                <label class="form-label">Concepto de cobro</label>
                                                <select class="form-select" name="concepto">
                                                    <option value="service"  ${ data.concept_payment == 'servicio'  ? 'selected' : '' }>Servicio</option>
                                                    <option value="warranty" ${ data.concept_payment == 'warranty'  ? 'selected' : '' }>Garantia</option>
                                                    <option value="general"  ${ data.concept_payment == 'general'   ? 'selected' : '' }>General</option>
                                                </select>
                                            </div>

                                            <div class="col-md-6 p-2">
                                                <label class="form-label">Estatus de cobro</label>
                                                <select class="form-select" name="status_pago" >
                                                    <option value="pending"   ${ data.payment_status == 'pending'  ? 'selected' : '' }>Pendiente de pago</option>
                                                    <option value="paid"      ${ data.payment_status == 'paid'     ? 'selected' : '' }>Factura pagada</option>
                                                    <option value="cancelled" ${ data.payment_status == 'cancelled'? 'selected' : '' }>Factura cancelada</option>
                                                    <option value="overdue"   ${ data.payment_status == 'overdue'  ? 'selected' : '' }>Facutra vencidad</option>
                                                </select>
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label">Comentarios de adicionales de la factura</label>
                                                <textarea class="form-control" name="comentarios_facturacion" rows="3">${ (data.comment_payment != null) ? data.comment_payment : `` }</textarea>
                                            </div>

                                            <button class="btn btn-danger" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" onClick="clearFactura(); set_is_billable(0)" >
                                                Cancelar factura.
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="text-end">
                                <button class="btn btn-secondary me-2" type="reset">Limpiar</button>
                                <!-- TTT -->
                                ${ data.id_assignation != null 
                                    ? `<button class="btn btn-info" type="button" onClick="editAssignationTechnical(${ data.id_assignation }, ${ data.id_payment } )">Editar</button>` 
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

    if(data.assigned_to_technician == 1) {
        const $select = $("#select-Tecnico");
        $select.append(`<option value="${data.technician_id}" selected }>${data.technician_name}</option>`); 
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

    const payload_assignation_technical = {
        /**
         * Payload de tecnico
         */
            report_id: form.find('[name="id_report"]').val(),
            technician_id: $("#select-Tecnico").val(),
            service_cost: form.find('[name="costo_tecnico"]').val(),
            satus: form.find('[name="asignacion_status"]').val() ?? '',
            comment: form.find('[name="comentarios"]').val(),
            payment_status: null,
            completed_at: form.find('[name="fecha_estimada_fin"]').val(),
            assigned_at: null,

        // ticket_id: form.find('[name="id_ticket"]').val(),
        // unidad: form.find('[name="unidad"]').val(),
        // cliente: form.find('[name="cliente"]').val(),
        // fecha_estimada_fin: form.find('[name="fecha_estimada_fin"]').val() ?? '0000-00-00',
        // costo_cliente: form.find('[name="costo_cliente"]').val(),
        // facturacion: ( form.find('[name="folio"]').val() ? 'si' : 'no'),
        // fecha_limite_pago: form.find('[name="fecha_limite_pago"]').val() ?? '0000-00-00',
        // fecha_pago: form.find('[name="fecha_pago"]').val() ?? '0000-00-00',
        // folio: form.find('[name="folio"]').val() ?? '',
        // concepto: form.find('[name="concepto"]').val() ?? '',
        // tipo_cobro: 'servicio',
        // comentarios_facturacion: form.find('[name="comentarios_facturacion"]').val() ?? '',
        // status_pago: form.find('[name="status_pago"]').val() ?? '',
    };

    const payload_payment_client = {
        report_id: form.find('[name="id_report"]').val(),
        is_billable: is_billable_check,
        invoice_folio: form.find('[name="folio"]').val() ?? null,
        concept: form.find('[name="concepto"]').val() ?? null,
        amount: form.find('[name="costo_cliente"]').val() ?? null,
        payment_status: form.find('[name="status_pago"]').val() ?? null,
        paid_at: form.find('[name="fecha_pago"]').val() ?? null,
        comment: form.find('[name="comentarios_facturacion"]').val() ?? null,
    }

    try {
        const resAssign = await saveAssignation( payload_assignation_technical );

        if (resAssign.status !== 'ok') throw new Error();

        const resFact = await saveFacturation( payload_payment_client );
        if (resFact.status !== 'ok') throw new Error();

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
    
    
});

const editAssignationTechnical = async ( assignation_id = null, id_payment = null ) => {
    const form = $("#form-asignacion");
    const msgBox = $("#msg-response-asignacion");

    const payload_assignation_technical = {
        /**
         * Payload de tecnico
         */
            report_id: form.find('[name="id_report"]').val(),
            technician_id: $("#select-Tecnico").val(),
            service_cost: form.find('[name="costo_tecnico"]').val(),
            satus: form.find('[name="asignacion_status"]').val() ?? '',
            comment: form.find('[name="comentarios"]').val(),
            payment_status: null,
            completed_at: form.find('[name="fecha_estimada_fin"]').val(),
            assigned_at: null,
            assignation_id

        // ticket_id: form.find('[name="id_ticket"]').val(),
        // unidad: form.find('[name="unidad"]').val(),
        // cliente: form.find('[name="cliente"]').val(),
        // fecha_estimada_fin: form.find('[name="fecha_estimada_fin"]').val() ?? '0000-00-00',
        // costo_cliente: form.find('[name="costo_cliente"]').val(),
        // facturacion: ( form.find('[name="folio"]').val() ? 'si' : 'no'),
        // fecha_limite_pago: form.find('[name="fecha_limite_pago"]').val() ?? '0000-00-00',
        // fecha_pago: form.find('[name="fecha_pago"]').val() ?? '0000-00-00',
        // folio: form.find('[name="folio"]').val() ?? '',
        // concepto: form.find('[name="concepto"]').val() ?? '',
        // tipo_cobro: 'servicio',
        // comentarios_facturacion: form.find('[name="comentarios_facturacion"]').val() ?? '',
        // status_pago: form.find('[name="status_pago"]').val() ?? '',
    };

    const payload_payment_client = {
        id_payment,
        is_billable: is_billable_check,
        invoice_folio: form.find('[name="folio"]').val() ?? null,
        concept: form.find('[name="concepto"]').val() ?? null,
        amount: form.find('[name="costo_cliente"]').val() ?? null,
        payment_status: form.find('[name="status_pago"]').val() ?? null,
        paid_at: form.find('[name="fecha_pago"]').val() ?? null,
        comment: form.find('[name="comentarios_facturacion"]').val() ?? null,
    }

    try {
        let response = await editAssignation( payload_assignation_technical )
        
        if (response.status !== 'ok'){
            throw new Error();
        } 
        
        response = await editFacturation( payload_payment_client )

        if (response.status !== 'ok'){
            throw new Error();
        }
        
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
        
    } catch (error) {
        console.log(error);
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
    form.find('[name="fecha_pago"]').val('')
    form.find('[name="concepto"]').val('')
    form.find('[name="status_pago"]').val('')
    form.find('[name="folio"]').val('')
    form.find('[name="comentarios_facturacion"]').val('')
}
window.clearFactura = clearFactura

const saveAssignation = (payload) => {
    return request(
        'http://ws4cjdg.com/JDigitalReportsV2/src/api/routes/assignationTechnical/assignationTechnical.php',
        'POST',
        payload
    );
};

const saveFacturation = (payload) => {
    return request(
        'http://ws4cjdg.com/JDigitalReportsV2/src/api/routes/facturation/addFacturation.php',
        'POST',
        payload
    );
};

// TTT
const editAssignation = (payload) => {
    return request(
        'http://ws4cjdg.com//JDigitalReportsV2/src/api/routes/assignationTechnical/editAssignationTechnical.php',
        'POST',
        payload
    );
};

const editFacturation = (payload) => {
    return request(
        'http://ws4cjdg.com/JDigitalReportsV2/src/api/routes/facturation/editFacturation.php',
        'POST',
        payload
    );
};

const set_is_billable = ( value ) => {
    is_billable_check = value;
}
window.set_is_billable = set_is_billable;