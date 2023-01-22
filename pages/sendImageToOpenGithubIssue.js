import { Octokit } from "https://cdn.skypack.dev/@octokit/core";

const a =
  "WjJsMGFIVmlYM0JoZEY4eE1VRkhURmhFU1Zrd1lsUTRlSFp1ZFVzeWVWSlVYMGx0YTJ3M1NucFpNVzF2ZDNjMmNVUkxaazh4YUdaVmNFWnlNelJtUlZaQlEyaE5XRk5WU0U1SGVWcFlSVFZRTWs5T1JWbFRkazVsTlVSTA==";
const octokit = new Octokit({
  auth: atob(atob(a)),
});

export async function sendImageToOpenGithubIssue() {
  if (asciiDiv) {
    const username = document.getElementById('username').value;
    const asciiImage = asciiDiv.elt.innerText;
    await octokit.request(
      "POST /repos/lucetre/asciify-video/actions/workflows/open-issue-on-trigger.yaml/dispatches",
      {
        ref: "main",
        inputs: {
          "username": username,
          "ascii-image": asciiImage,
        },
      }
    );
    alert(`Successfully uploaded image for '${username || "anonymous"}'`);
    console.log(asciiImage);
  } else {
    alert("Failed to post image");
  }
}
