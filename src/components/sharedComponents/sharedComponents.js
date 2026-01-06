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
}

export const UI = new sharedComponents()