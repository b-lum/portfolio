import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

let query = '';
let selectedIndex = -1;
let selectedYear = null; // ADD THIS

let searchInput = document.querySelector('.searchBar');


function getFilteredProjects() {
   let result = projects;

   // 1. search filter
   if (query) {
      result = result.filter(project => {
         let values = Object.values(project)
            .join('\n')
            .toLowerCase();
         return values.includes(query.toLowerCase());
      });
   }

   // 2. year filter (from pie chart)
   if (selectedYear !== null) {
      result = result.filter(p => p.year === selectedYear); // CHANGED
   }

   return result;
}


searchInput.addEventListener('input', (event) => {
   query = event.target.value;

   let filtered = getFilteredProjects();
   renderProjects(filtered, projectsContainer, 'h2');

   // Pie shows all years matching search, not year-filtered
   let searchFiltered = projects.filter(project => {
      if (!query) return true;
      let values = Object.values(project).join('\n').toLowerCase();
      return values.includes(query.toLowerCase());
   });
   renderPieChart(searchFiltered);
});


function renderPieChart(projectsGiven) {
   let rolled = d3.rollups(
      projectsGiven,
      v => v.length,
      d => d.year
   );

   let data = rolled.map(([year, count]) => ({
      value: count,
      label: year
   }));

   let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
   let sliceGenerator = d3.pie().value(d => d.value);

   let arcData = sliceGenerator(data);
   let colors = d3.scaleOrdinal(d3.schemeTableau10);

   let svg = d3.select('svg');
   let legend = d3.select('.legend');

   svg.selectAll('path').remove();
   legend.selectAll('li').remove();

   arcData.forEach((d, i) => {
   svg
      .append('path')
      .attr('d', arcGenerator(d))
      .attr('style', `--color:${colors(i)}`)
      .attr('class', selectedYear === data[i].label ? 'selected' : '')
      .on('click', () => {
         selectedYear = selectedYear === data[i].label ? null : data[i].label;

         let filtered = getFilteredProjects();
         renderProjects(filtered, projectsContainer, 'h2');

         let searchFiltered = projects.filter(project => {
            if (!query) return true;
            let values = Object.values(project).join('\n').toLowerCase();
            return values.includes(query.toLowerCase());
         });
         renderPieChart(searchFiltered); // pie always shows all years
      });
});

data.forEach((d, i) => {
   legend
      .append('li')
      .attr('style', `--color:${colors(i)}`)
      .attr('class', selectedYear === d.label ? 'selected' : '') // CHANGED
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
});
}

renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);