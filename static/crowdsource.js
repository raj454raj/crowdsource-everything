var githubHandle = "";

$(document).ready(function() {
  $("#submit-github-handle").on('click', function() {
    githubHandle = $("#github-handle").val();
    if (!githubHandle) { // Todo check for valid handles
      console.log("Invalid github handle");
      return;
    }
    console.log(githubHandle);
  });
});
