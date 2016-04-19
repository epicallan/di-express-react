import d3 from 'd3-geo-projection';
import {throwError} from '../../../utils/errorHandling';
import { browserHistory } from 'react-router';
/**
 * Mouse handling functions
 */
export const getTipTemplate = (node, data, entities, indicator) => {
  const mapObj = data.find(obj => obj.id === node.id);
  const entity = entities.find(obj => obj.id === node.id);
  let template = '<span class="name">' + entity.name + '</span>';
  if (data) {
    template += '<em>' + indicator + ': ' + ' <b class="value">' + mapObj.value + '</b>' +
                  ' in ' + mapObj.year + '</em>';
  } else {
    template += '<em>No data</em>';
  }
  return template;
};

export const getTipPosition = (svgSize, tooltipSize, datamap) => {
  const pos = d3.mouse(datamap.svg.node()).map(value => parseInt(value, 10));
  pos[0] -= tooltipSize.width / 2;
  pos[1] -= tooltipSize.height + 10;
  // Prevent top collision
  if (pos[1] < 25) pos[1] += tooltipSize.height * 1.5;
  // Prevent left collision
  if (pos[0] < 5) pos[0] = 5;
  // Prevent right collision
  if ((pos[0] + tooltipSize.width) > (svgSize.width - 5)) pos[0] = svgSize.width - tooltipSize.width - 5;
  return pos;
};

export const mapMouseHandlers = (datamap, {update, entities, data, indicator}) => {
  /* eslint-disable func-names*/
  const tooltip = d3.select('#tooltip') || throwError('missing tooltip selector');
  let svgSize = null;
  let tooltipSize = null;
  let mouseDownPosition = null;
  let mouseUpPosition = null;
  datamap.svg.selectAll('.datamaps-subunit')
  .on('mousedown', () => {
    mouseDownPosition = d3.mouse(datamap.svg.node());
  })
  .on('mouseup', (node) => {
    mouseUpPosition = d3.mouse(datamap.svg.node());
    // only do something if same area is clicked
    if (Math.abs(mouseDownPosition[0] - mouseUpPosition[0]) > 3 ||
        Math.abs(mouseDownPosition[1] - mouseUpPosition[1]) > 3) return;
    const selected = entities.find(obj => obj.id === node.id);
    // create region / country url
    if (!selected.slug) return;
    // dsitpatch update to profile store
    update(selected);
    // go to district page
    browserHistory.push(`/district/${selected.slug}`);
  })
  .on('mousemove', () => {
    if (tooltip.classed('hidden')) return;
    const pos = getTipPosition(svgSize, tooltipSize, datamap);
    tooltip.attr('style', 'left:' + pos[0] + 'px; top:' + pos[1] + 'px');
  })
  .on('mouseover', function(datum) {
    const node = d3.select(this);
    tooltip.classed('hidden', false).html(getTipTemplate(datum, data, entities, indicator));
    svgSize = datamap.svg.node().getBoundingClientRect();
    tooltipSize = tooltip.node().getBoundingClientRect();
    node.style('fill', d3.hsl(node.style('fill')).darker(0.5));
  })
  .on('mouseout', function() {
    const node = d3.select(this);
    tooltip.classed('hidden', true);
    node.style('fill', d3.hsl(node.style('fill')).brighter(0.5));
  });
};
