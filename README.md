# Taiwan Election 2020 Visualization
Visualization of Taiwan election 2020 with county and township data, projecting map data using D3.js
## Features
* Colorized: Filled the regions with colors based on voting rate
* Draggable: Visualized by movable and zoomable map
* Aesthetic: Well designed UI and user experience
## Table of Contents
* [Getting Started](#getting-started)
  * [Dependencies](#dependencies)
  * [Installation](#installation)
* [Running](#running)
* [Data Resource](#Data Resource)
* [Authors](#authors)
* [Declaration](#declaration)
## Getting Started
### Dependencies
* [Nodemon](https://www.npmjs.com/package/nodemon) ~2.0.7 -> Node.js running tool with automatic refreshing
* [Express](https://www.npmjs.com/package/express) ~4.16.1 -> Node.js backend framework
* [D3.js](https://d3js.org) v5 -> Data visualization framework
* [D3.js Topojson](https://github.com/topojson/topojson) v2 -> D3.js topoJson parsing tool
### Installation
Just clone it into your host
```
git clone https://gitlab.com/jercymat/<git-repo>.git
```
## Running
Navigate to the root path of the repo then run the server.

**Default Method**
```
npm start
```
**Designate Listening Port**
```
PORT=<PORT-NUMBER> npm start
```
Enjoy.
## Data Resource
* **Election Result :** [Central Election Commision, R.O.C. (Taiwan)](https://www.cec.gov.tw)
* **Map :** [National Land Surveying and Mapping Center, Ministry of the Interior, R.O.C (Taiwan)](https://www.nlsc.gov.tw)

## Authors
* **Han-Hsuan Lin** - *Dept. of computer science, National Chengchi University* - [110753108@nccu.edu.tw](mailto:110753108@nccu.edu.tw)
## Declaration
This system is built for *Information Visualization Course*, Dept. of computer science, National Chengchi University.

