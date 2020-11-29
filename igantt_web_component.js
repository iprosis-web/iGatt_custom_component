(function () {
	let googleChart = document.createElement('script');
	googleChart.src = 'https://www.gstatic.com/charts/loader.js';
	googleChart.async = false;
	document.head.appendChild(googleChart);

	googleChart.onload = () => {
		window.customElements.define(
			'i-gantt',
			class IGantt extends HTMLElement {
				constructor() {
					super();
					let that = this;

					const template = document.createElement('template');
					template.innerHTML = `
						<style>
							.wrapper {
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
								width: 1500px;
								height: 800px;
								border: solid thin blueviolet;
							}

							#chart_div {
								position: relative;
								width: 100%;
								height: 100%;
							} 
						</style>
					<div class="wrapper">
							<div id="chart_div"></div>
					</div>		
						
        			`;

					let shadowRoot = this.attachShadow({ mode: 'open' });
					shadowRoot.appendChild(template.content.cloneNode(true));
					google.charts.load('current', { packages: ['gantt'] });
					google.charts.setOnLoadCallback(this.drawChart.bind(this));
				}

				drawChart() {
					var data = new google.visualization.DataTable();
					data.addColumn('string', 'Task ID');
					data.addColumn('string', 'Task Name');
					data.addColumn('string', 'Resource');
					data.addColumn('date', 'Start Date');
					data.addColumn('date', 'End Date');
					data.addColumn('number', 'Duration');
					data.addColumn('number', 'Percent Complete');
					data.addColumn('string', 'Dependencies');

					data.addRows([
						[
							'2014Spring',
							'Spring 2014 wkbwlkjhbwlkjbw wkjnbfw',
							'spring',
							new Date(2014, 2, 22),
							new Date(2014, 5, 20),
							null,
							100,
							null,
						],
						[
							'2014Summer',
							'Summer 2014',
							'summer',
							new Date(2014, 5, 23),
							new Date(2014, 10, 20),
							null,
							70,
							null,
						],
						[
							'2014SummerPl',
							'Summer 2014Pl',
							'summer',
							new Date(2014, 5, 21),
							new Date(2014, 8, 20),
							null,
							100,
							null,
						],
						[
							'2014Autumn',
							'Autumn 2014',
							'autumn',
							new Date(2014, 8, 21),
							new Date(2014, 11, 20),
							null,
							100,
							null,
						],
						[
							'2014Autumn',
							'Autumn 2014',
							'autumn',
							new Date(2014, 8, 21),
							new Date(2014, 11, 20),
							null,
							100,
							null,
						],
						[
							'2014Winter',
							'Winter 2014',
							'winter',
							new Date(2014, 11, 21),
							new Date(2015, 2, 21),
							null,
							100,
							null,
						],
						[
							'2015Spring',
							'Spring 2015',
							'spring',
							new Date(2015, 2, 22),
							new Date(2015, 5, 20),
							null,
							50,
							null,
						],
						[
							'2015Summer',
							'Summer 2015',
							'summer',
							new Date(2015, 5, 21),
							new Date(2015, 8, 20),
							null,
							0,
							null,
						],
						[
							'2015Autumn',
							'Autumn 2015',
							'autumn',
							new Date(2015, 8, 21),
							new Date(2015, 11, 20),
							null,
							0,
							null,
						],
						[
							'2015Winter',
							'Winter 2015',
							'winter',
							new Date(2015, 11, 21),
							new Date(2016, 2, 21),
							null,
							0,
							null,
						],
						[
							'Football',
							'Football Season',
							'sports',
							new Date(2014, 8, 4),
							new Date(2015, 1, 1),
							null,
							100,
							null,
						],
						[
							'Baseball',
							'Baseball Season',
							'sports',
							new Date(2015, 2, 31),
							new Date(2015, 9, 20),
							null,
							14,
							null,
						],
						[
							'Basketball',
							'Basketball Season',
							'sports',
							new Date(2014, 9, 28),
							new Date(2015, 5, 20),
							null,
							86,
							null,
						],
						[
							'Hockey',
							'Hockey Season',
							'sports',
							new Date(2014, 9, 8),
							new Date(2015, 5, 21),
							null,
							89,
							null,
						],
					]);

					var options = {
						height: this.shadowRoot.querySelector('#chart_div').getBoundingClientRect()
							.height,
					};
					debugger;
					var chart = new google.visualization.Gantt(
						this.shadowRoot.querySelector('#chart_div')
						//document.getElementById('chart_div')
					);

					chart.draw(data, options);

					function daysToMilliseconds(days) {
						return days * 24 * 60 * 60 * 1000;
					}
				}
			}
		);
	};
})();
