console.log('svg');

// metadata
const width = window.innerWidth, height = window.innerHeight;

// elements
const svg = d3.select('svg');
const zoom = d3
  .zoom()
  .scaleExtent([0.6, 10])
  .on('zoom', () => {
    svg
      .selectAll('path')
      .attr('transform', d3.event.transform);
  });

// setup map projection
const path = d3
  .geoPath()
  .projection(
    d3
      .geoMercator()
      .center([120.97388, 23.6])
      .scale(width * 6)
      .translate([width / 2, height / 2])
      .precision(0.1)
  );

// data
const regionMap = 'data/town_1090324.json';
const countyMap = 'data/county_1090820.json'
const townVote = 'data/town_vote.json';
const countyVote = 'data/county_vote.json'

// setup zoom handler
svg.call(zoom);

// draw map
Promise.all([regionMap, countyMap, townVote, countyVote].map(f => d3.json(f))).then(values => {
  document
    .querySelectorAll('.tab-controls__link')
    .forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabs = document.querySelectorAll('.tab-controls__link');
        tabs.forEach(tab => tab.classList.remove('active'));
        e.target.classList.toggle('active');

        updateMap(e.target.dataset.index);
      });
    });
  
  // get region color by vote count
  const getColor = votes => {
    var colorScheme = {
      pfp: ['#994E0D', '#E67D21', '#FF9B41'],
      kmt: ['#14438E', '#3C79CF', '#67A4EB'],
      dpp: ['#0E6837', '#25A55C', '#4DD68E'],
    };
    var rlt = '#FFFFFF';

    const voted_rate = Math.max(...votes) / votes.reduce((a, b) => a + b, 0);
    switch (Math.max(...votes)) {
      case votes[0]:
        if (voted_rate >= 0.6) rlt = colorScheme.pfp[0];
        else if (voted_rate >= 0.5) rlt = colorScheme.pfp[1];
        else rlt = colorScheme.pfp[2];
        break;
      case votes[1]:
        if (voted_rate >= 0.6) rlt = colorScheme.kmt[0];
        else if (voted_rate >= 0.5) rlt = colorScheme.kmt[1];
        else rlt = colorScheme.kmt[2];
        break;
      case votes[2]:
        if (voted_rate >= 0.6) rlt = colorScheme.dpp[0];
        else if (voted_rate >= 0.5) rlt = colorScheme.dpp[1];
        else rlt = colorScheme.dpp[2];
        break;
    }

    return rlt;
  };

  const getTownVote = townCode => {
    rlt = [];
    values[2].forEach((town) => {
      if (town.Code == townCode) rlt = town;
    });
    return rlt;
  };

  const getCityVote = cityCode => {
    rlt = [];
    values[3].forEach((city) => {
      if (city.Code == cityCode) rlt = city;
    });
    return rlt;
  };

  const regionTopo = topojson.feature(values[0], values[0].objects.TOWN_MOI_1090324);
  const countyTopo = topojson.feature(values[1], values[1].objects.COUNTY_MOI_1090820);

  updateMap(0);

  function updateMap(index) {
    // reset zoom and move
    svg
      .transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);

    // remove old svg
    svg.selectAll('path').remove();

    // redraw new svg
    if (index == 0) {
      // draw city
      svg.selectAll('path')
        .data(countyTopo.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('id', d => `r-${d.properties.CITYCODE}`)
        .attr('class', 'map-region')
        .attr('fill', d => {
          const voteData = getCityVote(d.properties.CITYCODE);
          return getColor([voteData.Candidate_1, voteData.Candidate_2, voteData.Candidate_3]);
        })
        .on('mouseover', d => {
          const voteData = getCityVote(d.properties.CITYCODE);
          d3.select('#vote-region')
            .text(`${d.properties.CITYNAME}`);
          d3.select('#valid-vote')
            .text(voteData.Valid_Vote);
          d3.select('#elector')
            .text(voteData.Elector);
          d3.select('#vote-rate')
            .text(`${voteData.Vote_Rate.toFixed(2)}%`);
          d3.select('#vote-count-1')
            .text(voteData.Candidate_1);
          d3.select('#vote-count-2')
            .text(voteData.Candidate_2);
          d3.select('#vote-count-3')
            .text(voteData.Candidate_3);
        });

      svg.append('path')
        .datum(countyTopo)
        .attr('d', path)
        .attr('class', 'map-county-boundary');
    } else {
      // draw county
      svg.selectAll('path')
        .data(regionTopo.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('id', d => `t-${d.properties.TOWNCODE}`)
        .attr('class', 'map-region')
        .attr('fill', d => {
          const voteData = getTownVote(d.properties.TOWNCODE);
          return getColor([voteData.Candidate_1, voteData.Candidate_2, voteData.Candidate_3]);
        })
        .on('mouseover', d => {
          const voteData = getTownVote(d.properties.TOWNCODE);
          d3.select('#vote-region')
            .text(`${d.properties.COUNTYNAME} ${d.properties.TOWNNAME}`);
          d3.select('#valid-vote')
            .text(voteData.Valid_Vote);
          d3.select('#elector')
            .text(voteData.Elector);
          d3.select('#vote-rate')
            .text(`${voteData.Vote_Rate.toFixed(2)}%`);
          d3.select('#vote-count-1')
            .text(voteData.Candidate_1);
          d3.select('#vote-count-2')
            .text(voteData.Candidate_2);
          d3.select('#vote-count-3')
            .text(voteData.Candidate_3);
        });

      svg.append('path')
        .datum(countyTopo)
        .attr('d', path)
        .attr('class', 'map-county-boundary')
        .attr('id', d => `r-${d.properties.TOWNID}`);
    }
  }
});