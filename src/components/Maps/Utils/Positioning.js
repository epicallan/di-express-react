import d3 from 'd3-geo-projection';
/**
 * zooming and centering util functions
 */


export const zoomed = (datamap, geographyConfig, zoom) => {
  datamap.svg.selectAll('g')
  .attr('transform', 'translate(' + zoom.translate() + ')scale(' + zoom.scale() + ')');
  datamap.svg.selectAll('.datamaps-subunit')
  .style('stroke-width', (geographyConfig.borderWidth / zoom.scale()) + 'px');
};

export const interpolateZoom = ({translate, scale, datamap, geographyConfig, zoom}) => {
  return d3.transition().duration(350).tween('zoom', () => {
    const iTranslate = d3.interpolate(zoom.translate(), translate);
    const iScale = d3.interpolate(zoom.scale(), scale);
    return (interpolation) => {
      zoom
       .scale(iScale(interpolation))
       .translate(iTranslate(interpolation));
      zoomed(datamap, geographyConfig, zoom);
    };
  });
};

export const centerMap = (datamap, mapOptions, mapElm, zoom, mapId) => {
  const width = mapElm.offsetWidth;
  const height = mapOptions.height;
  /* eslint-disable id-length*/
  const node = datamap.svg.select('path.' + mapId); // gets us curret region / district node
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
  interpolateZoom({
    translate,
    scale,
    datamap,
    geographyConfig: mapOptions.geographyConfig,
    zoom
  });
};
