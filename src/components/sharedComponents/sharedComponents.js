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
                            <div id="report-loader" class="text-center">
                                <div class="spinner-border text-dark"></div>
                                <p class="mt-2">Cargando...</p>
                            </div>

                            <!-- Contenido final del modal -->
                            <div id="report-content-${id_tag}" class="visually-hidden"></div>

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

        // $("#report-content").html(html).removeClass("visually-hidden");
        // $("#report-loader").addClass("visually-hidden");

    };
}

export const UI = new sharedComponents()