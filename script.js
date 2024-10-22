document.addEventListener("DOMContentLoaded", () => {
    fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
        .then(response => response.json())
        .then((data, error) => {
            if (error) {
                console.log(error);
                return;
            } else {
                countyData = topojson.feature(data, data.objects.counties).features;
                fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
                    .then(response => response.json())
                    .then((data, error) => {
                        if (error) {
                            console.log(error);
                            return;
                        } else {
                            educationData = data;
                            drawMap();
                        }
                    });
            }
        });
});

let countyData = [];
let educationData = [];

const drawMap = () => {
    d3.select("#canvas").selectAll("path")
        .data(countyData)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("class", "county")
        .attr("fill", (countyItem) => {
            let county = educationData.find((item) => item.fips === countyItem.id);
            let percentage = county.bachelorsOrHigher;
            if (percentage >= 20) {
                return "#7be382"
            } else if (percentage >= 40) {
                return "#26cc00"
            } else if (percentage >= 60) {
                return "#22b600"
            } else if (percentage >= 80) {
                return "#009c1a"
            } else {
                return "#d2f2d4"
            }
        })
        .attr("data-fips", (countyItem) => countyItem.id)
        .attr("data-education", (countyItem) => educationData.find((item) => item.fips === countyItem.id).bachelorsOrHigher)
        .on("mouseover", (event, d) => {
            const county = educationData.find((item) => item.fips === d.id);
            const area = county.area_name;
            const state = county.state;
            const percentage = county.bachelorsOrHigher;
            const x = event.clientX + 10;
            const y = event.clientY + 10;
            tooltip
                .style("display", "block")
                .style("left", `${x}px`)
                .style("top", `${y}px`)
                .html(`${area}, ${state}: ${percentage}%`)
        })
        .on("mouseout", () => {
            tooltip
                .style("display", "none")
        })
}

d3.select("body").append("h1").text("United States Educational Attainment").attr("id", "title");
d3.select("body").append("h3").text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)").attr("id", "description");
d3.select("body").append("svg").attr("id", "canvas").attr("width", 1000).attr("height", 600);

const legend = d3.select("body").append("svg").attr("id", "legend").attr("width", 150).attr("height", 120);

legend.selectAll("rect")
    .data([0, 20, 40, 60, 80])
    .enter()
    .append("rect")
    .attr("x", 10)
    .attr("y", (d, i) => i * 22)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", (d) => {
        if (d === 20) {
            return "#7be382"
        } else if (d === 40) {
            return "#26cc00"
        } else if (d === 60) {
            return "#22b600"
        } else if (d === 80) {
            return "#009c1a"
        } else {
            return "#d2f2d4"
        }
    })

legend.selectAll("text")
    .data([0, 20, 40, 60, 80])
    .enter()
    .append("text")
    .attr("x", 40)
    .attr("y", (d, i) => i * 22 + 15)
    .text((d) => "> " + d + "%")
    .attr("font-size", 14)

const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
