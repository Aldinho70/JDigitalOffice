export const Units = () => {
    return `
        <div class="">

            <div class="card shadow-sm border-0 rounded-4">
                
                <!-- HEADER -->
                <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold">Unidades registradas</h5>

                <button class="btn btn-primary rounded-3" data-bs-toggle="modal" data-bs-target="#modal-unit">
                    <i class="bi bi-plus-circle me-2"></i>Registrar unidad
                </button>
                </div>

                <!-- BODY -->
                <div class="card-body p-3">

                <table class="table table-hover align-middle">
                    <thead class="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Cliente</th>
                        <th>Placa</th>
                        <th>Estatus</th>
                        <th>Último reporte</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                    </thead>

                    <tbody>

                    <!-- FILA FAKE 1 -->
                    <tr>
                        <td>1</td>
                        <td>Unidad 101</td>
                        <td>Transportes MX</td>
                        <td>ABC-123</td>
                        <td><span class="badge bg-success">Activa</span></td>
                        <td>Hace 2 min</td>
                        <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-eye"></i></button>
                        <button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>

                    <!-- FILA FAKE 2 -->
                    <tr>
                        <td>2</td>
                        <td>Unidad 202</td>
                        <td>Logística Norte</td>
                        <td>XYZ-789</td>
                        <td><span class="badge bg-warning text-dark">Mantenimiento</span></td>
                        <td>Hace 10 min</td>
                        <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-eye"></i></button>
                        <button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>

                    <!-- FILA FAKE 3 -->
                    <tr>
                        <td>3</td>
                        <td>Unidad 303</td>
                        <td>Express Cargo</td>
                        <td>LMN-456</td>
                        <td><span class="badge bg-danger">Inactiva</span></td>
                        <td>Ayer</td>
                        <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary me-1"><i class="bi bi-eye"></i></button>
                        <button class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>

                    </tbody>

                </table>

                </div>
            </div>

            </div>

            <!-- MODAL REGISTRO -->
            <div class="modal fade" id="modal-unit" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content rounded-4 shadow">

                    <div class="modal-header">
                        <h5 class="modal-title fw-bold">Registrar unidad</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        <p class="text-muted mb-0">Aquí irá el formulario…</p>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button class="btn btn-primary">Guardar</button>
                    </div>

                </div>
            </div>
        </div>

    `
}