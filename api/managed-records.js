import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
const generateResultObj = (data, pg) => {

  console.log(`Transforming Data ...`);
  //ids: [id, id, id],
  const idList = data.map((item) => item.id);

  //adding isPrimary key
  const primColors = ["red", "blue", "yellow"];
  const withPrimColorList = data.map((item) =>
    primColors.includes(item.color)
      ? { ...item, isPrimary: true }
      : { ...item, isPrimary: false }
  );

  //open: [item, item, item],
  const openList = withPrimColorList.filter(
    (item) => item.disposition === "open"
  );

  //closedPrimaryCount: #,
  const closedPrimCount = withPrimColorList.filter(
    (item) => item.disposition === "closed" && item.isPrimary === true
  ).length;

  //previousPage: # || null
  let firstPg = 1;
  const prevPg = pg > firstPg ? pg - 1 : null;

  //nextPage: # || null
  let lastPg = 50;
  const nxtPg = pg < lastPg ? pg + 1 : null;

  //return JSON.stringify({
  return {
    previousPage: prevPg,
    nextPage: nxtPg,
    ids: idList,
    open: openList,
    closedPrimaryCount: closedPrimCount,
  };
};

//retrieve( { page:2, colors: ["red","brown"] } );   => { limit: x, offset: x, colors: [x,x,x] }
const retrieve = (optionsObj = { page: 0, colors: [] }) => {
  // get page and colors
  const page = optionsObj.page || 1; //2
  const colorArr = optionsObj.colors || [
    //["red","brown"]
    "red",
    "brown",
    "blue",
    "yellow",
    "green",
  ];
  console.log(`page`, page, `colorArr`, colorArr);

  //convert page and color array into query string options: limit, offset, and color[]
  const itemPerPage = 10; // process pages of 10 items at a time
  const derivedStartIdx = (page - 1) * 10; // pg 1 => start @ idx 0; pg 2 => start @ idx 10; pg 3 => start @ idx 20 ...

  // create URI as 'http://localhost:3000/records?limit=2&offset=0&color=red&color=brown&color=blue&color=yellow&color=green'
  let uriEndpoint = new URI(window.path).setSearch({
    limit: itemPerPage,
    offset: derivedStartIdx,
    color: colorArr, //'color[]': works too
  });
  console.log(`uriEndpoint`, uriEndpoint.toString());


  let resultData;
  fetch(uriEndpoint)
//fetch(uriEndpoint.toString())  //same
    .then((res) => {
      console.log(`fetch-res`, res); //check status 200 OK
      return res.json(); //convert response object into a JS obj
    })
    .then((data) => {
      console.log(`Endpoint Success-data:`, data);
    //console.log(`Endpoint Success-page`, page);
    //transform data
      resultData = generateResultObj(data, page);
    console.log(`Endpoint Success-2`, resultData);
    })
    .catch((err) => {
      console.log(`Endpoint Error:`, err);
    });

  return Promise.resolve(resultData);
};

export default retrieve;

// LAST:
// dont forget to refactor code
