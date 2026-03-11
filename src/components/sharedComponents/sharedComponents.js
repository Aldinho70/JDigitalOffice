class sharedComponents {

    Table = (containerId, data, columns, options = {}) => {

        // Limpia contenedor
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <table id="${containerId}_table" class="table table-striped table-bordered w-100"></table>
        `;

        const tableId = `#${containerId}_table`;

        // Si ya existe DataTable, destruir
        if ($.fn.DataTable.isDataTable(tableId)) {
            $(tableId).DataTable().destroy();
        }

        // Inicializa DataTable
        $(tableId).DataTable({
            data: data,
            columns: columns,
            responsive: true,
            destroy: true,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
            },
            ...options
        });
    }

    Modal = ( id_tag, data = {} ) => {
        const modalHTML = `
            <div class="modal fade" id="${id_tag}" tabindex="-1">
                <div class="modal-dialog modal-fullscreen modal-dialog-centered">
                    <div class="modal-content">

                        <div class="modal-header bg-warning text-dark">
                            <h5 class="modal-title">
                                <i class="bi bi-file-earmark-text me-2"></i> 
                                ${ data.title || 'Titulo no identificado' } 
                            </h5>
                            <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>

                        <div class="modal-body">

                            <!-- Loader -->
                            <div id="report-loader" class="text-center visually-hidden">
                                <div class="spinner-border text-dark"></div>
                                <p class="mt-2">Cargando...</p>
                            </div>

                            <!-- Contenido final del modal -->
                            <div id="modal-body-${id_tag}" class="visually-hidden">${data.body || ''}</div>

                        </div>

                        <div class="modal-footer">
                            <button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>

                    </div>
                </div>
            </div>
        `;

        // Eliminar modal previo si existe
        $(`#${id_tag}`).remove();
        $("body").append(modalHTML);

        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById(id_tag));
        modal.show();

        $("#report-loader").addClass("visually-hidden");
        $(`#modal-body-${id_tag}`).removeClass("visually-hidden");

    };

    In_Construction = () => {
        const html =
            `<div class="container d-flex justify-content-center align-items-center" style="min-height: 60vh;">
                <div class="text-center p-5 border rounded-4 shadow-sm bg-light">
                    
                    <div class="mb-4">
                    <div class="spinner-border text-warning" style="width: 3rem; height: 3rem;" role="status"></div>
                    </div>

                    <h3 class="fw-bold mb-3">Sección en construcción</h3>
                    <p class="text-muted mb-4">
                    Estamos trabajando para habilitar este módulo muy pronto.
                    </p>

                    <span class="badge bg-warning text-dark px-3 py-2">
                    Próximamente
                    </span>

                </div>
            </div>`

        return html;
    }
}

export const UI = new sharedComponents()