import { changeView } from "../../Menu/MenuLeft/MenuLeft.js"
import Env from "../../../../config/env.js";

export const AddReports = () => {
    return `
        <form id="form-reporte" class="border rounded-3 m-4 p-3 bg-light">

            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">Gestor</label>
                    <input type="text" class="form-control" name="monitorista" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Cliente</label>
                    <input type="text" class="form-control" name="cliente" required>
                </div>
            </div>

            <div class="row mb-3">
                <!--<div class="">
                    <label class="form-label ">Unidad</label>
                    <select id="select-unidad" class="form-select" name="unidades" required></select>
                </div>-->

                <div class="col-md-12">
                    <label class="form-label">Nombre Unidad</label>
                    <input type="text" class="form-control" name="nombreUnidad" id="nombreUnidad" required>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Tipo de Reporte</label>
                <select class="form-select" name="tipoReporte" id="select-type-failure" required></select>
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

export const loadUnitsSelect2 = () => {
    axios.get(`http://ws4cjdg.com/JDigitalReports/src/api/routes/units/getUnits.php?token=${Env.LOGIN.TOKEN}`)
        .then(res => {
            const unidades = res.data.unidades || [];

            const $select = $("#select-unidad");

            // limpiar por si se recarga la vista
            $select.empty();

            // agregar opción inicial
            $select.append('<option value="">Seleccione unidad...</option>');

            // agregar opciones dinámicas
            unidades.forEach(u => {
                $select.append(`
                    <option 
                        value="${u.id}" 
                        data-icon="${u.icono}"
                        data-id="${u.id}"
                    >
                        ${u.nombre}
                    </option>
                `);
            });

            // activar Select2 con íconos
            $select.select2({
                placeholder: "Seleccione una unidad...",
                width: "100%",
                templateResult: formatoUnidad,
                templateSelection: formatoUnidad
            });

            // evento para rellenar nombreUnidad
            $select.on("change", function () {
                const nombre = $(this).find("option:selected").text().trim();
                $("input[name='nombreUnidad']").val(nombre);
            });

        })
        .catch(err => {
            console.error("Error cargando unidades:", err);
        });
};

export const loadTypeFailureSelect2 = () => {
    axios.get("http://ws4cjdg.com/JDigitalReports/src/api/routes/config/type_failure/getTypeFailure.php")
        .then(res => {
            const fallas = res.data || [];

            const $select = $("#select-type-failure");

            // limpiar contenido previo
            $select.empty();

            // opción inicial
            $select.append('<option value="">Seleccione tipo de falla...</option>');

            // agrupar por categoría
            const grupos = {};

            fallas.forEach(f => {
                if (!grupos[f.categoria]) {
                    grupos[f.categoria] = [];
                }
                grupos[f.categoria].push(f);
            });

            // crear optgroups y opciones
            Object.keys(grupos).forEach(cat => {
                const $group = $(`<optgroup label="${cat.toUpperCase()}"></optgroup>`);

                grupos[cat].forEach(f => {
                    $group.append(`
                        <option value="${f.nombre_falla}" data-id="${f.id}">
                            ${f.nombre_falla}
                        </option>
                    `);
                });

                $select.append($group);
            });

            // inicializar Select2 (si no está inicializado)
            $select.select2();
        })
        .catch(err => {
            console.error("Error cargando fallas:", err);
        });
};


export const formatoUnidad = ( unidad ) => {
    if (!unidad.id) return unidad.text;
    const icon = $(unidad.element).data("icon") || "./src/assets/logojs.png";
    const html = `
        <div class="d-flex align-items-center">
            <img src="https://hst-api.wialon.com${icon}" 
                 style="width:22px; height:22px; margin-right:8px;" 
                 class="rounded-circle">
            <span>${unidad.text}</span>
        </div>
    `;
    return $(html);
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
        Idunidad: $("#select-unidad").val() ?? '000000',
        nombreUnidad: $("input[name='nombreUnidad']").val(),
        tipoReporte: $("#select-type-failure").val(),
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