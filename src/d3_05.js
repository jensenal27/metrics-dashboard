import React, {useState, useEffect} from 'react';
import './column.css';
import Column from './column';
import ColumnSecond from './columnsecond';
import Line from './line';

const D3_05 = ({data, activeData, changeMetric}) => {

    const [activeAccount, setActiveAccount] = useState('');
    const [dataTotal, setDataTotal] = useState(0);

    const percentageTotal = parseInt((data.length / dataTotal) * 100, 10)
    const percentageClient = parseInt(((data.filter(d => d['Booking Event Type'] === 'Client').length / data.length) * 100), 10)
    const percentageInternal = parseInt(((data.filter(d => d['Booking Event Type'] === 'Internal').length / data.length) * 100), 10)

    const yAccessor = d => d.y
    const marketAccessor = d => d['Market']
    const typeAccessor = d => d['Booking Event Type']
    const accountAccessor = d => d['Account']
    const roomAccessor = d => d['Room']

    const marketTitle = 'Market'
    const typeTitle = 'Booking Event Type'
    const accountTitle = 'Account'
    const roomTitle = 'Room'

    useEffect(() => {
        setDataTotal(data.length);
    }, [])

    return(
        <div className = 'col_container'>
            <div className = 'col_main'>
                <Column data={data} changeMetric={changeMetric} xAccessor={marketAccessor} yAccessor={yAccessor} title={marketTitle}/>
                <div className = 'infoblock'><span className = 'maintitle'>{activeData}</span></div>
                <div className = 'infoblock'><span className = 'subtitle'>Total Meetings</span><span className = 'title'>{data.length}</span></div>
                <div className = 'infoblock'><span className = 'subtitle'>% Client</span><span className = 'title'>{percentageClient}%</span></div>
                <div className = 'infoblock'><span className = 'subtitle'>Most Active Account</span><span className = 'title'>{activeAccount}</span></div>
                <div className = 'infoblock'><span className = 'subtitle'>% of Total</span><span className = 'title'>{percentageTotal}%</span></div>
                <div className = 'infoblock'><span className = 'subtitle'>% Internal</span><span className = 'title'>{percentageInternal}%</span></div>
            </div>
            <div className = 'col_second'>
                <Line data={data}/>
                <ColumnSecond data={data} setActiveAccount={setActiveAccount} xAccessor={accountAccessor} yAccessor={yAccessor} title={accountTitle}/>
                <ColumnSecond data={data} xAccessor={typeAccessor} yAccessor={yAccessor} title={typeTitle}/>
                <ColumnSecond data={data} xAccessor={roomAccessor} yAccessor={yAccessor} title={roomTitle}/>
            </div>
        </div>
    );
}

export default D3_05;