/**
 * Dashboard handler
 */
import { isNullOrUndefined as isNOU, EmitType, addClass, removeClass } from '@syncfusion/ej2-base';
import {
    Selection, SelectionMode,
    AccumulationAnnotation, IAccResizeEventArgs, AccumulationChart, AccumulationLegend, PieSeries, AccumulationDataLabel, AccumulationTooltip, getElement,
    AccumulationSelection, IMouseEventArgs, Chart, ColumnSeries, Category, Legend, Tooltip, ChartAnnotation, Index, indexFinder, PolarSeries,
    LineSeries, ChartTheme, Zoom, SplineSeries, SplineAreaSeries, AreaSeries, AccumulationTheme, StripLine, BubbleSeries, IAccLoadedEventArgs, DateTime, Logarithmic, Crosshair, IPointEventArgs, ILoadedEventArgs,
} from '@syncfusion/ej2-charts';
import { AppBar } from "@syncfusion/ej2-navigations";
import { Skeleton } from '@syncfusion/ej2-notifications';
import { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday } from './datasource';
AccumulationChart.Inject(AccumulationSelection, AccumulationLegend, PieSeries, AccumulationDataLabel, AccumulationAnnotation, AccumulationTooltip, AccumulationSelection, ChartAnnotation);
Chart.Inject(Selection, ColumnSeries, Selection, Zoom, SplineSeries, Category, Legend, Tooltip, ChartAnnotation, DateTime, Crosshair, PolarSeries);
Chart.Inject(LineSeries, AreaSeries, SplineAreaSeries, BubbleSeries, DateTime, Logarithmic, Legend, Tooltip, StripLine);

export interface MyWindow extends Window {
    water: () => void;
    steps: () => void;
    settings: () => void;
    calories: () => void;
    sleep: () => void;
}


declare let window: MyWindow;

let linechartObj: Chart;
let pieChartObj: AccumulationChart;
let annotationpie1: AccumulationChart;
let annotationpie2: AccumulationChart;
let annotation: boolean = true;
let selectedpoint: boolean = false;
export let category: string[] = [];

Initialize();

