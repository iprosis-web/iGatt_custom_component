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
						.chart_div {
							width: 100%;
							height: 100%;
						} 
						</style>

						<div id="chart_div"></div>						
        			`;

					let shadowRoot = this.attachShadow({ mode: 'open' });
					shadowRoot.appendChild(template.content.cloneNode(true));
					google.charts.load('current', { packages: ['gantt'] });
					google.charts.setOnLoadCallback(this.drawChart.bind(this));
				}

				//Fired when the widget is added to the html DOM of the page
				connectedCallback() {
					this.drawChart();
				}

				//Fired when the widget is removed from the html DOM of the page (e.g. by hide)
				disconnectedCallback() {}

				//When the custom widget is updated, the Custom Widget SDK framework executes this function first
				onCustomWidgetBeforeUpdate(oChangedProperties) {}

				//When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
				onCustomWidgetAfterUpdate(oChangedProperties) {}

				//When the custom widget is removed from the canvas or the analytic application is closed
				onCustomWidgetDestroy() {}

				onCustomWidgetResize(width, height) {
					this.drawChart.bind(this);
				}

				drawChart() {
					var data = new google.visualization.DataTable();
					data.addColumn('string', 'Task ID');
					data.addColumn('string', 'Task Name');
					data.addColumn('date', 'Start Date');
					data.addColumn('date', 'End Date');
					data.addColumn('number', 'Duration');
					data.addColumn('number', 'Percent Complete');
					data.addColumn('string', 'Dependencies');

					data.addRows([
						[
							'Research',
							'Find sources',
							new Date(2015, 0, 1),
							new Date(2015, 0, 5),
							null,
							100,
							null,
						],
						[
							'Write',
							'Write paper',
							null,
							new Date(2015, 0, 9),
							daysToMilliseconds(3),
							25,
							'Research,Outline',
						],
						[
							'Cite',
							'Create bibliography',
							null,
							new Date(2015, 0, 7),
							daysToMilliseconds(1),
							20,
							'Research',
						],
						[
							'Complete',
							'Hand in paper',
							null,
							new Date(2015, 0, 10),
							daysToMilliseconds(1),
							0,
							'Cite,Write',
						],
						[
							'Outline',
							'Outline paper',
							null,
							new Date(2015, 0, 6),
							daysToMilliseconds(1),
							100,
							'Research',
						],
					]);

					var options = {
						height: this.shadowRoot.querySelector('#chart_div').getBoundingClientRect()
							.height,
					};

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
