var el = x => document.getElementById(x);

function showPicker() {
  el("file-input").click();
}

function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();
  reader.onload = function(e) {
    el("image-picked").src = e.target.result;
    el("image-picked").className = "";
  };
  reader.readAsDataURL(input.files[0]);
}

function analyze() {
  console.log("click");
  const url = el("url-input").value;
  console.log(url);
  if (url && url.length > 0) return analyzeURL(url)
  var uploadFiles = el("file-input").files;
  if (uploadFiles.length !== 1) alert("Please select a file to analyze!");

  el("analyze-button").innerHTML = "Analyzing...";
  var xhr = new XMLHttpRequest();
  var loc = window.location;
  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`,
    true);
  xhr.onerror = function() {
    alert(xhr.responseText);
  };
  xhr.onload = function(e) {
    if (this.readyState === 4) {
      var response = JSON.parse(e.target.responseText);
      el("result-label").innerHTML = `Result = ${response["result"]}`;
      el("result-label-probabilities").innerHTML = `Probabilities = ${data  ["probabilities"]}`
    }
    el("analyze-button").innerHTML = "Analyze";
  };

  var fileData = new FormData();
  fileData.append("file", uploadFiles[0]);
  xhr.send(fileData);
}

function analyzeURL(url) {
  el("analyze-button").innerHTML = "Analyzing...";
  var xhr = new XMLHttpRequest();
  console.log("rg1")
  var loc = window.location;
  console.log("rg2")
  const res = fetch(`${loc.protocol}//${loc.hostname}:${loc.port}/classify-url?url=${url}`, {method: "POST"})
                   .then(res => res.json())
                   .then(data => { 
                     el("result-label").innerHTML = `Result = ${data["result"]}`
                     el("result-label-probabilities").innerHTML = `Probabilities = ${data["probabilities"]}`
                     el("analyze-button").innerHTML = "Analyze";
                   })
}
