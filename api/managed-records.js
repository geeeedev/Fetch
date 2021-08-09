import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
const generateResultObj = (data, pg) => {

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
  const prevPg = pg > 1 && pg - 1 < Math.ceil(data.length / 10) ? pg - 1 : null;

  //nextPage: # || null
  const nxtPg = pg < Math.ceil(data.length / 10) ? pg + 1 : null;

  return {
    ids: idList,
    open: openList,
    closedPrimaryCount: closedPrimCount,
    previousPage: prevPg,
    nextPage: nxtPg,
  };
};

//retrieve( { page:2, colors: ["red","brown"] } );   => { limit: x, offset: x, colors: [x,x,x] }
const retrieve = (optionsObj) => {
  // get page and colors
  const page = optionsObj.page || 1; //2
  const colorArr = optionsObj.colors || [
    "red",
    "brown",
    "blue",
    "yellow",
    "green",
  ]; //["red","brown"]

  //convert page and color array into query string options: limit, offset, and color[]
  const itemPerPage = 10; // process pages of 10 items at a time
  const derivedStartIdx = (page - 1) * 10; // pg 1 => start @ idx 0; pg 2 => start @ idx 10; pg 3 => start @ idx 20 ...

  // create URI as 'http://localhost:3000/records?limit=2&offset=0&color[]=brown&color[]=green'
  let uriEndpoint = URI(window.path).search({
    limit: itemPerPage,
    offset: derivedStartIdx,
    color: colorArr,
  });
  // let uriEndpoint = URI(window.path).search({ limit: itemPerPage, offset: derivedOffset, "color[]": colorArr });

  fetch(uriEndpoint)
    .then((res) => {
      console.log(`fetch-res`,res);         //check res result
      console.log(`fetch-res.json`,res.json());  //check res.json() result
      return res.json();        //convert response object into a JS obj
    })
    .then((data) => {
      log(`Endpoint Success-data:`, data);
      //run the parse method here
      return res.json(generateResultObj(data, page));
    })
    .catch((err) => {
      console.log(`Endpoint Error:`, err);
    });
};

export default retrieve;

// LAST:
// dont forget to refactor code

// handle uriEndpoint color with []
