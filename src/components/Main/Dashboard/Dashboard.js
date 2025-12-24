import { Reports, loadReportsTable } from "../Reports/Reports.js"

export const Dashboard = () => {
    return `
        <div class="container-fluid p-4">

        <!-- TÍTULO -->
        <div class="mb-4">
            <h2 class="fw-bold">Dashboard de Operaciones </h2>
            <p class="text-muted">Vista general del rendimiento y datos clave</p>
        </div>

        <!-- KPIS -->
        <div class="row g-3 mb-4">
            <div class="col-md-3">
                <button class="kpi-card kpi-1 text-light w-100 border-0 text-start"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#kpiOffcanvas"
                    aria-controls="kpiOffcanvas"
                    data-kpi="all"
                    onClick="viewReports('allReports')">
                        <h4 class="fw-bold" id="root-kpi-all-reports">0</h4>
                        <p class="m-0">Reportes</p>
                </button>
            </div>

            <div class="col-md-3">
                <button class="kpi-card kpi-2 text-light w-100 border-0 text-start"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#kpiOffcanvas"
                    aria-controls="kpiOffcanvas"
                    data-kpi="attended"
                    onClick="viewReports('atendidas')">
                        <h4 class="fw-bold" id="root-kpi-reports-attend">0</h4>
                        <p class="m-0">Reportes atendidos</p>
                </button>
            </div>

            <div class="col-md-3">
                <button class="kpi-card kpi-4 text-light w-100 border-0 text-start"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#kpiOffcanvas"
                    aria-controls="kpiOffcanvas"
                    data-kpi="not-attended"
                    onClick="viewReports('noAtendidas')">
                        <h4 class="fw-bold" id="root-kpi-reports-not-attend">0</h4>
                        <p class="m-0">Reportes no atendidos</p>
                </button>
            </div>

            <div class="col-md-3">
                <button class="kpi-card kpi-3 text-light w-100 border-0 text-start">
                    <h4 class="fw-bold" id="root-kpi-porcent">0%</h4>
                    <p class="m-0">Eficiencia operativa</p>
                </button>
            </div>
        </div>

        <!-- GRÁFICAS -->
        <div class="row g-4">

            <div class="col-md-6">
                <div class="chart-box">
                    <h5 class="fw-semibold mb-3">Clientes con mas reportes</h5>
                    <div id="chart-donut-client" style="height: 280px;"></div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="chart-box">
                    <h5 class="fw-semibold mb-3">Fallas con mas reportes</h5>
                    <div id="chart-donut-failure" style="height: 280px;"></div>
                </div>
            </div>

            <!-- <div class="col-md-4">
                <div class="chart-box">
                    <h5 class="fw-semibold mb-3">Unidades con mas fallas</h5>
                    <div id="chart-donut-units" style="height: 280px;"></div>
                </div>
            </div> -->

        </div>

        <!-- off-canvas -->
        <div class="offcanvas offcanvas-bottom h-75" tabindex="-1" id="kpiOffcanvas" aria-labelledby="kpiOffcanvasLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="kpiOffcanvasLabel">
                    <i class="bi bi-bar-chart me-2"></i> Detalle del KPI
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>

            <div class="offcanvas-body">
                <div id="kpi-offcanvas-content">
                    
                </div>
            </div>
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

    res = await getContField('cliente');
    initChartClient( res );

    res = await getContField('tipoReporte');
    initChartFailure( res );
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
    loadReportsTable( type );
    
}
window.viewReports = viewReports

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
                innerSize: '55%',
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
        chart: { type: 'pie' },
        title: null,
        plotOptions: {
            pie: {
                innerSize: '55%',
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