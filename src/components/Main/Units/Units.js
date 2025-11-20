export const Units = () => {
  return `
    <div class="p-3">
      <table id="tblUnits" class="table table-striped table-hover w-100">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Monitorista</th>
            <th>Cliente</th>
            <th>Unidad</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Comentario</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `;
};

export const loadUnitsTable = async () => {
    try {
        const url = "http://ws4cjdg.com/JDigitalReports/src/api/routes/reports/getReports.php";
        const resp = await fetch(url);
        const data = await resp.json();

        // Por si el endpoint envía un solo objeto en lugar de array
        const rows = Array.isArray(data) ? data : [data];

        // Limpiar instancia previa
        if ($.fn.DataTable.isDataTable("#tblUnits")) {
            $("#tblUnits").DataTable().destroy();
        }

        // Poblar manualmente el tbody
        const tbody = document.querySelector("#tblUnits tbody");
        tbody.innerHTML = rows.map(r => `
            <tr>
                <td>${r.id}</td>
                <td>${r.fechaReporte}</td>
                <td>${r.monitorista}</td>
                <td>${r.cliente}</td>
                <td>${r.Idunidad}</td>
                <td>${r.nombreUnidad}</td>
                <td>${r.tipoReporte}</td>
                <td>${r.comentario}</td>
            </tr>
        `).join("");

        // Inicializar DataTable
        $("#tblUnits").DataTable({
            responsive: true,
            pageLength: 10,
            scrollY: "70vh",     // <-- altura fija
            scrollCollapse: true,
            paging: true,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-MX.json"
            }
        });


    } catch (err) {
        console.error("Error cargando datos:", err);
    }
};

