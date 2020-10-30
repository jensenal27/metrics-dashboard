import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';

const Line = ({data}) => {

    const svgRef = useRef();

    const dateParser = d3.timeParse('%m/%e/%Y')
    const monthFormat = d3.timeFormat('%b %y')
    const xFormat = d => monthFormat(dateParser(d['Date Added']))

    const yAccessor = d => d.y
    const parseTime = d3.timeParse('%b %y')
    const xAccessor = d => parseTime(d.item)

    const width = 400
    
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

    const axisLabel = 'Events'

    let test = []

    const yaya = [...new Set(data.map(xFormat))]

    const x = yaya.forEach( function(item) {
        const y = data.map(xFormat).filter(d => d === item).length;
        test.push({item, y})
    })

    useEffect(() => {

        const wrapper = d3.select(svgRef.current)
            .attr('id', 'one')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height)
        
        const bounds = wrapper.select('.bounds')
            .style('transform', `translate(${
                dimensions.margin.left
            }px, ${
                dimensions.margin.top
            }px)`)

        const yScale = d3.scaleLinear()
            .domain(d3.extent(test, yAccessor))
            .range([dimensions.boundedHeight, 0])

        const xScale = d3.scaleTime()
            .domain(d3.extent(test, xAccessor))
            .range([0, dimensions.boundedWidth])

        const lineGenerator = d3.line()
            .x(d => xScale(xAccessor(d)))
            .y(d => yScale(yAccessor(d)))
            .curve(d3.curveBasis)

        const areaGenerator = d3.area()
            .x(d => xScale(xAccessor(d)))
            .y0(dimensions.boundedHeight)
            .y1(d => yScale(yAccessor(d)))
            .curve(d3.curveBasis)

        const updateTransition = d3.transition()
            .duration(1000)

        const line = bounds.selectAll('.line')
            .data([test])
            .join('path')
            .attr('class', 'line')
            .transition(updateTransition)
            .attr('d', lineGenerator(test))
            .attr('fill', 'none')
            .attr('stroke', '#3c40c6')
            .attr('stroke-width', 1.5)

        const area = bounds.selectAll('.area')
            .data([test])
            .join('path')
            .attr('class', 'area')
            .transition(updateTransition)
            .attr('d', areaGenerator(test))
            .attr('fill', 'rgba(60, 64, 198, .15)')
            .attr('pointer-events', 'none')
        
        const yAxisGenerator = d3.axisLeft()
            .scale(yScale)
        
        const yAxis = bounds.select('.y-axis')
            .transition(updateTransition)
                .call(yAxisGenerator)

        const xAxisGenerator = d3.axisBottom()
            .scale(xScale)
            .ticks(4)

        const xAxis = bounds.select('.x-axis')
            .transition(updateTransition)
                .call(xAxisGenerator)

        const xAxisLabel = bounds.select('.x-axis-label')
            .attr('x', dimensions.boundedWidth / 2)
            .attr('y', dimensions.margin.bottom - 10)
            .attr('fill', '#fafdff')
            .style('font-size', '1.4em')
            .text(axisLabel)
            .style('text-transform', 'capitalize')

    }, [test])

    return(
        <div className = 'col_wrap'>
            <svg ref = {svgRef}>
                <g className = 'bounds'>
                    <g className = 'x-axis' style={{transform: `translateY(${dimensions.boundedHeight}px)`, color: '#fafdff'}}>
                        <text className = 'x-axis-label'/>
                    </g>
                    <g className = 'y-axis' style={{color: '#fafdff'}}/>
                    <circle className = 'tooltipCircle' r='7' stroke='#f53b57' strokeWidth='4' fill='none' opacity='0'/>
                </g>
            </svg>
        </div>
    );
}

export default Line;