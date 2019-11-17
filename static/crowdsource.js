var githubHandle = "";

var populateQuestionDetails = function(response) {
  $("#crowdsource-form").attr({"data-question-id": response["question_id"]});
  $('#crowdsource-question').html(response["question_content"]);
};


$(document).ready(function() {
  $.ajax({
    url: "/get_answers_list",
    method: "GET",
    success: function(response) {
      var $content = $('#crowdsource-form-content');
      $.each(response, function(val, display) {
        $content.append('<p class="crowdsource-list-item"><label><input name="answer_value" type="radio" value="' + val + '" required/><span>' + display + '</span></label></p>');
      });
    }
  });

  document.getElementById("github-handle").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      document.getElementById("submit-github-handle").click();
    }
  });

  $("#submit-github-handle").on('click', function() {
    githubHandle = $("#github-handle").val();
    if (!githubHandle) { // Todo check for valid handles
      console.log("Invalid github handle");
      return;
    }
    console.log(githubHandle);
    $("#github-handle-div").fadeOut();
    $.ajax({
      url: "/get_next_problem",
      method: "GET",
      data: {handle: githubHandle},
      contentType: 'application/json',
      success: function(response) {
        populateQuestionDetails(response);
        setTimeout(function() {
          $("#questions-complete-div").fadeIn()
        }, 500);
      }
    });
  });

  $(document).on("change", "input[type=radio][name=answer_value]", function() {
    if (!githubHandle) {
      M.toast({html: 'Please enter your Github handle!'});
      return;
    }
    $.ajax({
      url: '/submit_vote',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({question_id: $('#crowdsource-form').data()["questionId"], handle: githubHandle}),
      success: function(response) {
        $("#questions-complete-div").fadeOut();
        setTimeout(function() {
          populateQuestionDetails(response);
          $('#crowdsource-form').trigger('reset');
          $("#questions-complete-div").fadeIn();
        }, 500);
      },
      error: function(err) {
        console.log(err);
        M.toast({html: 'Something went wrong!'});
      }
    })
  });
});
