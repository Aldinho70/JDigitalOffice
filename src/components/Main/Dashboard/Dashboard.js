import { request } from "../../../Utils/request.js"
import { Reports, loadReportsTable } from "../Reports/Reports.js"
import { FacturasCards, loadFacturasCards } from "../Info/Facturation/Facturacion.js"

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
                        <div class="kpi-card kpi-success" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" onclick="viewReports('completed')">
                            <div class="kpi-icon"><i class="bi bi-check-circle"></i></div>
                            <div>
                                <h3 id="root-kpi-reports-attend">0</h3>
                                <span>Atendidos</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="kpi-card kpi-danger" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" onclick="viewReports('pending')">
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
                        <div class="kpi-card kpi-neutral" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" onclick="viewFacturation('pending')" >
                            <h4 id="root-kpi-pendiente_pago">0</h4>
                            <span>Pendiente pago</span>
                        </div>
                    </div>

                    <div class="col-md-2 kpi-popover" onClick="viewKpisFacturation('pagado')">
                        <div class="kpi-card kpi-success-soft" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" onclick="viewFacturation('paid')">
                            <h4 id="root-kpi-pagado">0</h4>
                            <span>Pagado</span>
                        </div>
                    </div>

                    <div class="col-md-2">
                        <div class="kpi-card kpi-primary-soft" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" onclick="viewReports('isBillable')">
                            <h4 id="root-kpi-facturados">0</h4>
                            <span>Facturados</span>
                        </div>
                    </div>

                    <div class="col-md-2">
                        <div class="kpi-card kpi-danger-soft" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom" onclick="viewReports('noBillable')" >
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
                    <div class="card shadow-sm h-100 border-0 list-card">
                        <div class="card-body p-3 d-flex flex-column">
                            <h6 class="card-title fw-semibold mb-3 d-flex align-items-center gap-2">
                                <i class="bi bi-person-badge text-primary"></i>
                                Técnicos más solicitados
                            </h6>

                            <ul class="list-group list-group-flush small list-scroll" id="list_group_technicals"></ul>
                        </div>
                    </div>
                </div>

                <div class="col-md-2">
                    <div class="card shadow-sm h-100 border-0 list-card">
                        <div class="card-body p-3 d-flex flex-column">
                            <h6 class="card-title fw-semibold mb-3 d-flex align-items-center gap-2">
                                <i class="bi bi-truck text-success"></i>
                                Unidad con más reportes
                            </h6>

                            <ul class="list-group list-group-flush small list-scroll" id="list_group_units" ></ul>
                        </div>
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

    /**
     * Repors and Tickets
     */
        let res = await getKpisTickets()
        const kpisTickets = res[0];
        
        $("#root-kpi-all-reports").html(kpisTickets.total_tickets)
        $("#root-kpi-porcent").html(kpisTickets.porcentaje_cumplimiento + '%')
        $("#root-kpi-reports-attend").html(kpisTickets.tickets_resueltos)
        $("#root-kpi-reports-not-attend").html(kpisTickets.tickets_no_resueltos)

    /**
     * Facturas
     */
        res = await getKpisFacturacion();
        $("#root-kpi-pagado").html( res.paid )
        $("#root-kpi-pendiente_pago").html( res.pending )
        
        res = await getKpisFacturacion2();
        $("#root-kpi-facturados").html( res.facturados )
        $("#root-kpi-sin_factura").html( res.sin_factura )
    

    res = await getContField('cliente');
    initChartClient( res );

    res = await getContField('tipoReporte');
    initChartFailure( res );

    res = await getContField('nombreUnidad');
    if( res.length ){
        const html = res.map( (unit) => {
            return `
                <li class="list-group-item d-flex align-items-center gap-2">
                    <i class="bi bi-truck"></i>
                    ${unit.valor}
                </li>`
        } )
        $("#list_group_units").html(html)
    }

    await getListKpi();
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
                query: `SELECT 
                            payment_status, count(*) AS repeticiones 
                        FROM 
                            client_charges
                        GROUP BY 
                            payment_status;`
            }
        );

        if (response.status === 'ok') {
            response.mensaje.forEach(f => {
                kpis[f.payment_status] = f.repeticiones;
            });
        }

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
                    COUNT(is_billable) AS facturados, 
                    SUM(
                        CASE
                            WHEN is_billable IS NULL THEN 1
                            ELSE 0
                        END
                    ) AS sin_factura
                FROM vw_reports_tickets;`
            }
        );

        if (response.status === 'ok') {
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
            
            const html = response.mensaje.map( (tecnico) => {
                return `
                    <li class="list-group-item d-flex align-items-center gap-2">
                        <i class="bi bi-person-circle"></i>
                        ${tecnico.nombre_tecnico}
                    </li>`
            } )
            
            $("#list_group_technicals").html(html)
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

const viewFacturation = ( filter ) =>{
    $("#kpi-offcanvas-content").html( FacturasCards() )
    $("#title-canvas").html( ( filter ).replace(/_/g, '  ').trim().toUpperCase());
    loadFacturasCards( filter );
}
window.viewFacturation = viewFacturation;

const viewKpisFacturation = async ( filter ) => {
    // const response = await request(
    //     'http://ws4cjdg.com/JDigitalReports/src/api/routes/utils/getQuery.php',
    //     'POST',
    //     {
    //         query: `
    //         SELECT *
    //         FROM cobros_clientes
    //         WHERE status_pago = '${filter}';
    //         `
    //     }
    // );

    // console.log('fun: viewKpisFacturation:');

    // if (response.status === 'ok') {
    //     console.log(response.mensaje);
        
    //     // response.mensaje.forEach(el => {
    //     //     kpis[el.status_pago] = el.repeticiones;
    //     // });
    // }
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


// ui/tippy.kpi.js
export const initKpiPopovers = () => {

    tippy('.kpi-popover', {
        allowHTML: true,
        trigger: 'click',
        placement: 'top',
        interactive: true,
        theme: 'light-border',
        content(reference) {

            const tipo = reference.dataset.kpi;

            return `
                <ul class="list-group list-group-flush small">
                    <li class="list-group-item" onclick="viewKpisFacturation('${tipo}', 'hoy')">Hoy</li>
                    <li class="list-group-item" onclick="viewKpisFacturation('${tipo}', 'semana')">Esta semana</li>
                    <li class="list-group-item" onclick="viewKpisFacturation('${tipo}', 'mes')">Este mes</li>
                </ul>
            `;
        }
    });

};
