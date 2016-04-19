import d3 from 'd3-geo-projection';
/**
 * zooming and centering functions
 */
export const zoomed = (datamap) => {
  datamap.svg.selectAll('g')
  .attr('transform', 'translate(' + this.zoom.translate() + ')scale(' + this.zoom.scale() + ')');
  datamap.map.svg.selectAll('.datamaps-subunit')
  .style('stroke-width', (this.mapOptions.geographyConfig.borderWidth / this.zoom.scale()) + 'px');
};

export const zoom = d3.behavior.zoom().on('zoom', zoomed);

export const interpolateZoom = ({translate, scale, datamap}) => {
  return d3.transition().duration(350).tween('zoom', () => {
    const iTranslate = d3.interpolate(zoom.translate(), translate);
    const iScale = d3.interpolate(zoom.scale(), scale);
    return (interpolation) => {
      zoom
       .scale(iScale(interpolation))
       .translate(iTranslate(interpolation));
      zoomed(datamap);
    };
  });
};

export const centerMap = ({datamap, mapElm, mapOptions}) => {
  const width = mapElm.offsetWidth;
  const height = mapOptions.height;
  /* eslint-disable id-length*/
  const node = datamap.svg.select('path.' + this.props.id); // gets us curret region / district node
  node.style('fill', 'rgba(186,12,47,1)');

  if (!node) return;
  const nodeData = node.data()[0];

  const widthOffset = 1.25;
  const zoomFactor = 0.2;
  const bounds = datamap.path.bounds(nodeData);
  const dx = bounds[1][0] - bounds[0][0];
  const dy = bounds[1][1] - bounds[0][1];
  const x = (bounds[0][0] + bounds[1][0]) / 2;
  const y = (bounds[0][1] + bounds[1][1]) / 2;
  const scale = zoomFactor / Math.max(dx / width, dy / height);
  const translate = [width / widthOffset - scale * x, height / 2.4 - scale * y];
  interpolateZoom({translate, scale, datamap});
};
