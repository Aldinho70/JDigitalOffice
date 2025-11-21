import { changeView } from "../Menu/MenuLeft/MenuLeft.js";

export const Reports = () => {
  return `
    <div class="p-3">
    
      <table id="tblReports" class="table table-striped table-hover w-100">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Monitorista</th>
            <th>Cliente</th>
            <th>Unidad</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `;
};

export const loadReportsTable = async () => {
    try {
        const url = "http://ws4cjdg.com/JDigitalReports/src/api/routes/reports/getReports.php";
        const resp = await fetch(url);
        const data = await resp.json();

        // Por si el endpoint envía un solo objeto en lugar de array
        const rows = Array.isArray(data) ? data : [data];

        // Limpiar instancia previa
        if ($.fn.DataTable.isDataTable("#tblReports")) {
            $("#tblReports").DataTable().destroy();
        }

        // Poblar manualmente el tbody
        const tbody = document.querySelector("#tblReports tbody");
        tbody.innerHTML = rows.map(r => `
            <tr>
                <td>${r.id}</td>
                <td>${r.fechaReporte}</td>
                <td>${r.monitorista}</td>
                <td>${r.cliente}</td>
                <td>${r.Idunidad}</td>
                <td>${r.nombreUnidad}</td>
                <td>${r.tipoReporte}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-primary me-1" data-id="${r.id}">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning me-1" data-id="${r.id}">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" data-id="${r.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join("");

        // Inicializar DataTable
        $("#tblReports").DataTable({
          responsive: true,
          pageLength: 10,
          scrollY: "65vh",     
          scrollCollapse: true,
          paging: true,
          language: {
              url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-MX.json"
          },
          dom: '<"d-flex justify-content-between align-items-center mb-2"lfB>rtip',
          buttons: [
            {
              text: 'Nuevo reporte',
              className: 'btn btn-success',
              action: function () {
                changeView('4')
              }
            }
          ]
        }
      );
    } catch (err) {
        console.error("Error cargando datos:", err);
    }
};

