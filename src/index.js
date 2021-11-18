import $, { get } from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";

const tunnelUrl = `http://localhost:5050/api/Destinations`;

//GET
async function getData() {
  try {
    const response = await fetch(tunnelUrl);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  } catch (error) {
    return error.message;
  }
}

// POST
async function postData(data) {
  fetch(tunnelUrl, {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

//DELETE
async function deleteData(destinationId, userName) {
  fetch(`${tunnelUrl}/${destinationId}/${userName}`, {
    method: "DELETE",
  });
}

//PUT
async function putData(destinationId, userName, data) {
  data["destinationId"] = destinationId;
  fetch(`${tunnelUrl}/${destinationId}/${userName}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

//get list of locations
async function appendData() {
  let response = await getData().then(function (response) {
    response.forEach((element) => {
      $(".apiPlaces").append(
        `<div>
        <h1>${element.city}</h1>
        <h4>State: ${element.state}</h4>
        <h4>Country: ${element.country}</h4>
        <h4>Date Visited: ${element.visitDate}</h4>
        <h4>Rating: ${element.rating}/5 | Review: "${element.review}"</h4>
        <h4>Posted by: ${element.userName}</h4>
        <small>${element.destinationId}</small>
        <button ="btn btn-danger" class="deletePlace" id=${element.destinationId},${element.userName}>Delete</button>
        <button class="editPlace" id="${element.destinationId},${element.city},${element.state},${element.country},${element.visitDate},${element.rating},${element.review},${element.userName}">Edit</button>
        <hr>
        </div>`
      );
    });
  });
  //update event handler for dynamically added buttons
  updateHandler();
}

//find all buttons for delete and edit and attach event handlers
function updateHandler() {
  //for delete buttons
  $("button.deletePlace").click(function () {
    const destinationId = $(this).attr("id").split(",")[0];
    const userName = $(this).attr("id").split(",")[1];
    deleteData(destinationId, userName);
    $(this).closest("div").remove();
  });

  //for edit buttons
  $("button.editPlace").click(function () {
    const destinationId = $(this).attr("id").split(",")[0];
    const city = $(this).attr("id").split(",")[1];
    const state = $(this).attr("id").split(",")[2];
    const country = $(this).attr("id").split(",")[3];
    const visitDate = $(this).attr("id").split(",")[4];
    const rating = $(this).attr("id").split(",")[5];
    const review = $(this).attr("id").split(",")[6];
    const userName = $(this).attr("id").split(",")[7];
    //change values of text boxes in footer
    $("div.upperStatic").html(
      `<input type="number" id="destinationId" placeholder="destination id"/>`
    );
    $("select#method").val("edit");
    $("input#destinationId").val(destinationId);
    $("input#userName").val(userName);
    $("input#city").val(city);
    $("input#state").val(state);
    $("input#country").val(country);
    $("input#visitDate").val(visitDate);
    $("input#rating").val(rating);
    $("input#review").val(review);
  });
}

$(document).ready(async function () {
  appendData();

  //on select option change within footer
  $("select#method").change(function () {
    if ($("select#method option:checked").val() == "edit") {
      $("div.upperStatic").append(
        `<input type="number" id="destinationId" placeholder="destination id"/>`
      );
    } else {
      $("input#destinationId").remove();
    }
  });

  //when post button is submitted
  $("button#submit").click(function () {
    const destinationId = $("#destinationId").val();
    const city = $("#city").val();
    const state = $("#state").val();
    const country = $("#country").val();
    const visitDate = $("#visitDate").val();
    const rating = $("#rating").val();
    const review = $("#review").val();
    const userName = $("#userName").val();
    const data = {
      city: city,
      state: state,
      country: country,
      visitDate: visitDate,
      rating: rating,
      review: review,
      userName: userName,
    };

    switch ($("select#method option:checked").val()) {
      case "create":
        postData(data);
        break;
      case "edit":
        putData(destinationId, userName, data);
        break;
      default:
        location.reload();
        break;
    }
    setTimeout(() => {
      location.reload();
    }, 500);
  });
});
