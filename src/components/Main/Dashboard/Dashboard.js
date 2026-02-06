import { Reports, loadReportsTable } from "../Reports/Reports.js"
import { request } from "../../../Utils/request.js"

export const Dashboard = () => {
    return `
        <div class="container-fluid p-4 dashboard">

    <!-- SECCIÓN: OPERACIÓN -->
            <div class="mb-4">
                <h5 class="section-title">
                    <i class="bi bi-gear-wide-connected me-2"></i>Operación
                </h5>

                <div class="row g-3">
                    <div class="col-md-3">
                        <div class="kpi-card kpi-primary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" onclick="viewReports('all_Reports')">
                            <div class="kpi-icon"><i class="bi bi-clipboard-data"></i></div>
                            <div>
                                <h3 id="root-kpi-all-reports">0</h3>
                                <span>Reportes totales</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="kpi-card kpi-success" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" onclick="viewReports('atendidas')">
                            <div class="kpi-icon"><i class="bi bi-check-circle"></i></div>
                            <div>
                                <h3 id="root-kpi-reports-attend">0</h3>
                                <span>Atendidos</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="kpi-card kpi-danger" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" onclick="viewReports('noAtendidas')">
                            <div class="kpi-icon"><i class="bi bi-x-circle"></i></div>
                            <div>
                                <h3 id="root-kpi-reports-not-attend">0</h3>
                                <span>No atendidos</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="kpi-card kpi-warning">
                            <div class="kpi-icon"><i class="bi bi-speedometer2"></i></div>
                            <div>
                                <h3 id="root-kpi-porcent">0%</h3>
                                <span>Eficiencia</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SECCIÓN: FACTURACIÓN -->
            <div class="mb-4">
                <h5 class="section-title">
                    <i class="bi bi-cash-stack me-2"></i>Facturación
                </h5>

                <div class="row g-3">
                    <div class="col-md-2">
                        <div class="kpi-card kpi-neutral">
                            <h4 id="root-kpi-pendiente_pago">0</h4>
                            <span>Pendiente pago</span>
                        </div>
                    </div>

                    <div class="col-md-2" onClick="viewKpisFacturation('pagado')">
                        <div class="kpi-card kpi-success-soft">
                            <h4 id="root-kpi-pagado">0</h4>
                            <span>Pagado</span>
                        </div>
                    </div>

                    <div class="col-md-2">
                        <div class="kpi-card kpi-primary-soft">
                            <h4 id="root-kpi-facturados">0</h4>
                            <span>Facturados</span>
                        </div>
                    </div>

                    <div class="col-md-2">
                        <div class="kpi-card kpi-danger-soft">
                            <h4 id="root-kpi-sin_factura">0</h4>
                            <span>Sin factura</span>
                        </div>
                    </div>

                    <div class="col-md-2">
                        <div class="kpi-card kpi-info-soft">
                            <h4 id="root-kpi-tecnico">0</h4>
                            <span>Asignados</span>
                        </div>
                    </div>

                    <div class="col-md-2">
                        <div class="kpi-card kpi-neutral">
                            <h4 id="root-kpi-sin_asignacion">0</h4>
                            <span>Sin asignar</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- GRÁFICAS -->
            <div class="row g-4">
                <div class="col-md-2">
                    <div class="chart-box h-100">
                        <h6 class="fw-semibold fs-6">Tecnicos mas solicitados</h6>

                        <ul class="list-group list-group-flush small">
                            <li class="list-group-item d-flex justify-content-between">
                                Alberto Metlich
                            </li>
                            <li class="list-group-item d-flex justify-content-between">
                                Telcel
                            </li>
                            <li class="list-group-item d-flex justify-content-between">
                                Juanito
                            </li>
                            <li class="list-group-item d-flex justify-content-between">
                                Tec Dgo Javier Jurado
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="chart-box h-100">
                        <h6 class="fw-semibold fs-6">Unidad con mas reportes</h6>

                        <ul class="list-group list-group-flush small">
                            <li class="list-group-item d-flex justify-content-between">
                                092 - I
                            </li>
                            <li class="list-group-item d-flex justify-content-between">
                                TKF 28 32UU7F
                            </li>
                            <li class="list-group-item d-flex justify-content-between">
                                Bonanza #3
                            </li>
                            <li class="list-group-item d-flex justify-content-between">
                                P-8095**
                            </li>
                            <li class="list-group-item d-flex justify-content-between">
                                GDL-C-235
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="chart-box">
                        <h6>Clientes con más reportes</h6>
                        <div id="chart-donut-client" style="height:280px"></div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="chart-box">
                        <h6>Fallas más frecuentes</h6>
                        <div id="chart-donut-failure" style="height:280px"></div>
                    </div>
                </div>
            </div>

            <div class="offcanvas  offcanvas-bottom" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel" id="offcanvas-status">
                <div class="offcanvas-header kpi-canvas-header">
    
                    <div class="kpi-canvas-title">
                        <i id="canvas-icon" class="bi bi-clipboard-data"></i>
                        <div>
                            <div id="title-canvas" class="kpi-title">All Reports</div>
                        </div>
                    </div>

                    <button type="button"
                            class="btn btn-sm btn-danger kpi-close-btn"
                            data-bs-dismiss="offcanvas">
                        <i class="bi bi-x-lg me-1"></i> Cerrar
                    </button>

                </div>

                <div class="offcanvas-body " id="kpi-offcanvas-content"></div>
            </div>

        </div>
    `
}

