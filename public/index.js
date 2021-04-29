// Put all onload AJAX calls here, and event listeners
$(document).ready(function () {
  // On page-load AJAX Example

  $.ajax({
    type: "get", //Request type
    dataType: "json", //Data type - we will use JSON for almost everything
    url: "/open", //The server endpoint we are connecting to
    success: function (data) {
    }, error: function (data) {
      alert(err.responseJSON.message);
    },
  });

  $("#login").click(function (event) {
    document.getElementById("login_form").hidden = false;
    document.getElementById("signup_form").hidden = true;

  });

  $("#signup").click(function (event) {
    document.getElementById("signup_form").hidden = false;
    document.getElementById("login_form").hidden = true;
  });

  $("#login_credentials").submit(function (event) {
    event.preventDefault();
    var username = $("#username").val();
    var pass = $("#password").val();

    $.ajax({
      method: "post",
      url: "/login",
      data: JSON.stringify({ username: username, pass: pass }),
      contentType: "application/json",
      success: function (data) {

        console.log(data);
        

        let l = data.length;
        document.getElementById("user_id").hidden = false;
        document.getElementById("LOGOUT").hidden = false;
        document.getElementById("all").hidden = false;

        alert(data[l - 1]);
        if (data.length == 2) {
          $("#user_id_num").html("Logged in with User Id - " + data[l - 2]);
          $("#display_no_secrets").html("No Secrets Stored Yet. 🙁");
          document.getElementById("no_secrets").hidden = false;
          document.getElementById("Experiences").hidden = true;
        }
        else {
          $("#user_id_num").html("Logged in with User Id - " + data[l - 2]);
          document.getElementById("Experiences").hidden = false;
          document.getElementById("no_secrets").hidden = true;
          document.getElementById("header_exp").hidden = false;

          $("#all_experiences tr").remove();

          $("#all_experiences").append(
            '<tr><th>S.no.</th><th>Life Experience</th></tr>'
          );

          for (var i = 0; i < l - 2; i++) {
            $("#all_experiences").append(
              "<tr>" +
              '<td>' +
              (i + 1) +
              "</td>" +
              '<td>' +
              data[i] +
              "</td>" +
              "</tr>"
            );
          }
        }

      },
      error: function (err) {
        alert(err.responseJSON.message);
      },
    });
  });

  $("#signup_credentials").submit(function (event) {
    event.preventDefault();
    var username = $("#S_username").val();
    var pass = $("#S_password").val();
    var confirm = $("#confirm_password").val();
    var name = $("#name").val();

    $.ajax({
      method: "post",
      url: "/signin",
      data: JSON.stringify({ username: username, pass: pass, confirm: confirm, name: name }),
      contentType: "application/json",
      success: function (data) {
        alert(data.message);
        document.getElementById("signup_form").hidden = true;
        document.getElementById("login_form").hidden = false;
      },
      error: function (err) {
        alert(err.responseJSON.message);

      },
    });
  });

  $("#add_experience").click(function (event) {
    document.getElementById("experience_form").hidden = false;
  });

  $("#experience").submit(function (event) {
    event.preventDefault();
    var exp = $("#exp").val();
    var user_id = $("#USER_ID").val();

    $.ajax({
      method: "post",
      url: "/add_exp",
      data: JSON.stringify({ exp: exp, user_id: user_id }),
      contentType: "application/json",
      success: function (data) {
        alert('Successfully Added the Experience!');
        document.getElementById("experience_form").hidden = true;
        $("#all_experiences").append(
          "<tr>" +
          '<td>' +
          (data.count + 1) +
          "</td>" +
          '<td>' +
          exp +
          "</td>" +
          "</tr>"
        );
      },
      error: function (err) {
        alert(err.responseJSON.message);
      },
    });
  });



  $("#del_experience").click(function (event) {
    document.getElementById("DELETE_EXP").hidden = false;
  });


  $("#delete_experience").submit(function (event) {
    event.preventDefault();
    
    var userid = $("#D_USER_ID").val();
    var exp_id = $("#exp_id").val();

    $.ajax({
      method: "post",
      url: "/del_exp",
      data: JSON.stringify({ userid: userid, exp_id: exp_id }),
      contentType: "application/json",
      success: function (data) {
        let l = data.length;
        document.getElementById("user_id").hidden = false;

        document.getElementById("DELETE_EXP").hidden = true;

        alert(data[l - 1]);

        if (data.length == 1) {
          $("#no_secrets").html("No Secrets Stored Yet.🙁");
          document.getElementById("no_secrets").hidden = false;
          document.getElementById("DELETE_EXP").hidden = true;
        }
        else {
          document.getElementById("Experiences").hidden = false;
          document.getElementById("no_secrets").hidden = true;
          document.getElementById("header_exp").hidden = false;

          $("#all_experiences tr").remove();

          $("#all_experiences").append(
            '<tr><th>S.no.</th><th>Life Experience</th></tr>'
          );

          for (var i = 0; i < l - 1; i++) {
            $("#all_experiences").append(
              "<tr>" +
              '<td>' +
              (i + 1) +
              "</td>" +
              '<td>' +
              data[i] +
              "</td>" +
              "</tr>"
            );
          }
        }

      },
      error: function (err) {
        alert(err.responseJSON.message);

      },
    });
  });

  $("#update_experience").submit(function (event) {
    event.preventDefault();
    
    var userid = $("#U_USER_ID").val();
    var exp_id = $("#U_exp_id").val();
    var updated = $("#update_exp").val();

    $.ajax({
      method: "post",
      url: "/update_exp",
      data: JSON.stringify({ userid: userid, exp_id: exp_id ,updated : updated}),
      contentType: "application/json",
      success: function (data) {
        let l = data.length;
        document.getElementById("user_id").hidden = false;
        document.getElementById("EDIT_EXP").hidden = true;

        

        alert(data[l - 1]);

        if (data.length == 1) {
          $("#no_secrets").html("No Secrets Stored Yet.🙁");
          document.getElementById("no_secrets").hidden = false;
          document.getElementById("Experiences").hidden = true;
        }
        else {
          document.getElementById("Experiences").hidden = false;
          document.getElementById("no_secrets").hidden = true;
          document.getElementById("header_exp").hidden = false;

          $("#all_experiences tr").remove();

          $("#all_experiences").append(
            '<tr><th>S.no.</th><th>Life Experience</th></tr>'
          );

          for (var i = 0; i < l - 1; i++) {
            $("#all_experiences").append(
              "<tr>" +
              '<td>' +
              (i + 1) +
              "</td>" +
              '<td>' +
              data[i] +
              "</td>" +
              "</tr>"
            );
          }
        }

      },
      error: function (err) {
        alert(err.responseJSON.message);

      },
    });
  });


  $("#edit_experience").click(function (event) {
    document.getElementById("EDIT_EXP").hidden = false;
  });


  $("#logout").submit(function (event) {
    event.preventDefault();

    $.ajax({
      method: "post",
      url: "/logout",
      success: function (data) {
        document.getElementById("username").value = '';
        document.getElementById("password").value = '';

        document.getElementById("all").hidden = true;
        document.getElementById("login_form").hidden = true;

        alert(data.message);
      },
      error: function (err) {
        alert(err.responseJSON.message);
      },
    });
  });





});

/* Database Fuctionalities */

