import React, {useEffect, useState} from 'react';
import * as d3 from 'd3';
import './App.css';
import D3_05 from './d3_05';

const App = () => {

  const [metricData, setMetricData] = useState([]);
  const [meetingData, setMeetingData] = useState([]);
  const [activeMetricData, setActiveMetricData] = useState([]);
  const [activeYear, setActiveYear] = useState([]);

  const changeMetric = (d) => {
    if(activeMetricData === 'All Markets') {
      setMetricData(metricData.filter(a => a['Market'].includes(d)));
      setActiveMetricData(d);
    } else {
      // apiMetric('../SiteAssets/metrics/metrics.csv');
      apiMetric('./metrics.csv');
      setActiveMetricData('All Markets');
    }
  }

  const apiMetric = (url) => {

    d3.csv(url).then(response => {
      setMetricData(response);
    }).catch(err => {
      console.log('error reading population data' + err);
    })

  }

  const dataFilter = () => {
    setMeetingData(metricData);
    let x = metricData;
    if(activeYear === 1) {
      setMeetingData(x.filter(d=> d['Date Added'].endsWith('18')));
    } else if(activeYear === 2) {
      setMeetingData(x.filter(d=> d['Date Added'].endsWith('19')));
    }
  }

  const fyAll = () => {
    setActiveYear(0);
  }

  const fy19Filter = () => {
    setActiveYear(1);
  }

  const fy20Filter = () => {
    setActiveYear(2);
  }

  useEffect(() => { 
    // apiMetric('../SiteAssets/metrics/metrics.csv');
    apiMetric('./metrics.csv');
    setActiveMetricData('All Markets');
    setActiveYear(0);
  }, [])

  useEffect(() => {
    dataFilter();
  }, [metricData, activeYear])

  return (
    <div className="container">
      <div className = 'city'>Innovation Center | Event Metrics</div>
      <div className = 'year'>
        <div className = 'toggle' onClick = {fyAll} style={activeYear === 0 ? {backgroundColor: '#feffff', color: '#181a29'} : null}>All</div>
        <div className = 'toggle' onClick = {fy19Filter} style={activeYear === 1 ? {backgroundColor: '#feffff', color: '#181a29'} : null}>2018</div>
        <div className = 'toggle' onClick = {fy20Filter} style={activeYear === 2 ? {backgroundColor: '#feffff', color: '#181a29'} : null}>2019</div>
        </div>
      <div className = 'main'>
        {meetingData.length ? <D3_05 data={meetingData} activeData={activeMetricData} changeMetric={changeMetric}/> : null}
      </div>
    </div>
  );
}

export default App;