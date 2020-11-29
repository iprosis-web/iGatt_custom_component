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
							/* Work-around to control over tootip styling... is there better interface at google charts? */
							#chart_div g:last-child * {
								font-family: 'Arial' !important;
								font-size: 14px !important;
								font-weight: normal !important;
							}

							#chart_div g:last-child rect {
								width: 300px !important;
							}

							/* Work-around to control over x-axis dates styling... is there better interface at google charts? */
							#chart_div g:nth-child(3) text {
								font-size: 15px !important;
							}

							#chart_div {
								position: relative;
								width: 100%;
								height: 100%;
							}

							#chart_div svg {
								width: 100%;
								height: 100%;
							}
						</style>
						
						<div id="chart_div"></div>
        			`;

					'task2_planned',
						// 		new Date(2020, 0, 15),
						// 		new Date(2020, 1, 28),

						// 		new Date(2020, 0, 20),
						// 		new Date(2020, 2, 7),

						(this.stringData = [
							'task1_planned:Task 1 planned:Planned:01-01-2020:31-01-2020:100',
							'task1_actual:Task 1 actual:Actual:01-01-2020:31-01-2020:77',
							'task2_planned:Task 2 planned:Planned:15-01-2020:28-02-2020:100',
							'task2_actual:Task 2 actual:Actual:20-01-2020:07-03-2020:43',
							'task3_planned:Task 3 planned:Planned:01-01-2020:31-01-2020:100',
							'task3_actual:Task 3 actual:Actual:01-01-2020:31-01-2020:77',
							'task4_planned:Task 4 planned:Planned:01-01-2020:31-01-2020:100',
							'task4_actual:Task 4 actual:Actual:01-01-2020:31-01-2020:77',
						]);

					let shadowRoot = this.attachShadow({ mode: 'open' });
					shadowRoot.appendChild(template.content.cloneNode(true));
					google.charts.load('current', { packages: ['gantt'] });
					google.charts.setOnLoadCallback(this.drawChart.bind(this));
				}

				getStringData() {
					console.log('Data:::', this.stringData);
				}

				formatData() {
					let returnData = [];
					this.stringData.forEach((element) => {
						let id, name, type, start, finish, percent;
						let startDay, startMonth, startYear;
						let finishDay, finishMonth, finishYear;
						[id, name, type, start, finish, percent] = element.split(':'); // Destructuring
						[startDay, startMonth, startYear] = arrayStringToNumber(start.split('-'));
						[finishDay, finishMonth, finishYear] = arrayStringToNumber(
							finish.split('-')
						);

						returnData.push([
							id,
							name,
							type,
							new Date(startYear, startMonth - 1, startDay),
							new Date(finishYear, finishMonth - 1, finishDay),
							null,
							Number(percent),
							null,
						]);
					});

					function arrayStringToNumber(stringArray) {
						let resultArray = [];
						stringArray.forEach((element) => {
							let number = Number(element);
							number ? resultArray.push(number) : push(0);
						});
						return resultArray;
					}

					return returnData;
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

					//Data format required by thiscustom widget (due SAC scripting limitation - it couldd be array of strings,
					// but not array of objects. SAC script doesn't support objects... )
					//
					// [
					//    '<ID_planned>:<name> planned:Planned:DD-MM-YYYY:DD-MM-YYYY:<100>',
					//    '<ID_actual>:name> actual:Actual:DD-MM-YYYY:DD-MM-YYYY:<Precent 0-100>',
					//    .....
					//    .... other tasks
					//  ]
					//
					// Example of input:
					// =================
					// [
					//   'task1_planned:Task 1 planned:Planned:01-01-2020:31-01-2020:100',
					//   'task1_actual:Task 1 actual:Planned:01-01-2020:31-01-2020:100'
					// ]
					//
					// Data format required by Google Chart Gantt:
					//============================================
					// array of tasks, each task is array of format:
					//
					// 'task1_planned', --------> ID
					// 	'Task 1 planned',-------> Name
					// 	'Planned',       -------> Planned or Actual
					// 	new Date(2020, 0, 1), ---> Start date
					// 	new Date(2020, 0, 31), --> Finish Date
					// 	null,  ------------------> Duration. Not in use - calculated automatically
					// 	100,   ------------------> Percent of completion (For planned must be 100)
					// 	null,  ------------------> Dependency. Not in use
					//
					// NOTE:
					// For every task we create two lines: one is for planned and one for actual.
					// ID must be the same for both lines, but with different suffixes: _planned and _actual.
					// Name must forlow same rules as ID.
					// NOTE: The input is requied to be sorted (or need to write sorting method in the widget).
					// NOTE: For every task, planning must come first, and the actual
					//
					// EXAMPLE:
					// ========

					// data.addRows([
					// 	[
					// 		'task1_planned',
					// 		'Task 1 planned',
					// 		'Planned',
					// 		new Date(2020, 0, 1),
					// 		new Date(2020, 0, 31),
					// 		null,
					// 		100,
					// 		null,
					// 	],
					// 	[
					// 		'task1_actual',
					// 		'Task 1 actual',
					// 		'Actual',
					// 		new Date(2020, 0, 3),
					// 		new Date(2020, 1, 10),
					// 		null,
					// 		77,
					// 		null,
					// 	],
					// ])
					// 	[
					// 		'task2_planned',
					// 		'Task 2 planned',
					// 		'Planned',
					// 		new Date(2020, 0, 15),
					// 		new Date(2020, 1, 28),
					// 		null,
					// 		100,
					// 		null,
					// 	],
					// 	[
					// 		'task2_actual',
					// 		'Task 2 actual',
					// 		'Actual',
					// 		new Date(2020, 0, 20),
					// 		new Date(2020, 2, 7),
					// 		null,
					// 		27,
					// 		null,
					// 	],

					// 	[
					// 		'task3_planned',
					// 		'Task 3 planned',
					// 		'Planned',
					// 		new Date(2020, 0, 22),
					// 		new Date(2020, 2, 28),
					// 		null,
					// 		100,
					// 		null,
					// 	],
					// 	[
					// 		'task3_actual',
					// 		'Task 3 actual',
					// 		'Actual',
					// 		new Date(2020, 0, 30),
					// 		new Date(2020, 3, 10),
					// 		null,
					// 		88,
					// 		null,
					// 	],

					// 	[
					// 		'task4_planned',
					// 		'Task 4 planned',
					// 		'Planned',
					// 		new Date(2020, 2, 2),
					// 		new Date(2020, 3, 28),
					// 		null,
					// 		100,
					// 		null,
					// 	],
					// 	[
					// 		'task4_actual',
					// 		'Task 4 actual',
					// 		'Actual',
					// 		new Date(2020, 2, 15),
					// 		new Date(2020, 4, 1),
					// 		null,
					// 		55,
					// 		null,
					// 	],
					// ]);

					data.addRows(this.formatData());

					var options = {
						criticalPathEnabled: false,
						gantt: {
							sortTasks: false,
							percentEnabled: true,
							trackHeight: 60,
							labelStyle: {
								fontName: 'Arial',
								fontSize: 18,
							},
							palette: [
								{
									color: '#4dd0e1',
									dark: '#4dd0e1',
									light: '#c6dafc',
								},
								{
									color: '#b47cff',
									dark: '#7c4dff',
									light: '#c6dafc',
								},
							],
						},
					};

					var chart = new google.visualization.Gantt(
						this.shadowRoot.getElementById('chart_div')
					);
					chart.draw(data, options);
				}
			}
		);
	};
})();