export const initDashboard = async () => {
    let res = await getKpisTickets()
    const kpisTickets = res[0];
    
    $("#root-kpi-all-reports").html(kpisTickets.total_tickets)
    $("#root-kpi-porcent").html(kpisTickets.porcentaje_cumplimiento + '%')
    $("#root-kpi-reports-attend").html(kpisTickets.tickets_resueltos)
    $("#root-kpi-reports-not-attend").html(kpisTickets.tickets_no_resueltos)

    res = await getKpisFacturacion();
    $("#root-kpi-pagado").html( res.pagado )
    $("#root-kpi-pendiente_pago").html( res.pendiente )
    
    res = await getKpisFacturacion2();
    $("#root-kpi-facturados").html( res.facturados )
    $("#root-kpi-sin_factura").html( res.sin_factura )
    

    res = await getContField('cliente');
    initChartClient( res );

    res = await getContField('tipoReporte');
    initChartFailure( res );

    res = await getContField('nombreUnidad');
    console.log( res );

    await getListKpi()
}

const getKpisTickets = async () => {
    try {
        const response = await fetch( 'http://ws4cjdg.com/JDigitalReports/src/api/routes/dashboard/viewDashboardKpisTickets.php' );
        const data = await response.json();
        return data;
    } catch (error) {
        return {}
    }
}

const getKpisFacturacion = async () => {
    try {
        const kpis = {};

        const response = await request(
            'http://ws4cjdg.com/JDigitalReports/src/api/routes/utils/getQuery.php',
            'POST',
            {
                query: `
                SELECT status_pago, COUNT(*) AS repeticiones
                FROM cobros_clientes
                GROUP BY status_pago;
                `
            }
        );

        if (response.status === 'ok') {
            response.mensaje.forEach(el => {
                kpis[el.status_pago] = el.repeticiones;
            });
        }

        console.log( kpis );
        
        return kpis;

    } catch (error) {
        console.error(error);
        return {};
    }
};

const getKpisFacturacion2 = async () => {
    try {
        const response = await request(
            'http://ws4cjdg.com/JDigitalReports/src/api/routes/utils/getQuery.php',
            'POST',
            {
                query: `
                SELECT
                    COUNT(id_asignacion) AS facturados,
                    SUM(CASE WHEN id_asignacion IS NULL THEN 1 ELSE 0 END) AS sin_factura
                FROM view_tickets_reports;
                `
            }
        );

        if (response.status === 'ok') {
            console.log( response.mensaje[0] );
            
            return response.mensaje[0];
        }

    } catch (error) {
        console.error(error);
        return {};
    }
};

