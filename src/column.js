import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const Column = ({data, changeMetric, xAccessor, yAccessor, title}) => {

    const svgRef = useRef();

    const width = 600
    
    let dimensions = {
        width: width,
        height: width * 0.5,
        margin: {
            top: 30,
            right: 60,
            bottom: 50,
            left: 60
        }
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    const rectColors = function(d) { return d.x === 'Market One' ? '#c02255' : 
                                            d.x === 'Market Two' ? '#a8709f' :
                                            d.x === 'Market Three' ? '#42a54b' :
                                            d.x === 'Market Four' ? '#b3dbe3' :
                                            d.x === 'Market Five' ? '#80a68f' :
                                            '#fafdff'}

    const loadFn = () => {

        const wrapper = d3.select(svgRef.current)
            .attr('id', 'three')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height)

    }

    const testFn = () => {

        let test = []

        const yaya = [...new Set(data.map(xAccessor))]

        const x = yaya.forEach( function(item) {
            const y = data.map(xAccessor).filter(d => d === item).length;
            const x = item.split('(').pop().split(')')[0];
            test.push({x, y})
        })

        test.sort((a, b) => b.y - a.y);

        const wrapper = d3.select(svgRef.current)
            .attr('id', 'three')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height)

        const bounds = wrapper.select('.bounds')
            .style('transform', `translate(${
                dimensions.margin.left
            }px, ${
                dimensions.margin.top
            }px)`)

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(test, yAccessor)])
            .range([dimensions.boundedHeight, 0])

        const xScale = d3.scaleBand()
            .domain(test.map(d => d.x))
            .range([0, dimensions.boundedWidth])

        const updateTransition = d3.transition()
            .duration(1000)

        const barPadding = 10

        const barRects = bounds.selectAll('rect')
            .data(test)
            .join(
                enter => enter.append('rect')
                    .attr("x", d => xScale(d.x) + barPadding / 2)
                    .attr("y", d => dimensions.boundedHeight)
                    .attr("height", 0)
                    .attr("width", xScale.bandwidth() - barPadding)
                    .style('fill', '#44465b')
                    .style('cursor', 'pointer')
                .call(enter => enter.transition(updateTransition)
                    .attr("y", d => yScale(yAccessor(d)))
                    .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
                    .transition()
                    .duration(250)
                    .style('fill', rectColors)),
                update => update.transition(updateTransition)
                    .attr("x", d => xScale(d.x) + barPadding / 2)
                    .attr("y", d => yScale(yAccessor(d)))
                    .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
                    .attr("width", xScale.bandwidth() - barPadding)
                    .style('fill', '#44465b')
                .call(update => update.transition()
                    .duration(250)
                    .style('fill', rectColors)),
                exit => exit.transition(updateTransition)
                    .attr('y', d => dimensions.boundedHeight)
                    .attr('height', 0)
                    .style('fill', '#44465b')
                .call(exit => exit.remove())
            )

        const barText = bounds.selectAll('#barlabel')
            .data(test)
            .join(
                enter => enter.append('text')
                    .attr('id', 'barlabel')
                    .attr("x", d => xScale(d.x) + xScale.bandwidth() / 2)
                    .attr("y", d => dimensions.boundedHeight)
                    .text(yAccessor)
                    .style('text-anchor', 'middle')
                    .attr('fill', '#fafdff')
                    .style('font-size', '12px')
                    .style('font-family', 'sans-serif')
                    .style('display', function (d) { return (d.length === 0) ? 'none' : null })
                .call(enter => enter.transition(updateTransition)
                    .attr("x", d => xScale(d.x) + xScale.bandwidth() / 2)
                    .attr("y", d => yScale(yAccessor(d)) - 5)
                    .text(yAccessor)
                    .style('text-anchor', 'middle')
                    .attr('fill', '#fafdff')
                    .style('font-size', '12px')
                    .style('font-family', 'sans-serif'))
                    .style('display', function (d) { return (d.length === 0) ? 'none' : null }),
                update => update.transition(updateTransition)
                    .attr("x", d => xScale(d.x) + xScale.bandwidth() / 2)
                    .attr("y", d => yScale(yAccessor(d)) - 5)
                    .text(yAccessor)
                    .style('text-anchor', 'middle')
                    .attr('fill', '#fafdff')
                    .style('font-size', '12px')
                    .style('font-family', 'sans-serif')
                    .style('display', function (d) { return (d.length === 0) ? 'none' : null }),
                exit => exit.remove()
            )

        const mean = d3.mean(test, yAccessor)

        const meanLine = bounds.selectAll('.meanline')
            .data(test)
            .transition(updateTransition)
                .attr('x1', -4)
                .attr('x2', dimensions.boundedWidth)
                .attr('y1', yScale(mean))
                .attr('y2', yScale(mean))
                .attr('stroke', '#fafdff')
                .attr('stroke-dasharray', '4px 8px')
                .attr('stroke-width', '2px')
                
        const meanLabel = bounds.selectAll('.meanlabel')
            .data(test)
            .transition(updateTransition)
                .attr('x', -40)
                .attr('y', yScale(mean) + 2)
                .text('mean')
                .attr('fill', '#fafdff')
                .style('font-size', '12px')

        const xAxisGenerator = d3.axisBottom()
            .scale(xScale)

        const xAxis = bounds.select('.x-axis')
            .transition(updateTransition)
                .call(xAxisGenerator)

        const xAxisLabel = bounds.select('.x-axis-label')
            .attr('x', dimensions.boundedWidth / 2)
            .attr('y', dimensions.margin.bottom - 10)
            .attr('fill', '#fafdff')
            .style('font-size', '1.4em')
            .text(title)
            .style('text-transform', 'capitalize')

        function goData(d) {
            changeMetric(d.x);
        }

        bounds.selectAll('rect')
            .on('mousedown', goData)

    }

    useEffect(() => {

        loadFn();
        testFn();

    }, [])

    useEffect(() => {
        
        testFn();
        
    }, [data])

    return(
        <div className = 'col_wrap'>
        <svg ref = {svgRef}>
            <g className = 'bounds'>
                <g className = 'x-axis' style={{transform: `translateY(${dimensions.boundedHeight}px)`, strokeWidth: '10px', color: '#fafdff'}}>
                    <text className = 'x-axis-label'/>
                </g>
                <line className = 'meanline' x1='-4' x2='-4' y1={dimensions.boundedHeight / 2} y2={dimensions.boundedHeight / 2} stroke='#fafdff' strokeDasharray='4px 8px' strokeWidth='2px'/>
                <text className = 'meanlabel' x='-40' y={(dimensions.boundedHeight / 2) + 2} text='mean' fill='#fafdff' fontSize='12px'/>
            </g>
        </svg>
        
        </div>
    );
}

export default Column;