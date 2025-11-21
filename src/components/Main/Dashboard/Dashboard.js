export const Dashboard = () => {
    return `
        <div class="container-fluid p-4">

        <!-- TÍTULO -->
        <div class="mb-4">
            <h2 class="fw-bold">Dashboard de Operaciones ⚠️ESTO ES SOLO DE EJEMPLO YA SE ESTA TRABAJANDO⚠️</h2>
            <p class="text-muted">Vista general del rendimiento y datos clave</p>
        </div>

        <!-- KPIS -->
        <div class="row g-3 mb-4">
            <div class="col-md-3">
                <div class="kpi-card kpi-1">
                    <h4 class="fw-bold">345</h4>
                    <p class="m-0">Reportes del mes</p>
                </div>
            </div>

            <div class="col-md-3">
                <div class="kpi-card kpi-2">
                    <h4 class="fw-bold">87%</h4>
                    <p class="m-0">Eficiencia operativa</p>
                </div>
            </div>

            <div class="col-md-3">
                <div class="kpi-card kpi-3">
                    <h4 class="fw-bold">1,240</h4>
                    <p class="m-0">Unidades activas</p>
                </div>
            </div>

            <div class="col-md-3">
                <div class="kpi-card kpi-4">
                    <h4 class="fw-bold">12%</h4>
                    <p class="m-0">Incidencias críticas</p>
                </div>
            </div>
        </div>

        <!-- GRÁFICAS -->
        <div class="row g-4">

            <div class="col-md-4">
                <div class="chart-box">
                    <h5 class="fw-semibold mb-3">Distribución de Reportes</h5>
                    <div id="chart-donut" style="height: 280px;"></div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="chart-box">
                    <h5 class="fw-semibold mb-3">Reportes por Día</h5>
                    <div id="chart-bars" style="height: 280px;"></div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="chart-box">
                    <h5 class="fw-semibold mb-3">Consumo Promedio (km/l)</h5>
                    <div id="chart-line" style="height: 280px;"></div>
                </div>
            </div>

        </div>

    </div>
    `
}

export const initCharts = () => {
    // DONUT (tipo plato)
        Highcharts.chart('chart-donut', {
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
                data: [
                    { name: 'Fallas', y: 45 },
                    { name: 'Revisiones', y: 25 },
                    { name: 'Sensores', y: 15 },
                    { name: 'Otros', y: 15 }
                ]
            }]
        });

        // BARRAS
        Highcharts.chart('chart-bars', {
            chart: { type: 'column' },
            title: null,
            xAxis: { categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] },
            yAxis: { title: { text: '' } },
            series: [{
                name: 'Reportes',
                data: [12, 19, 15, 22, 17, 10, 8]
            }]
        });

        // LÍNEA
        Highcharts.chart('chart-line', {
            chart: { type: 'line' },
            title: null,
            xAxis: { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'] },
            yAxis: { title: { text: '' } },
            series: [{
                name: 'Km/L',
                data: [4.5, 4.8, 4.2, 5.0, 4.7, 5.1]
            }]
        });
}