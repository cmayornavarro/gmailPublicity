  import * as React from 'react';
import {
 useLocation
} from "react-router-dom";





  export default  function Child(){     
    console.log(useLocation().search.split("code=")[1]);   
    var token = useLocation().search.split("code=")[1].split("&scope")[0].replace("%2F","/");
  /*const response =  fetch("/api/fetchGmailData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: token }),
    });*/
    return null;
  };