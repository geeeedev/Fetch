import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...


//retrieve( { page:2, colors: ["red","brown"] } );   => { limit: x, offset: x, colors: [x,x,x] }
const retrieve = (optionsObj) => {

    // get page and colors
    let page = optionsObj.page || 1; //2
    let colorArr = optionsObj.colors || ["red","brown","blue","yellow","green"]; //["red","brown"]

    //convert page and color array into query string options: limit, offset, and color[]
    const itemPerPage = 10;                   // process pages of 10 items at a time
    const derivedStartIdx = (page - 1) * 10;  // pg 1 => start @ idx 0; pg 2 => start @ idx 10; pg 3 => start @ idx 20 ...

    // create URI as 'http://localhost:3000/records?limit=2&offset=0&color[]=brown&color[]=green'
    let uriEndpoint = URI(window.path).search({ limit: itemPerPage, offset: derivedStartIdx, color: colorArr });
    // let uriEndpoint = URI(window.path).search({ limit: itemPerPage, offset: derivedOffset, "color[]": colorArr });


    

}

export default retrieve;

// LAST:
// dont forget to refactor code

// handle uriEndpoint color with []