function Initialize(): void {
    InitializeAppBar();
    InitializeSkeleton();
    LoadCardData();
    LoadChartData("calorie");
    BindCardClick();
}
function InitializeAppBar(): void {
    let appbarObj = new AppBar({
        cssClass: 'custom-appbar'
    });
    appbarObj.appendTo("#appbar");
}
function InitializeSkeleton(): void {
    const cards: NodeListOf<HTMLElement> = document.querySelectorAll('#card-row .row .e-card');
    addClass([cards[0], cards[1], cards[2], cards[3]], "hidden-element-size");
    let calorieSkeleton: Skeleton = new Skeleton({
        width: '100%',
        height: cards[0].offsetHeight,
        shimmerEffect: 'Wave'
    })
    calorieSkeleton.appendTo('#calorie-skeleton');
    let stepSkeleton: Skeleton = new Skeleton({
        width: '100%',
        height: cards[1].offsetHeight,
        shimmerEffect: 'Wave'
    })
    stepSkeleton.appendTo('#steps-skeleton');
    let waterSkeleton: Skeleton = new Skeleton({
        width: '100%',
        height: cards[2].offsetHeight,
        shimmerEffect: 'Wave'
    })
    waterSkeleton.appendTo('#water-skeleton');
    let sleepSkeleton: Skeleton = new Skeleton({
        width: '100%',
        height: cards[3].offsetHeight,
        shimmerEffect: 'Wave'
    })
    sleepSkeleton.appendTo('#sleep-skeleton');
    let lineChartSkeleton: Skeleton = new Skeleton({
        width: '100%',
        height: '100%',
        shimmerEffect: 'Wave'
    })
    removeClass([cards[0], cards[1], cards[2], cards[3]], "hidden-element-size");
    lineChartSkeleton.appendTo('#line-chart-skeleton');
    let pieChartSkeleton: Skeleton = new Skeleton({
        width: '100%',
        height: '100%',
        shimmerEffect: 'Wave'
    })
    pieChartSkeleton.appendTo('#pie-chart-skeleton');
}
function GetCardData(): any {
    return new Promise(resolve => setTimeout(() => {
        let data: { [key: string]: Object } = {};
        data['calories-eaten'] = '13,100';
        data['steps-taken'] = '52,100';
        data['water-consumed'] = '38.7 ltr';
        data['sleep-duration'] = '50 hr';
        resolve(data);
    }, 2000));
}
function LoadCardData(): void {
    GetCardData().then((data: any) => {
        document.getElementById('calories-text').textContent = data['calories-eaten'];
        document.getElementById('steps-text').textContent = data['steps-taken'];
        document.getElementById('water-text').textContent = data['water-consumed'];
        document.getElementById('sleep-text').textContent = data['sleep-duration'];
        document.querySelectorAll('#card-row .row .card-skeleton').forEach((elem: HTMLElement) => elem.style.display = 'none');
        document.querySelectorAll('#card-row .row .e-card').forEach((elem: HTMLElement) => elem.style.display = 'flex');
        ToggleVisibility('none', 'block');
    });
}
function GetChartData(): any {
    return new Promise(resolve => setTimeout(() => {
        let data: { [key: string]: Object } = {};
        resolve(data);
    }, 2000));
}
function LoadChartData(activity: string): void {
    GetChartData().then((data: any) => {
        switch(activity.toLowerCase()) {
            case "calorie": {
                ToggleVisibility('none', 'block');
                InitializeCaloriesComponent();
                break;
            }
            case "steps": {
                ToggleVisibility('none', 'block');
                InitializeStepsComponent();
                break;
            }
            case "water": {
                ToggleVisibility('none', 'block');
                InitializeWaterComponent();
                break;
            }
            case "sleep": {
                ToggleVisibility('none', 'block');
                InitializeSleepComponent();
                break;
            }
        }
    });
}
function ToggleVisibility(displaySkeleton:string, displayChart:string): void {
    (document.getElementById('line-chart-skeleton') as HTMLElement).style.display = displaySkeleton;
    (document.getElementById('pie-chart-skeleton') as HTMLElement).style.display = displaySkeleton;
    (document.getElementById('line') as HTMLElement).style.display = displayChart;
    (document.getElementById('pie-wrapper') as HTMLElement).style.display = displayChart;
}
function BindCardClick(): void{
    document.getElementById("water").onclick = function () {
        document.querySelector('#polar #pie-title').innerHTML = 'Sunday Activity';
        document.querySelector("#card-row .selected").classList.remove("selected");
        document.querySelector("#card-row #water").classList.add("selected");
        waterclick();
    };
    document.getElementById("step").onclick = function () {
        document.querySelector('#multiple-donut #pie-title').innerHTML = 'Sunday Activity';
        document.getElementById("chart-title").innerHTML = 'Steps Count';
        document.querySelector("#card-row .selected").classList.remove("selected");
        document.querySelector("#card-row #step").classList.add("selected");
        stepclick();
    };
    document.getElementById("sleep").onclick = function () {
        document.getElementById("chart-title").innerHTML = 'Sleep Tracker';
        document.querySelector("#card-row .selected").classList.remove("selected");
        document.querySelector("#card-row #sleep").classList.add("selected");
        sleepclick();
    };
    document.getElementById("calories").onclick = function () {
        document.getElementById("chart-title").innerHTML = 'Calories Consumed';
        document.querySelector("#card-row .selected").classList.remove("selected");
        document.querySelector("#card-row #calories").classList.add("selected");
        caloriesclick();
    };
}
// tslint:disable-next-line:max-func-body-length
function InitializeCaloriesComponent(): void {
    interface Result {
        result: Object;
    }
    let pointMove: EmitType<IPointEventArgs> = (args: IPointEventArgs) => {
        let point = getElement(linechartObj.element.id + '_Series_' + args.seriesIndex + '_Point_' + args.pointIndex + '_Symbol');
        if (point) {
            point.setAttribute('cursor', 'pointer');
        }
    }
    let mouseclick: EmitType<IMouseEventArgs> = (args: IMouseEventArgs) => {
        let index: Index = indexFinder(args.target);
        if (getElement(linechartObj.element.id + '_Series_' + index.series + '_Point_' + index.point + '_Symbol')) {
            switch (index.point) {
                case 0:
                    pieChartObj.series[0].dataSource = (<{ Calories: Object[] }>Sunday[0]).Calories;
                    pieChartObj.annotations[0].content = '<div id="calories-innercontent"><p id="value" >1200</p><p id="sub-value" style="line-height: 10px">Cal consumed<hr style="margin-top: 20px; margin-bottom: 0px"><p> <p id="end-value"> 1600 cal left</p>';
                    break;
                case 1:
                    pieChartObj.series[0].dataSource = (<{ Calories: Object[] }>Monday[0]).Calories;
                    pieChartObj.annotations[0].content = '<div id="calories-innercontent"><p id="value">1800</p><p id="sub-value" style="line-height: 10px">Cal consumed<hr style="margin-top: 20px; margin-bottom: 0px"><p> <p id="end-value"> 1000 cal left</p>';
                    break;
                case 2:
                    pieChartObj.series[0].dataSource = (<{ Calories: Object[] }>Tuesday[0]).Calories;
                    pieChartObj.annotations[0].content = '<div id="calories-innercontent"><p id="value">2850</p><p id="sub-value" style="line-height: 10px">Cal consumed<hr style="margin-top: 20px; margin-bottom: 0px"><p> <p id="end-value"> 100 cal left</p>';
                    break;
                case 3:
                    pieChartObj.series[0].dataSource = (<{ Calories: Object[] }>Wednesday[0]).Calories;
                    pieChartObj.annotations[0].content = '<div id="calories-innercontent"><p id="value">1900</p><p id="sub-value" style="line-height: 10px">Cal consumed<hr style="margin-top: 20px; margin-bottom: 0px"><p> <p id="end-value"> 900 cal left</p>'
                    break;
                case 4:
                    pieChartObj.series[0].dataSource = (<{ Calories: Object[] }>Thursday[0]).Calories;
                    pieChartObj.annotations[0].content = '<div id="calories-innercontent"><p id="value">2500</p><p id="sub-value" style="line-height: 10px">Cal consumed<hr style="margin-top: 20px; margin-bottom: 0px"><p> <p id="end-value"> 300 cal left</p>'
                    break;
                case 5:
                    pieChartObj.series[0].dataSource = (<{ Calories: Object[] }>Friday[0]).Calories;
                    pieChartObj.annotations[0].content = '<div id="calories-innercontent"><p id="value">1650</p><p id="sub-value" style="line-height: 10px">Cal consumed<hr style="margin-top: 20px; margin-bottom: 0px"><p> <p id="end-value"> 1150 cal left</p>'
                    break;
                case 6:
                    pieChartObj.series[0].dataSource = (<{ Calories: Object[] }>Saturday[0]).Calories;
                    pieChartObj.annotations[0].content = '<div id="calories-innercontent"><p id="value">1300</p><p id="sub-value" style="line-height: 10px">Cal consumed<hr style="margin-top: 20px; margin-bottom: 0px"><p> <p id="end-value"> 1500 cal left</p>'
                    break;
            }
            pieChartObj.appendTo('#account-balance');
            pieChartObj.refresh();
        }
    }
    let pointClick: EmitType<IMouseEventArgs> = (args: IMouseEventArgs) => {
        let index: Index = indexFinder(args.target);
        if (getElement(linechartObj.element.id + '_Series_' + index.series + '_Point_' + index.point)) {
            switch (index.point) {
                case 0:
                    pieChartObj.series[0].dataSource = (<{ Breakfast: Object[] }>Sunday[0]).Breakfast;
                    break;
                case 1:
                    pieChartObj.series[0].dataSource = (<{ Lunch: Object[] }>Monday[0]).Lunch;
                    break;
                case 2:
                    pieChartObj.series[0].dataSource = (<{ Dinner: Object[] }>Tuesday[0]).Dinner;
                    break;
                case 3:
                    pieChartObj.series[0].dataSource = (<{ Snack: Object[] }>Wednesday[0]).Snack;
                    break;
            }
            pieChartObj.appendTo('#account-balance');
            pieChartObj.refresh();
        }
    }

    pieChartObj = new AccumulationChart({
        series: [
            {
                dataSource: [{ "x": "Protein", "y": 30, "r": "100", text: '25%' }, { "x": "Fat", "y": 12.5, "r": "110", text: '12.5%' }, { "x": "Fiber", "y": 12.5, "r": "115", text: '12.5%' },
                { "x": "Calcium", "y": 10, "r": "125", text: '50%' }, { "x": "Carbs", "y": 20, "r": "125", text: '50%' }, { "x": "Vitamins", "y": 30, "r": "125", text: '50%' }],
                xName: 'x',radius: '90%', innerRadius: '80%',
                startAngle: 220,
                endAngle: 150,
                yName: 'y', explode: false,
                palettes: ['#FFE547', '#FFAE2B', '#FF7536', '#FF6111', '#CD171C', '#760104']
            },
        ],
        annotations: [{
            content: '<div id="calories-innercontent"><p id="value">1200</p><p id="sub-value" style="line-height: 10px">Cal consumed<hr style="margin-top: 10px; margin-bottom: 0px"><p> <p id="end-value"> 344 cal left</p>', region: 'Chart',
            x: '50%',
            y: '55%'
        }],
        chartMouseClick: pointClick,
        enableAnimation: true,
        legendSettings: {
            visible: false, position: "Bottom"
        },
        tooltip: { enable: true }
    });
    pieChartObj.appendTo('#account-balance');
    pieChartObj.refresh();
    /* tslint:eanble */
    linechartObj = new Chart({
        //Initializing Primary X Axis
        primaryXAxis: {
            valueType: 'Category',
            labelFormat: 'y',
            labelPlacement: 'OnTicks',
            majorGridLines: { width: 0 },
            majorTickLines: { width: 0 },
            minorTickLines: { width: 0 }
        },

        //Initializing Primary Y Axis
        primaryYAxis:
        {
            labelFormat: '{value} cal',
            rangePadding: 'None',
            minimum: 0,
            maximum: 3500,
            interval: 500,
            stripLines: [{ start: 2800, sizeType: 'Pixel', dashArray: '3,3', size: 1, color: '#D93237', text: 'Daily Average 2800 cal', textStyle: { color: '#D93237', size: '12px', fontFamily: 'Roboto', fontWeight: '500' }, horizontalAlignment: 'End', verticalAlignment: 'End' },
            { start: 2000, sizeType: 'Pixel', dashArray: '3,3', size: 1, color: '#760104', text: 'Today 2000 cal', textStyle: { color: '#760104', size: '12px', fontFamily: 'Roboto', fontWeight: '500' }, horizontalAlignment: 'End', verticalAlignment: 'End' }],
            lineStyle: { width: 0 },
            majorTickLines: { width: 0 },
            minorTickLines: { width: 0 }
        },
        background: 'transparent',
        chartArea: {
            border: {
                width: 0
            }
        },
        //Initializing Chart Series
        series: [
            {
                type: 'Line',
                dataSource: [
                    { x: 'Sunday', y: 1200 }, { x: 'Monday', y: 1800 }, { x: 'Tuesday', y: 2850 }, { x: 'Wednesday', y: 1900 }, { x: 'Thursday', y: 2500 }, { x: 'Friday', y: 1650 }, { x: 'Saturday', y: 1300 }
                ],
                xName: 'x', width: 2, marker: {
                    visible: true,
                    fill: '#FCE38A',
                    border: { color: '#F38181' },
                    width: 10,
                    height: 10
                },
                yName: 'y', fill: '#F38D36',
                border: { color: '#F23D3A', width: 2 }
            }
        ],
        chartMouseClick: mouseclick,
        pointMove: pointMove,
        tooltip: {
            enable: true, header: '${point.x}', format: '${point.y}<br>Click to View More Details',
        },
        loaded: (args: ILoadedEventArgs) => {
            document.getElementById("Break-icon").onclick = function () {
                document.getElementById("Breakfast").style.color = '#FFFFFF';
                document.getElementById("Lunch").style.color = '#7D7D7D';
                document.getElementById("Dinner").style.color = '#7D7D7D';
                document.getElementById("Snack").style.color = '#7D7D7D';
                document.getElementById("Breakfast").className = 'icon-Breakfast breakimgactive';
                document.getElementById("Lunch").className = 'icon-Lunch lunchimg';
                document.getElementById("Dinner").className = 'icon-Dinner dinnerimg';
                document.getElementById("Snack").className = 'icon-Snack snackimg';
                document.getElementById("Break-icon").style.backgroundImage = 'linear-gradient(45deg, #EF9027 0%, #F23B3B 100%)';
                document.getElementById("Lunch-icon").style.backgroundImage = null;
                document.getElementById("Dinner-icon").style.backgroundImage = null;
                document.getElementById("Snack-icon").style.backgroundImage = null;
                document.getElementById("Break-text").className = "breaktextactive";
                document.getElementById("Lunch-text").className = "lunchtext";
                document.getElementById("Dinner-text").className = "dinnertext";
                document.getElementById("Snack-text").className = "snacktext";
                document.getElementById("Break-text").style.color = '#FFFFFF';
                document.getElementById("Lunch-text").style.color = '#7D7D7D';
                document.getElementById("Dinner-text").style.color = '#7D7D7D';
                document.getElementById("Snack-text").style.color = '#7D7D7D';
                document.getElementById("fat_value").innerHTML = '30g';
                document.getElementById("fibre_value").innerHTML = '30g';
                document.getElementById("carbs_value").innerHTML = '130g';
                document.getElementById("calcium_value").innerHTML = '260g';
                document.getElementById("protein_value").innerHTML = '40g';
                document.getElementById("vitamins_value").innerHTML = '60g';
                pieChartObj.series[0].dataSource = (<{ Breakfast: Object[] }>Sunday[0]).Breakfast;
            }
            document.getElementById("Lunch-icon").onclick = function () {
                document.getElementById("Breakfast").style.color = '#7D7D7D';
                document.getElementById("Lunch").style.color = '#FFFFFF';
                document.getElementById("Dinner").style.color = '#7D7D7D';
                document.getElementById("Snack").style.color = '#7D7D7D';
                document.getElementById("Breakfast").className = 'icon-Breakfast breakimg';
                document.getElementById("Lunch").className = 'icon-Lunch lunchimgactive';
                document.getElementById("Dinner").className = 'icon-Dinner dinnerimg';
                document.getElementById("Snack").className = 'icon-Snack snackimg';
                document.getElementById("Break-text").className = "breaktext";
                document.getElementById("Lunch-text").className = "lunchtextactive";
                document.getElementById("Dinner-text").className = "dinnertext";
                document.getElementById("Snack-text").className = "snacktext";
                document.getElementById("Break-text").style.color = '#7D7D7D';
                document.getElementById("Lunch-text").style.color = '#FFFFFF';
                document.getElementById("Dinner-text").style.color = '#7D7D7D';
                document.getElementById("Snack-text").style.color = '#7D7D7D';
                document.getElementById("Break-icon").style.backgroundImage = null;
                document.getElementById("Dinner-icon").style.backgroundImage = null;
                document.getElementById("Snack-icon").style.backgroundImage = null;
                document.getElementById("Lunch-icon").style.backgroundImage = 'linear-gradient(45deg, #EF9027 0%, #F23B3B 100%)';
                document.getElementById("fat_value").innerHTML = '20g';
                document.getElementById("fibre_value").innerHTML = '10g';
                document.getElementById("carbs_value").innerHTML = '90g';
                document.getElementById("calcium_value").innerHTML = '120g';
                document.getElementById("protein_value").innerHTML = '30g';
                document.getElementById("vitamins_value").innerHTML = '40g';
                pieChartObj.series[0].dataSource = (<{ Lunch: Object[] }>Sunday[0]).Lunch;
            }
            document.getElementById("Dinner-icon").onclick = function () {
                document.getElementById("Breakfast").style.color = '#7D7D7D';
                document.getElementById("Lunch").style.color = '#7D7D7D';
                document.getElementById("Dinner").style.color = '#FFFFFF';
                document.getElementById("Snack").style.color = '#7D7D7D';
                document.getElementById("Breakfast").className = 'icon-Breakfast breakimg';
                document.getElementById("Lunch").className = 'icon-Lunch lunchimg';
                document.getElementById("Dinner").className = 'icon-Dinner dinnerimgactive';
                document.getElementById("Snack").className = 'icon-Snack snackimg';
                document.getElementById("Break-text").className = "breaktext";
                document.getElementById("Lunch-text").className = "lunchtext";
                document.getElementById("Dinner-text").className = "dinnertextactive";
                document.getElementById("Snack-text").className = "snacktext";
                document.getElementById("Break-text").style.color = '#7D7D7D';
                document.getElementById("Lunch-text").style.color = '#7D7D7D';
                document.getElementById("Dinner-text").style.color = '#FFFFFF';
                document.getElementById("Snack-text").style.color = '#7D7D7D';
                document.getElementById("Break-icon").style.backgroundImage = null;
                document.getElementById("Lunch-icon").style.backgroundImage = null;
                document.getElementById("Snack-icon").style.backgroundImage = null;
                document.getElementById("Dinner-icon").style.backgroundImage = 'linear-gradient(45deg, #EF9027 0%, #F23B3B 100%)';
                document.getElementById("fat_value").innerHTML = '50g';
                document.getElementById("fibre_value").innerHTML = '40g';
                document.getElementById("carbs_value").innerHTML = '80g';
                document.getElementById("calcium_value").innerHTML = '110g';
                document.getElementById("protein_value").innerHTML = '30g';
                document.getElementById("vitamins_value").innerHTML = '20g';
                pieChartObj.series[0].dataSource = (<{ Dinner: Object[] }>Sunday[0]).Dinner;
            }
            document.getElementById("Snack-icon").onclick = function () {
                document.getElementById("Breakfast").style.color = '#7D7D7D';
                document.getElementById("Lunch").style.color = '#7D7D7D';
                document.getElementById("Dinner").style.color = '#7D7D7D';
                document.getElementById("Snack").style.color = '#FFFFFF';
                document.getElementById("Break-text").className = "breaktext";
                document.getElementById("Lunch-text").className = "lunchtext";
                document.getElementById("Dinner-text").className = "dinnertext";
                document.getElementById("Snack-text").className = "snacktextactive";
                document.getElementById("Breakfast").className = 'icon-Breakfast breakimg';
                document.getElementById("Lunch").className = 'icon-Lunch lunchimg';
                document.getElementById("Dinner").className = 'icon-Dinner dinnerimg';
                document.getElementById("Snack").className = 'icon-Snack snackimgactive';
                document.getElementById("Break-text").style.color = '#7D7D7D';
                document.getElementById("Lunch-text").style.color = '#7D7D7D';
                document.getElementById("Dinner-text").style.color = '#7D7D7D';
                document.getElementById("Snack-text").style.color = '#FFFFFF';
                document.getElementById("Break-icon").style.backgroundImage = null;
                document.getElementById("Dinner-icon").style.backgroundImage = null;
                document.getElementById("Lunch-icon").style.backgroundImage = null;
                document.getElementById("Snack-icon").style.backgroundImage = 'linear-gradient(45deg, #EF9027 0%, #F23B3B 100%)';
                document.getElementById("fat_value").innerHTML = '30g';
                document.getElementById("fibre_value").innerHTML = '40g';
                document.getElementById("carbs_value").innerHTML = '150g';
                document.getElementById("calcium_value").innerHTML = '220g';
                document.getElementById("protein_value").innerHTML = '50g';
                document.getElementById("vitamins_value").innerHTML = '60g';
                pieChartObj.series[0].dataSource = (<{ Snack: Object[] }>Sunday[0]).Snack;
            }
        }
    });
    linechartObj.appendTo('#balance');
    linechartObj.refresh();
}
// tslint:disable-next-line:max-func-body-length
function InitializeStepsComponent(): void {
    let annotationpie1data = (<{ Exercise: Object[] }>Sunday[0]).Exercise;
    let annotationpie2data = (<{ Hours: Object[] }>Sunday[0]).Hours;
    let pointMove: EmitType<IPointEventArgs> = (args: IPointEventArgs) => {
        let point = getElement(linechartObj.element.id + '_Series_' + args.seriesIndex + '_Point_' + args.pointIndex );
        if (point) {
            point.setAttribute('cursor', 'pointer');
        }
    }
    let mouseclick: EmitType<IMouseEventArgs> = (args: IMouseEventArgs) => {
        let index: Index = indexFinder(args.target);
        if (getElement(linechartObj.element.id + '_Series_' + index.series + '_Point_' + index.point)) {
            switch (index.point) {
                case 0:
                    pieChartObj.series[0].dataSource = (<{ Steps: Object[] }>Sunday[0]).Steps;
                    document.querySelector('#multiple-donut #pie-title').innerHTML = 'Sunday Activity';
                    document.getElementById("stepstext").innerHTML = '8200';
                    document.getElementById("exercise").innerHTML = '15';
                    document.getElementById("active").innerHTML = '7';
                    pieChartObj.annotations[0].content = '<div id="steps-innercontent"><p id="main-value" style="font-family: Roboto; font-weight:500 ;font-size: 28px;color: #313331;letter-spacing: 0;text-align: center; margin:0px">2200</p><p id="step-value" style="font-family: Roboto;font-weight:500;font-size: 14px; color: #535353; letter-spacing: 0;text-align: center;">Calories burnt<p></div>'
                    annotationpie1data = (<{ Exercise: Object[] }>Sunday[0]).Exercise;
                    annotationpie2data = (<{ Hours: Object[] }>Sunday[0]).Hours;
                    break;
                case 1:
                    pieChartObj.series[0].dataSource = (<{ Steps: Object[] }>Monday[0]).Steps;
                    document.querySelector('#multiple-donut #pie-title').innerHTML = 'Monday Activity';
                    document.getElementById("stepstext").innerHTML = '7300';
                    document.getElementById("exercise").innerHTML = '16';
                    document.getElementById("active").innerHTML = '6';
                    pieChartObj.annotations[0].content = '<div id="steps-innercontent"><p id="main-value" style="font-family: Roboto;font-weight:500; font-size: 28px;color: #313331;letter-spacing: 0;text-align: center; margin:0px">1500</p><p id="step-value" style="font-family: Roboto; font-weight:500; font-size: 14px; color: #535353; letter-spacing: 0;text-align: center;">Calories burnt<p></div>'
                    annotationpie1data = (<{ Exercise: Object[] }>Monday[0]).Exercise;
                    annotationpie2data = (<{ Hours: Object[] }>Monday[0]).Hours;
                    break;
                case 2:
                    pieChartObj.series[0].dataSource = (<{ Steps: Object[] }>Tuesday[0]).Steps;
                    document.querySelector('#multiple-donut #pie-title').innerHTML = 'Tuesday Activity';
                    document.getElementById("stepstext").innerHTML = '7800';
                    document.getElementById("exercise").innerHTML = '20';
                    document.getElementById("active").innerHTML = '5';
                    pieChartObj.annotations[0].content = '<div id="steps-innercontent"><p id="main-value" style="font-family: Roboto; font-weight:500; font-size: 28px;color: #313331;letter-spacing: 0;text-align: center; margin:0px">3300</p><p id="step-value" style="font-family: Roboto; font-weight:500; font-size: 14px; color: #535353; letter-spacing: 0;text-align: center;">Calories burnt<p></div>'
                    annotationpie1data = (<{ Exercise: Object[] }>Tuesday[0]).Exercise;
                    annotationpie2data = (<{ Hours: Object[] }>Tuesday[0]).Hours;
                    break;
                case 3:
                    pieChartObj.series[0].dataSource = (<{ Steps: Object[] }>Wednesday[0]).Steps;
                    document.querySelector('#multiple-donut #pie-title').innerHTML = 'Wednesday Activity';
                    document.getElementById("stepstext").innerHTML = '6800';
                    document.getElementById("exercise").innerHTML = '16';
                    document.getElementById("active").innerHTML = '3';
                    pieChartObj.annotations[0].content = '<div id="steps-innercontent"><p id="main-value" style="font-family: Roboto; font-weight:500; font-size: 28px;color: #313331;letter-spacing: 0;text-align: center; margin:0px">1200</p><p id="step-value" style="font-family: Roboto; font-weight:500; font-size: 14px; color: #535353; letter-spacing: 0;text-align: center;">Calories burnt<p></div>'
                    annotationpie1data = (<{ Exercise: Object[] }>Wednesday[0]).Exercise;
                    annotationpie2data = (<{ Hours: Object[] }>Wednesday[0]).Hours;
                    break;
                case 4:
                    pieChartObj.series[0].dataSource = (<{ Steps: Object[] }>Thursday[0]).Steps;
                    document.querySelector('#multiple-donut #pie-title').innerHTML = 'Thursday Activity';
                    document.getElementById("stepstext").innerHTML = '7000';
                    document.getElementById("exercise").innerHTML = '10';
                    document.getElementById("active").innerHTML = '7';
                    pieChartObj.annotations[0].content = '<div id="steps-innercontent"><p id="main-value" style="font-family: Roboto; font-weight:500; font-size: 28px;color: #313331;letter-spacing: 0;text-align: center; margin:0px">1300</p><p id="step-value" style="font-family: Roboto; font-weight:500; font-size: 14px; color: #535353; letter-spacing: 0;text-align: center;">Calories burnt<p></div>'
                    annotationpie1data = (<{ Exercise: Object[] }>Thursday[0]).Exercise;
                    annotationpie2data = (<{ Hours: Object[] }>Thursday[0]).Hours;
                    break;
                case 5:
                    pieChartObj.series[0].dataSource = (<{ Steps: Object[] }>Friday[0]).Steps;
                    document.querySelector('#multiple-donut #pie-title').innerHTML = 'Friday Activity';
                    document.getElementById("stepstext").innerHTML = '6900';
                    document.getElementById("exercise").innerHTML = '22';
                    document.getElementById("active").innerHTML = '4';
                    pieChartObj.annotations[0].content = '<div id="steps-innercontent"><p id="main-value" style="font-family: Roboto; font-weight:500; font-size: 28px;color: #313331;letter-spacing: 0;text-align: center; margin:0px">1800</p><p id="step-value" style="font-family: Roboto; font-weight:500;font-size: 14px; color: #535353; letter-spacing: 0;text-align: center;">Calories burnt<p></div>'
                    annotationpie1data = (<{ Exercise: Object[] }>Friday[0]).Exercise;
                    annotationpie2data = (<{ Hours: Object[] }>Friday[0]).Hours;
                    break;
                case 6:
                    pieChartObj.series[0].dataSource = (<{ Steps: Object[] }>Saturday[0]).Steps;
                    document.querySelector('#multiple-donut #pie-title').innerHTML = 'Saturday Activity';
                    document.getElementById("stepstext").innerHTML = '7200';
                    document.getElementById("exercise").innerHTML = '17';
                    document.getElementById("active").innerHTML = '4';
                    pieChartObj.annotations[0].content = '<div id="steps-innercontent"><p id="main-value" style="font-family: Roboto; font-weight:500; font-size: 28px;color: #313331;letter-spacing: 0;text-align: center; margin:0px">1300</p><p id="step-value" style="font-family: Roboto;font-weight:500; font-size: 14px; color: #535353; letter-spacing: 0;text-align: center;">Calories burnt<p></div>'
                    annotationpie1data = (<{ Exercise: Object[] }>Saturday[0]).Exercise;
                    annotationpie2data = (<{ Hours: Object[] }>Saturday[0]).Hours;
                    break;
            }
            pieChartObj.appendTo('#steps-donut');
            pieChartObj.refresh();
        }
    }
    pieChartObj = new AccumulationChart({
        series: [
            {
                dataSource: [{ x: 'Steps', y: 18, text: '18%' }, { x: 'Legal', y: 8, text: '8%' }],
                radius: '95%', xName: 'x', palettes: ['#078411', 'LightGrey'],
                yName: 'y', startAngle: 180,
                endAngle: 180, innerRadius: '85%', name: 'Project',
                explode: false, explodeOffset: '10%',
            }
        ],
        annotations: [{
            content: '<div id="steps-innercontent"><p id="main-value" style="font-family: Roboto; font-weight:500; font-size: 28px;color: #313331;letter-spacing: 0;text-align: center; margin:0px">1800</p><p id="step-value" style="font-family: Roboto; font-weight:500; font-size: 14px; color: #535353; letter-spacing: 0; line-height: 0px;text-align: center;">Calories burnt</p></div>', region: 'Chart', x: '50%', y: '50%'
        }, {
            content: '<div id="pie-container" style="width:330px; height:330px;">'
            , region: 'Chart', x: '50%', y: '50%'
        }, {
            content: '<div id="inside-container" style="width:280px; height:280px;">'
            , region: 'Chart', x: '50%', y: '50%'
        }, {
            content: '<span class="icon-steps" style="color: #078411; font-size:12px;"></span>'
            , region: 'Chart', x: '53%', y: '92%'
        }, {
            content: '<span class="icon-workout" style="color: #4F7305; font-size:12px;"></span>'
            , region: 'Chart', x: '53%', y: '82%'
        }, {
            content: '<span class="icon-active" style="color: #A1A621; font-size:12px;"></span>'
            , region: 'Chart', x: '53%', y: '72%'
        }],
        enableSmartLabels: true,
        legendSettings: {
            visible: false, position: 'Top'
        },
        // Initialize the tooltip
        tooltip: { enable: false },
        load: (args: IAccLoadedEventArgs) => {
            let selectedTheme: string = location.hash.split('/')[1];
            selectedTheme = selectedTheme ? selectedTheme : 'Material';
            args.accumulation.theme = <AccumulationTheme>(selectedTheme.charAt(0).toUpperCase() +
                selectedTheme.slice(1)).replace(/-dark/i, 'Dark');
        },
        loaded: (args: IAccLoadedEventArgs) => {
            annotationpie1 = new AccumulationChart({
                // Initialize the chart series
                series: [
                    {
                        dataSource: annotationpie1data,
                        palettes: ['#4F7305', 'LightGrey'],
                        radius: '75%', xName: 'x',
                        yName: 'y', startAngle: 180,
                        endAngle: 180, innerRadius: '80%', name: 'Project',
                        explode: false, explodeOffset: '10%',
                    }
                ],
                enableSmartLabels: true,
                legendSettings: {
                    visible: false, position: 'Top'
                },
                // Initialize the tooltip
                tooltip: { enable: false },
                loaded: (args: IAccLoadedEventArgs) => {
                    if (document.getElementById("pie-container_border"))
                        document.getElementById("pie-container_border").style.fill = 'transparent';
                }
            });
            annotationpie1.appendTo('#pie-container');
            annotationpie2 = new AccumulationChart({
                // Initialize the chart series
                series: [
                    {
                        dataSource: annotationpie2data,
                        palettes: ['#A1A621', 'LightGrey'],
                        radius: '65%', xName: 'x',
                        yName: 'y', startAngle: 180,
                        endAngle: 180, innerRadius: '75%',
                        explode: false,
                    }
                ],
                enableSmartLabels: true,
                resized: (args: IAccResizeEventArgs) => {
                    if (annotation) {
                        location.reload();
                    }
                },
                legendSettings: {
                    visible: false, position: 'Top'
                },
                // Initialize the tooltip
                tooltip: { enable: false },
                loaded: (args: IAccLoadedEventArgs) => {
                    if (document.getElementById("inside-container_border"))
                        document.getElementById("inside-container_border").style.fill = 'transparent';
                }
            });
            annotationpie2.appendTo('#inside-container');
        }
    });
    pieChartObj.appendTo('#steps-donut');
    pieChartObj.refresh();


    /* tslint:eanble */
    linechartObj = new Chart({
        //Initializing Primary X Axis
        primaryXAxis: {
            valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, majorTickLines: { width: 0 },
        },

        chartArea: { border: { width: 0 } },
        primaryYAxis:
        {
            majorTickLines: { width: 0 }, lineStyle: { width: 0 },
            stripLines: [{ start: 9000, sizeType: 'Pixel', size: 1, dashArray: '5,5', color: '#BB830D', text: 'Goal 9000 Steps', textStyle: { color: '#BB830D', size: '12px', fontFamily: 'Roboto', fontWeight: '500' }, horizontalAlignment: 'End', verticalAlignment: 'End' }]
        },
        //Initializing Chart Series
        series: [
            {
                type: 'Column', xName: 'x', columnWidth: 0.3, yName: 'y', cornerRadius: {
                    topLeft: 10, topRight: 10
                },
                dataSource: [{ x: 'Sunday', y: 8900 }, { x: 'Monday', y: 7200 }, { x: 'Tuesday', y: 9300 }, { x: 'Wednesday', y: 6200 }, { x: 'Thursday', y: 7000 }, { x: 'Friday', y: 8000 }, { x: 'Saturday', y: 5500 }],
                marker: {
                    visible: false,
                }, fill: 'url(#gradient-chart)',
            }
        ],
        background: 'transparent',
        chartMouseClick: mouseclick,
        pointMove: pointMove,
        tooltip: {
            enable: true,
            format: 'Click to View Details'
        },
        annotations: [{
            content: '<div id="thumbs_up"><img src="../../icons/Shape.png"  style="width: 30px; height: 30px"/></div>',
            x: 'Tuesday', y: 9800, coordinateUnits: 'Point', verticalAlignment: 'Top'
        }],
    });
    linechartObj.appendTo('#balance');
    linechartObj.refresh();
}
// tslint:disable-next-line:max-func-body-length
function InitializeSleepComponent(): void {
    interface Result {
        result: Object;
    }
    let pointMove: EmitType<IPointEventArgs> = (args: IPointEventArgs) => {
        let point = getElement(linechartObj.element.id + '_Series_' + args.seriesIndex + '_Point_' + args.pointIndex );
        if (point) {
            point.setAttribute('cursor', 'pointer');
        }
    }
    let mouseclick: EmitType<IMouseEventArgs> = (args: IMouseEventArgs) => {
        let index: Index = indexFinder(args.target);
        if (getElement(linechartObj.element.id + '_Series_' + index.series + '_Point_' + index.point)) {
            switch (index.point) {
                case 0:
                    pieChartObj.series[0].dataSource = (<{ sleep: Object[] }>Sunday[0]).sleep;
                    pieChartObj.loaded = (args: IAccLoadedEventArgs) => {
                        document.getElementById("leftcontent").innerHTML = '10:30 pm';
                        document.getElementById("rightcontent").innerHTML = '7:30 am';
                        document.getElementById("time").innerHTML = '9';
                        document.getElementById("deephour").innerHTML = '5h 24 mins';
                        document.getElementById("lighthour").innerHTML = '2h 15 mins ';
                        document.getElementById("awakehour").innerHTML = '27 mins';
                        document.getElementById("remhour").innerHTML = '54 mins ';
                    }
                    break;
                case 1:
                    pieChartObj.series[0].dataSource = (<{ sleep: Object[] }>Monday[0]).sleep;
                    pieChartObj.loaded = (args: IAccLoadedEventArgs) => {
                        document.getElementById("leftcontent").innerHTML = '11:40 pm';
                        document.getElementById("rightcontent").innerHTML = '5:40 am';
                        document.getElementById("time").innerHTML = '6';
                        document.getElementById("deephour").innerHTML = '3h 54 mins ';
                        document.getElementById("lighthour").innerHTML = '1h 22 mins ';
                        document.getElementById("awakehour").innerHTML = '18 mins';
                        document.getElementById("remhour").innerHTML = '36 mins ';
                    }
                    break;
                case 2:
                    pieChartObj.series[0].dataSource = (<{ sleep: Object[] }>Tuesday[0]).sleep;
                    pieChartObj.loaded = (args: IAccLoadedEventArgs) => {
                        document.getElementById("leftcontent").innerHTML = '9:30 pm';
                        document.getElementById("rightcontent").innerHTML = '4:30 am';
                        document.getElementById("time").innerHTML = '6';
                        document.getElementById("deephour").innerHTML = '3h 54 mins';
                        document.getElementById("lighthour").innerHTML = '1h 30 mins';
                        document.getElementById("awakehour").innerHTML = '18 mins';
                        document.getElementById("remhour").innerHTML = '18 mins';
                    }
                    break;
                case 3:
                    pieChartObj.series[0].dataSource = (<{ sleep: Object[] }>Wednesday[0]).sleep;
                    pieChartObj.loaded = (args: IAccLoadedEventArgs) => {
                        document.getElementById("leftcontent").innerHTML = '10:30 pm';
                        document.getElementById("rightcontent").innerHTML = '6:30 am';
                        document.getElementById("time").innerHTML = '7';
                        document.getElementById("deephour").innerHTML = '3h 51 mins';
                        document.getElementById("lighthour").innerHTML = '2h 06 mins';
                        document.getElementById("awakehour").innerHTML = '21 mins';
                        document.getElementById("remhour").innerHTML = '42 mins';
                    }
                    break;
                case 4:
                    pieChartObj.series[0].dataSource = (<{ sleep: Object[] }>Thursday[0]).sleep;
                    pieChartObj.loaded = (args: IAccLoadedEventArgs) => {
                        document.getElementById("leftcontent").innerHTML = '11:00 pm';
                        document.getElementById("rightcontent").innerHTML = '7:00 am';
                        document.getElementById("time").innerHTML = '8';
                        document.getElementById("deephour").innerHTML = '4h 48 mins ';
                        document.getElementById("lighthour").innerHTML = '2h 24 mins ';
                        document.getElementById("awakehour").innerHTML = '24 mins';
                        document.getElementById("remhour").innerHTML = '24 mins ';
                    }
                    break;
                case 5:
                    pieChartObj.series[0].dataSource = (<{ sleep: Object[] }>Friday[0]).sleep;
                    pieChartObj.loaded = (args: IAccLoadedEventArgs) => {
                        document.getElementById("leftcontent").innerHTML = '11:40 pm';
                        document.getElementById("rightcontent").innerHTML = '4:40 am';
                        document.getElementById("time").innerHTML = '5';
                        document.getElementById("deephour").innerHTML = '3h 45 mins ';
                        document.getElementById("lighthour").innerHTML = '45 mins ';
                        document.getElementById("awakehour").innerHTML = '15 mins';
                        document.getElementById("remhour").innerHTML = '15 mins ';
                    }
                    break;
                case 6:
                    pieChartObj.series[0].dataSource = (<{ sleep: Object[] }>Saturday[0]).sleep;
                    pieChartObj.loaded = (args: IAccLoadedEventArgs) => {
                        document.getElementById("leftcontent").innerHTML = '9:40 pm';
                        document.getElementById("rightcontent").innerHTML = '6:40 am';
                        document.getElementById("time").innerHTML = '9';
                        document.getElementById("deephour").innerHTML = '6h 18 mins';
                        document.getElementById("lighthour").innerHTML = '1h 48 mins ';
                        document.getElementById("awakehour").innerHTML = '27 mins';
                        document.getElementById("remhour").innerHTML = '27 mins ';
                    }
                    break;
            }
            pieChartObj.appendTo('#sleep-pie');
            pieChartObj.refresh();
        }
    }
    pieChartObj = new AccumulationChart({
        series: [
            {
                tooltipMappingName: 'time',
                dataSource: [
                    { x: "Light sleep", y: 10, time: '10:30 pm - 11:24 pm' }, { x: "Deep sleep", y: 20, time: '11:24 am - 1:12 am' },
                    { x: "Awake", y: 2.5, time: '1:12 am - 1:25 am' }, { x: "REM", y: 5, time: '1:25 am - 1:52 am' },
                    { x: "Deep sleep", y: 22, time: '1:52 am - 3:45 am' }, { x: "Awake", y: 2.5, time: '3:45 am - 3.58 am' },
                    { x: "Light sleep", y: 15, time: '3:58 am - 5.20 am' }, { x: "REM", y: 5, time: '5:20 am - 5:47 am' },
                    { x: "Deep sleep", y: 18, time: '5:47 am - 7:30 am' }
                ],
                palettes: ['#6137E3', '#392178', '#9572FF', '#4F2BAF', '#392178', '#9572FF', '#6137E3', '#4F2BAF', '#392178'],
                xName: 'x', name: 'Agricultural',
                yName: 'y',
                startAngle: 270,
                endAngle: 90,
                radius: '140%', explode: false,
                innerRadius: '60%',
            }
        ], annotations: [{
            content: '<div id="leftcontent" style="width:100%; height:100%;">' + '10:30 pm'
            , region: 'Series', x: '10%', y: '115%'
        }, {
            content: '<div id="rightcontent" style="width:100%; height:100%;">' + '07:30 am'
            , region: 'Series', x: '90%', y: '115%'
        },
        {
            content: '<div id="middlecontent" style="font-family: Roboto; font-weight:500; font-size: 14px; color: #4A4A4A; letter-spacing: -0.08px; text-align: center;">Total hours of sleep <br><p id="time">9</p><br></div>'
            , region: 'Series', x: '52%', y: '95%'
        }],
        //Initializing Tooltip
        tooltip: {
            enable: true, header: '${point.x}', format: '${point.tooltip}',
        },
        legendSettings: {
            visible: false,
        },
        load: (args: IAccLoadedEventArgs) => {
            let selectedTheme: string = location.hash.split('/')[1];
            selectedTheme = selectedTheme ? selectedTheme : 'Material';
            args.accumulation.theme = <AccumulationTheme>(selectedTheme.charAt(0).toUpperCase() +
                selectedTheme.slice(1)).replace(/-dark/i, 'Dark');
        },

    });
    pieChartObj.appendTo('#sleep-pie');
    pieChartObj.refresh();
    /* tslint:eanble */
    linechartObj = new Chart({
        //Initializing Primary X Axis
        primaryXAxis: {
            valueType: 'Category',
            labelFormat: 'y',
            majorGridLines: { width: 0 },
            majorTickLines: { width: 0 },
            minorTickLines: { width: 0 }
        },

        //Initializing Primary Y Axis
        primaryYAxis:
        {
            labelFormat: '{value} hrs',
            rangePadding: 'None',
            minimum: 2,
            maximum: 10,
            interval: 1,
            lineStyle: { width: 0 },
            majorTickLines: { width: 0 },
            minorTickLines: { width: 0 },
        },
        chartArea: {
            border: {
                width: 0
            }
        },
        //Initializing Chart Series
        series: [
            {
                type: 'Bubble',
                dataSource: [
                    { x: 'Sunday', y: 9, size: 4.837 }, { x: 'Monday', y: 6, size: 2.347 }, { x: 'Tuesday', y: 6, size: 2.347 }, { x: 'Wednesday', y: 7, size: 3.527 },
                    { x: 'Thursday', y: 8, size: 4.047 }, { x: 'Friday', y: 5, size: 1.582 }, { x: 'Saturday', y: 9, size: 4.837 }
                ],
                xName: 'x',
                border: { width: 2 }, marker: {
                    visible: false,
                    border: { color: '#F38181' },
                    width: 10,
                    height: 10
                },
                yName: 'y', size: 'size', fill: '#4526A6', animation: { enable: false }
            }
        ],
        pointMove: pointMove,
        background: 'transparent',
        chartMouseClick: mouseclick,
        tooltip: {
            enable: true,
            format: '${point.y}',
            enableMarker: false
        },
    });
    linechartObj.appendTo('#balance');
    linechartObj.refresh();
}
// tslint:disable-next-line:max-func-body-length
function InitializeWaterComponent(): void {
    let pointindex: number = 5;
    let pointMove: EmitType<IPointEventArgs> = (args: IPointEventArgs) => {
        let point = getElement(linechartObj.element.id + '_Series_' + args.seriesIndex + '_Point_' + args.pointIndex + '_Symbol');
        if (point) {
            point.setAttribute('cursor', 'pointer');
        }
    }
    let piepointMove: EmitType<IPointEventArgs> = (args: IPointEventArgs) => {
        let point = getElement(pieChartObj.element.id + '_Series_' + args.seriesIndex + '_Point_' + args.pointIndex );
        if (point) {
            point.setAttribute('cursor', 'pointer');
        }
    }
    let pointclick: EmitType<IPointEventArgs> = (args: IPointEventArgs) => {
        selectedpoint = true;
        pointindex = args.pointIndex;
        if (getElement(polarChartObj.element.id + '_Series_' + args.seriesIndex + '_Point_' + args.pointIndex)) {
            document.getElementById("water50ml-column").style.backgroundImage = 'linear-gradient(to right, #2140DC, #00BFD5)';
            document.getElementById("water100ml-column").style.backgroundImage = null;
            document.getElementById("water200ml-column").style.backgroundImage = null;
            document.getElementById("water300ml-column").style.backgroundImage = null;
            document.getElementById("water50ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water50ml-columnactive";
            document.getElementById("water100ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water100ml-column";
            document.getElementById("water200ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water200ml-column";
            document.getElementById("water300ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water300ml-column";
            document.getElementById("iconml-img").style.color = '#FFFFFF';
            document.getElementById("iconml1-img").style.color = '#5B5B5B';
            document.getElementById("iconml2-img").style.color = '#5B5B5B';
            document.getElementById("iconml3-img").style.color = '#5B5B5B';
            document.getElementById("imgtext1").style.color = '#FFFFFF';
            document.getElementById("imgtext2").style.color = '#5B5B5B';
            document.getElementById("imgtext3").style.color = '#5B5B5B';
            document.getElementById("imgtext4").style.color = '#5B5B5B';
            polarChartObj.series[0].animation.enable = false;
        }
    }
    let mouseclick: EmitType<IPointEventArgs> = (args: IPointEventArgs) => {
        selectedpoint = false;
        if (!getElement(linechartObj.element.id + '_Series_' + args.seriesIndex + '_Point_' + args.pointIndex)) {
            switch (args.pointIndex) {
                case 0:
                    polarChartObj.series[0].dataSource = (<{ water: Object[] }>Sunday[0]).water;
                    document.querySelector('#polar #pie-title').innerHTML = 'Sunday Activity';
                    break;
                case 1:
                    polarChartObj.series[0].dataSource = (<{ water: Object[] }>Monday[0]).water;
                    document.querySelector('#polar #pie-title').innerHTML = 'Monday Activity';
                    break;
                case 2:
                    polarChartObj.series[0].dataSource = (<{ water: Object[] }>Tuesday[0]).water;
                    document.querySelector('#polar #pie-title').innerHTML = 'Tuesday Activity';
                    break;
                case 3:
                    polarChartObj.series[0].dataSource = (<{ water: Object[] }>Wednesday[0]).water;
                    document.querySelector('#polar #pie-title').innerHTML = 'Wednesday Activity';
                    break;
                case 4:
                    polarChartObj.series[0].dataSource = (<{ water: Object[] }>Thursday[0]).water;
                    document.querySelector('#polar #pie-title').innerHTML = 'Thursday Activity';
                    break;
                case 5:
                    polarChartObj.series[0].dataSource = (<{ water: Object[] }>Friday[0]).water;
                    document.querySelector('#polar #pie-title').innerHTML = 'Friday Activity';
                    break;
                case 6:
                    polarChartObj.series[0].dataSource = (<{ water: Object[] }>Saturday[0]).water;
                    document.querySelector('#polar #pie-title').innerHTML = 'Saturday Activity';
                    break;
            }
            polarChartObj.series[0].animation.enable = true;
            polarChartObj.appendTo('#water-polar');
            polarChartObj.refresh();
        }
    }
    let polarChartObj: Chart = new Chart({
        //Initializing Primary X Axis
        primaryXAxis: {
            valueType: 'Category',
            labelPlacement: 'OnTicks', interval: 1,
        },

        //Initializing Primary Y Axis
        primaryYAxis: {
            labelFormat: '{value}L',
        },

        //Initializing Chart Series
        series: [
            {
                type: 'Polar', drawType: 'Column', dataSource: [{ text: '00:00 - 3:00', x: '00:00', y: 0 },
                { text: '03:00 - 6:00', x: '3:00', y: 0 },
                { text: '06:00 - 9:00', x: '6:00', y: 0 },
                { text: '09:00 - 12:00', x: '9:00', y: 1 },
                { text: '12:00 - 15:00', x: '12:00', y: 1.5 },
                { text: '15:00 - 18:00', x: '15:00', y: 2},
                { text: '18:00 - 21:00', x: '18:00', y: 1.5 },
                { text: '21:00 - 24:00', x: '21:00', y: 0.75 }],
                animation: { enable: true }, border: { width: 1, color: 'white' },
                xName: 'x', yName: 'y',
                marker: { dataLabel: { name: 'text' } }, fill: 'url(#gradient-polarchart)',
            },
        ],
        selectedDataIndexes: [
            { series: 0, point: 5},
        ],
        background: 'transparent',
        pointClick: pointclick,
        pointMove: piepointMove,
        legendSettings: { visible: false, toggleVisibility: false },
        selectionMode: 'Point',
        enableAnimation: false,
        //Initializing User Interaction Tooltip
        tooltip: {
            enable: true,
            enableMarker: false,
            format: 'Click to Add Water',
        },
        load: (args: ILoadedEventArgs) => {
            let selectedTheme: string = location.hash.split('/')[1];
            selectedTheme = selectedTheme ? selectedTheme : 'Material';
            args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() +
                selectedTheme.slice(1)).replace(/-dark/i, 'Dark');
        },
        loaded: (args: ILoadedEventArgs) => {
        }
    });
    polarChartObj.appendTo('#water-polar');
    document.getElementById("water50ml-column").onclick = function () {
            document.getElementById("water50ml-column").style.backgroundImage = 'linear-gradient(to right, #2140DC, #00BFD5)';
            document.getElementById("water100ml-column").style.backgroundImage = null;
            document.getElementById("water200ml-column").style.backgroundImage = null;
            document.getElementById("water300ml-column").style.backgroundImage = null;
            document.getElementById("water50ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water50ml-columnactive";
            document.getElementById("water100ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water100ml-column";
            document.getElementById("water200ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water200ml-column";
            document.getElementById("water300ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water300ml-column";
            document.getElementById("iconml-img").style.color = '#FFFFFF';
            document.getElementById("iconml1-img").style.color = '#5B5B5B';
            document.getElementById("iconml2-img").style.color = '#5B5B5B';
            document.getElementById("iconml3-img").style.color = '#5B5B5B';
            document.getElementById("imgtext1").style.color = '#FFFFFF';
            document.getElementById("imgtext2").style.color = '#5B5B5B';
            document.getElementById("imgtext3").style.color = '#5B5B5B';
            document.getElementById("imgtext4").style.color = '#5B5B5B';
            polarChartObj.series[0].dataSource[pointindex].y = polarChartObj.series[0].dataSource[pointindex].y + 0.05;
            polarChartObj.series[0].animation.enable = false;
            polarChartObj.animateSeries = false;
            polarChartObj.enableAnimation = false;
            polarChartObj.appendTo('#water-polar');
    }
    document.getElementById("water100ml-column").onclick = function () {
            document.getElementById("water100ml-column").style.backgroundImage = 'linear-gradient(to right, #2140DC, #00BFD5)';
            document.getElementById("water50ml-column").style.backgroundImage = null;
            document.getElementById("water200ml-column").style.backgroundImage = null;
            document.getElementById("water300ml-column").style.backgroundImage = null;
            document.getElementById("water50ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water50ml-column";
            document.getElementById("water100ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water100ml-columnactive";
            document.getElementById("water200ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water200ml-column";
            document.getElementById("water300ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water300ml-column";
            document.getElementById("iconml-img").style.color = '#5B5B5B';
            document.getElementById("iconml1-img").style.color = '#FFFFFF';
            document.getElementById("iconml2-img").style.color = '#5B5B5B';
            document.getElementById("iconml3-img").style.color = '#5B5B5B';
            document.getElementById("imgtext2").style.color = '#FFFFFF';
            document.getElementById("imgtext1").style.color = '#5B5B5B';
            document.getElementById("imgtext3").style.color = '#5B5B5B';
            document.getElementById("imgtext4").style.color = '#5B5B5B';
            polarChartObj.series[0].animation.enable = false;
            polarChartObj.series[0].dataSource[pointindex].y = polarChartObj.series[0].dataSource[pointindex].y + 0.1;
            polarChartObj.enableAnimation = false;
            polarChartObj.appendTo('#water-polar');
    }
    document.getElementById("water200ml-column").onclick = function () {
            document.getElementById("water200ml-column").style.backgroundImage = 'linear-gradient(to right, #2140DC, #00BFD5)';
            document.getElementById("water100ml-column").style.backgroundImage = null;
            document.getElementById("water50ml-column").style.backgroundImage = null;
            document.getElementById("water300ml-column").style.backgroundImage = null;
            document.getElementById("water50ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water50ml-column";
            document.getElementById("water100ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water100ml-column";
            document.getElementById("water200ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water200ml-columnactive";
            document.getElementById("water300ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water300ml-column";
            document.getElementById("iconml-img").style.color = '#5B5B5B';
            document.getElementById("iconml1-img").style.color = '#5B5B5B';
            document.getElementById("iconml2-img").style.color = '#FFFFFF';
            document.getElementById("iconml3-img").style.color = '#5B5B5B';
            document.getElementById("imgtext3").style.color = '#FFFFFF';
            document.getElementById("imgtext2").style.color = '#5B5B5B';
            document.getElementById("imgtext1").style.color = '#5B5B5B';
            document.getElementById("imgtext4").style.color = '#5B5B5B';
            polarChartObj.series[0].animation.enable = false;
            polarChartObj.series[0].dataSource[pointindex].y = polarChartObj.series[0].dataSource[pointindex].y + 0.2;
            polarChartObj.appendTo('#water-polar');
    }
    document.getElementById("water300ml-column").onclick = function () {
            document.getElementById("water300ml-column").style.backgroundImage = 'linear-gradient(to right, #2140DC, #00BFD5)';
            document.getElementById("water100ml-column").style.backgroundImage = null;
            document.getElementById("water200ml-column").style.backgroundImage = null;
            document.getElementById("water50ml-column").style.backgroundImage = null;
            document.getElementById("water50ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water50ml-column";
            document.getElementById("water100ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water100ml-column";
            document.getElementById("water200ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water200ml-column";
            document.getElementById("water300ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water300ml-columnactive";
            document.getElementById("iconml-img").style.color = '#5B5B5B';
            document.getElementById("iconml1-img").style.color = '#5B5B5B';
            document.getElementById("iconml2-img").style.color = '#5B5B5B';
            document.getElementById("iconml3-img").style.color = '#FFFFFF';
            document.getElementById("imgtext4").style.color = '#FFFFFF';
            document.getElementById("imgtext2").style.color = '#5B5B5B';
            document.getElementById("imgtext3").style.color = '#5B5B5B';
            document.getElementById("imgtext1").style.color = '#5B5B5B';
            polarChartObj.series[0].animation.enable = false;
            polarChartObj.series[0].dataSource[pointindex].y = polarChartObj.series[0].dataSource[pointindex].y + 0.5;
            polarChartObj.appendTo('#water-polar');
    }
    polarChartObj.refresh();

    /* tslint:eanble */
    linechartObj = new Chart({
        //Initializing Primary X Axis
        primaryXAxis: {
            valueType: 'Category',
            labelFormat: 'y',
            edgeLabelPlacement: 'Shift',
            labelPlacement: 'OnTicks',
            majorGridLines: { width: 0 },
            majorTickLines: { width: 0 },
            minorTickLines: { width: 0 }
        },

        //Initializing Primary Y Axis
        primaryYAxis:
        {
            labelFormat: '{value} ltr',
            rangePadding: 'None',
            minimum: 2,
            maximum: 10,
            interval: 1,
            lineStyle: { width: 0 },
            majorTickLines: { width: 0 },
            minorTickLines: { width: 0 },
            stripLines: [{ start: 7, sizeType: 'Pixel', size: 1, color: '#3B61E9', dashArray: '5,5', text: 'Target', textStyle: { color: '#3B61E9' }, horizontalAlignment: 'End', verticalAlignment: 'End' }]
        },
        chartArea: {
            border: {
                width: 0
            }
        },
        background: 'transparent',
        //Initializing Chart Series
        series: [
            {
                type: 'Spline',
                dataSource: [
                    { x: 'Sunday', y: 5 }, { x: 'Monday', y: 6 }, { x: 'Tuesday', y: 4.5 }, { x: 'Wednesday', y: 5.5 }, { x: 'Thursday', y: 7.2 }, { x: 'Friday', y: 4.5 }, { x: 'Saturday', y: 6 }
                ],
                xName: 'x', fill: '#3B61E9', width: 3, border: { width: 3, color: '#3B61E9' },
                yName: 'y', marker: { visible: true, shape: "Circle", width: 8, height: 8, border: {width: 2, color: '#484848' } }
            }
        ],
        pointClick: mouseclick,
        pointMove: pointMove,
        tooltip: {
            enable: true,
            format: '${point.y}',
            enableMarker: false
        },
        annotations: [{
            content: '<div id="waterachieved"><span id="achieved-img" class="icon-achieved" style="font-size: 30px; color: #3B61E9"></span></div>',
            x: 'Thursday', y: 7.5, coordinateUnits: 'Point', verticalAlignment: 'Top'
        }],
    });
    linechartObj.appendTo('#balance');
    linechartObj.refresh();
}

function waterclick(): void {
    annotation = false;
    selectedpoint = false;
    ToggleVisibility('block', 'none');
    document.getElementById("water50ml-column").style.backgroundImage = 'linear-gradient(to right, #2140DC, #00BFD5)';
    document.getElementById("water100ml-column").style.backgroundImage = null;
    document.getElementById("water200ml-column").style.backgroundImage = null;
    document.getElementById("water300ml-column").style.backgroundImage = null;
    document.getElementById("water50ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water50ml-columnactive";
    document.getElementById("water100ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water100ml-column";
    document.getElementById("water200ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water200ml-column";
    document.getElementById("water300ml-column").className = "col-xs-3 col-sm-3 col-md-3 col-lg-3 water300ml-column";
    document.getElementById("imgtext1").style.color = '#FFFFFF';
    document.getElementById("imgtext2").style.color = '#5B5B5B';
    document.getElementById("imgtext3").style.color = '#5B5B5B';
    document.getElementById("imgtext4").style.color = '#5B5B5B';
    document.getElementById("iconml-img").style.color = '#FFFFFF';
    document.getElementById("iconml1-img").style.color = '#5B5B5B';
    document.getElementById("iconml2-img").style.color = '#5B5B5B';
    document.getElementById("iconml3-img").style.color = '#5B5B5B';
    document.getElementById('sleep-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 sleep-value card-container';
    document.getElementById('step-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 steps-value card-container';
    document.getElementById('calories-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 calories-value card-container';
    document.getElementById('water-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 water-valueactive card-container';
    document.getElementById("multiple-donut").style.display = 'none';
    document.getElementById("donut").style.display = 'none';
    document.getElementById("semi-pie").style.display = 'none';
    document.getElementById("polar").style.display = 'block';
    document.getElementById('chart-header-title').innerHTML = '<span id="chart-title"> Water Consumption </span>';
    document.getElementById('total-value').innerHTML = '<span id="title-annotation"> Target </span><span id="value-annotation" style="color: #3B61E9;"> 7 litres </span>';
    document.getElementById("average-value").innerHTML = '<span id="title-annotation"> Daily Average </span><span id="value-annotation" style="color: #3B61E9;"> 4.32 litres </span>';
    LoadChartData("water");
}

function stepclick(): void {
    annotation = true;
    ToggleVisibility('block', 'none');
    document.getElementById('sleep-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 sleep-value card-container';
    document.getElementById('step-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 steps-valueactive card-container';
    document.getElementById('calories-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 calories-value card-container';
    document.getElementById('water-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 water-value card-container';
    document.getElementById("multiple-donut").style.display = 'block';
    document.getElementById("donut").style.display = 'none';
    document.getElementById("semi-pie").style.display = 'none';
    document.getElementById("polar").style.display = 'none';
    document.getElementById('chart-header-title').innerHTML = '<span id="chart-title"> Steps Taken </span>';
	document.getElementById('total-value').innerHTML = '<span id="title-annotation"> Distance Travelled </span><span id="value-annotation" style="color:#05AD13"> 3.2 miles </span>';
	document.getElementById("average-value").innerHTML = '';
    LoadChartData("steps");
}

function sleepclick() {
    annotation = false;
    ToggleVisibility('block', 'none');
    document.getElementById('sleep-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 sleep-valueactive card-container';
    document.getElementById('step-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 steps-value card-container';
    document.getElementById('calories-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 calories-value card-container';
    document.getElementById('water-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 water-value card-container';
    document.getElementById("multiple-donut").style.display = 'none';
    document.getElementById("donut").style.display = 'none';
    document.getElementById("semi-pie").style.display = 'block';
    document.getElementById("polar").style.display = 'none';
    document.getElementById('chart-header-title').innerHTML = '<span id="chart-title"> Sleep Tracker </span>';
    document.getElementById('total-value').innerHTML = '<span id="title-annotation"> Goal </span><span id="value-annotation" style="color:#4526A6"> 7.2 hrs </span>';
    document.getElementById("average-value").innerHTML = '<span id="title-annotation"> Daily Average </span><span id="value-annotation" style="color:#4526A6"> 6.32 hrs </span>';
    LoadChartData("sleep");

}

function caloriesclick() {
    annotation = false;
    ToggleVisibility('block', 'none');
    document.getElementById('sleep-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 sleep-value card-container';
    document.getElementById('step-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 steps-value card-container';
    document.getElementById('calories-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 calories-valueactive card-container';
    document.getElementById('water-column').className = 'col-xs-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 water-value card-container';
    document.getElementById("multiple-donut").style.display = 'none';
    document.getElementById("donut").style.display = 'block';
    document.getElementById("semi-pie").style.display = 'none';
    document.getElementById("polar").style.display = 'none';
    document.getElementById('chart-header-title').innerHTML = '<span id="chart-title"> Calories Consumed </span>';
    document.getElementById('total-value').innerHTML = '<span id="title-annotation"> Total </span><span id="value-annotation" style="color:#780508">1437 Kcal</span>';
    document.getElementById("average-value").innerHTML = '<span id="title-annotation"> Daily Average </span><span id="value-annotation" style="color:#DB4247"> 902 Kcal </span>';
    LoadChartData("calorie");
}