const getListKpi = async () => {
    try {
        const kpis = {};

        const response = await request(
            'http://ws4cjdg.com/JDigitalReports/src/api/routes/utils/getQuery.php',
            'POST',
            {
                query: `
                SELECT
                nombre_tecnico,
                COUNT(*) AS total
                FROM view_tickets_reports
                WHERE nombre_tecnico IS NOT NULL
                GROUP BY nombre_tecnico
                ORDER BY total DESC
                LIMIT 5;`
            }
        );

        if (response.status === 'ok') {
            console.log(response.mensaje);
            
            // response.mensaje.forEach(el => {
            //     kpis[el.status_pago] = el.repeticiones;
            // });
        }

    } catch (error) {
        console.error(error);
        return {};
    }
}

const getContField = async (campo) => {
    try {
        const response = await fetch(
            "http://ws4cjdg.com/JDigitalReports/src/api/routes/dashboard/contFieldTickets.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ campo })
            }
        );

        return await response.json();
    } catch (error) {
        console.error(error);
        return {};
    }
};

const viewReports = ( type ) => {
    $("#kpi-offcanvas-content").html( Reports() )
    $("#title-canvas").html( (type).replace(/_/g, '  ').trim().toUpperCase());
    loadReportsTable( type );
    
}
window.viewReports = viewReports

const viewKpisFacturation = async ( filter ) => {
    const response = await request(
        'http://ws4cjdg.com/JDigitalReports/src/api/routes/utils/getQuery.php',
        'POST',
        {
            query: `
            SELECT *
            FROM cobros_clientes
            WHERE status_pago = '${filter}';
            `
        }
    );

    console.log('fun: viewKpisFacturation:');

    if (response.status === 'ok') {
        console.log(response.mensaje);
        
        // response.mensaje.forEach(el => {
        //     kpis[el.status_pago] = el.repeticiones;
        // });
    }
}
window.viewKpisFacturation = viewKpisFacturation;

const initChartClient = (dataClientes) => {

    // Transformar array → formato Highcharts
    const pieData = dataClientes.map(item => ({
        name: item.valor,
        y: item.total
    }));

    // DONUT
    Highcharts.chart('chart-donut-client', {
        chart: { type: 'pie' },
        title: null,
        plotOptions: {
            pie: {
                size: '80%',
                dataLabels: { enabled: true },
                borderWidth: 0
            }
        },
        series: [{
            name: 'Tickets',
            data: pieData
        }]
    });
};

const initChartFailure = (data) => {

    // Transformar array → formato Highcharts
    const pieData = data.map(item => ({
        name: item.valor,
        y: item.total
    }));

    // DONUT
    Highcharts.chart('chart-donut-failure', {
    chart: {
        type: 'pie',
        zooming: { type: 'xy' },
        panning: {
            enabled: true,
            type: 'xy'
        },
        panKey: 'shift'
    },

    title: { text: null },

    tooltip: {
        pointFormat: '<b>{point.y}</b> tickets ({point.percentage:.1f}%)'
    },

    plotOptions: {
        pie: {
            size: '80%',
            allowPointSelect: true,
            cursor: 'pointer',
            borderWidth: 0,

            dataLabels: [
                {
                    enabled: true,
                    distance: 20,
                    format: '{point.name}'
                },
                {
                    enabled: true,
                    distance: -35,
                    format: '{point.percentage:.1f}%',
                    style: {
                        fontSize: '0.9rem',
                        textOutline: 'none',
                        opacity: 0.75
                    },
                    filter: {
                        operator: '>',
                        property: 'percentage',
                        value: 8
                    }
                }
            ]
        }
    },

    series: [{
        name: 'Tickets',
        colorByPoint: true,
        data: pieData
    }],

    credits: { enabled: false }
});

};
