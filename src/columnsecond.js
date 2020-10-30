import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const ColumnSecond = ({data, xAccessor, yAccessor, title, setActiveAccount}) => {

    const svgRef = useRef();

    const width = 475
    
    let dimensions = {
        width: width,
        height: width * 0.5,
        margin: {
            top: 30,
            right: 40,
            bottom: 50,
            left: 40
        }
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    let test = []

    const yaya = [...new Set(data.map(xAccessor))]

    const x = yaya.forEach( function(item) {
        const y = data.map(xAccessor).filter(d => d === item).length;
        const x = item;
        test.push({x, y})
    })

    test.sort((a, b) => b.y - a.y);

    console.log(test);

    const rectColors = function(d) { return d.x === 'Partner' ? '#044662' :
                                            d.x === 'Internal' ? '#0f5a7b' :
                                            d.x === 'Client' ? '#227193' :
                                            d.x === 'Community' ? '#3b809e' :
                                            d.x === 'One-A' ? '#770026' :
                                            d.x === 'One-B' ? '#9a103c' :
                                            d.x === 'One-C' ? '#c02255' :
                                            d.x === 'One-D' ? '#cf4772' :
                                            d.x === 'Two-A' ? '#712966' :
                                            d.x === 'Two-B' ? '#8d4882' :
                                            d.x === 'Two-C' ? '#a8709f' :
                                            d.x === 'Two-D' ? '#c69ebf' :
                                            d.x === 'Three-A' ? '#0e6d14' :
                                            d.x === 'Three-B' ? '#268b2c' :
                                            d.x === 'Three-C' ? '#42a548' :
                                            d.x === 'Three-D' ? '#6cc371' :
                                            d.x === 'Four-A' ? '#51919d' :
                                            d.x === 'Four-B' ? '#82bbc5' :
                                            d.x === 'Four-C' ? '#b3dbe3' :
                                            d.x === 'Four-D' ? '#dff3f7' :
                                            d.x === 'Five-A' ? '#3c7653' :
                                            d.x === 'Five-B' ? '#5b8d6f' :
                                            d.x === 'Five-C' ? '#80a68f' :
                                            d.x === 'Five-D' ? '#abc2b4' :
                                            d.x === 'Room Three' ? '#0d0d2f' :
                                            d.x === 'Room Two' ? '#1c1c45' :
                                            d.x === 'Room One' ? '#2c2c54' :
                                            '#fafdff'}

    const loadFn = () => {

        const wrapper = d3.select(svgRef.current)
            .attr('id', 'three')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height)

    }

    const testFn = () => {

        if (title === 'IC: Sub Account') {
            setActiveAccount(test[0].x)
        }

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
            .rangeRound([0, dimensions.boundedWidth])

        const updateTransition = d3.transition()
            .duration(1000)

        const barPadding = 6

        const barRects = bounds.selectAll('rect')
            .data(test)
            .join(
                enter => enter.append('rect')
                    .attr("x", d => xScale(d.x) + barPadding / 2)
                    .attr("y", d => dimensions.boundedHeight)
                    .attr("height", 0)
                    .attr("width", xScale.bandwidth() - barPadding)
                    .style('fill', '#44465b')
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
                    .style('font-size', '10px')
                    .style('font-family', 'sans-serif')
                    .style('display', function (d) { return (d.length === 0) ? 'none' : null })
                .call(enter => enter.transition(updateTransition)
                    .attr("x", d => xScale(d.x) + xScale.bandwidth() / 2)
                    .attr("y", d => yScale(yAccessor(d)) - 5)
                    .text(yAccessor)
                    .style('text-anchor', 'middle')
                    .attr('fill', '#fafdff')
                    .style('font-size', '10px')
                    .style('font-family', 'sans-serif'))
                    .style('display', function (d) { return (d.length === 0) ? 'none' : null }),
                update => update.transition(updateTransition)
                    .attr("x", d => xScale(d.x) + xScale.bandwidth() / 2)
                    .attr("y", d => yScale(yAccessor(d)) - 5)
                    .text(yAccessor)
                    .style('text-anchor', 'middle')
                    .attr('fill', '#fafdff')
                    .style('font-size', '10px')
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
            .tickFormat(function(d) { return d.split(': ').pop().slice(0, 3)})

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

        const rectLabels = bounds.selectAll('.tick text')
        
        yaya.length > 20 ? rectLabels.style('display', 'none') : rectLabels.style('display', 'initial')

        function onMouseEnter(d) {

            const tooltip = d3.select(`#tooltip${title[0]}`)
                .style('opacity', 1)
            d3.select(this).style('fill', '#181a29')
            d3.select(`#range${title[0]}`)
                .text(d.x + '  |  ')
            d3.select(`#count${title[0]}`)
                .text(yAccessor(d) + ' Events')

        }

        function onMouseLeave(d) {
            d3.select(`#tooltip${title[0]}`).style('opacity', 0)
            d3.select(this).style('fill', rectColors)
        }

        bounds.selectAll('rect')
            .on('mouseenter', onMouseEnter)
            .on('mouseleave', onMouseLeave)

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
                <g className = 'x-axis' style={{transform: `translateY(${dimensions.boundedHeight}px)`, strokeWidth: '2px',  color: '#fafdff'}}>
                    <text className = 'x-axis-label'/>
                </g>
                <line className = 'meanline' x1='-4' x2='-4' y1={dimensions.boundedHeight / 2} y2={dimensions.boundedHeight / 2} stroke='#fafdff' strokeDasharray='4px 8px' strokeWidth='2px'/>
                <text className = 'meanlabel' x='-40' y={(dimensions.boundedHeight / 2) + 2} text='mean' fill='#fafdff' fontSize='12px'/>
            </g>
        </svg>
        <div className = 'tooltip' id = {`tooltip${title[0]}`}>
            <span id = {`range${title[0]}`}></span>
            <span id = {`count${title[0]}`}></span>
        </div>
        </div>
    );
}

export default ColumnSecond;