$(function() {
    $("#media-list").sortable();
    $("#media-list").disableSelection();
});

const mediaFilesInput = document.getElementById("media-files");
const mediaList = document.getElementById("media-list");
const mediaControl = document.getElementById("media-control");
let currentPlayer = null;
let mediaFiles = [];
const addFilesBtn = document.getElementById("add-files");

mediaFilesInput.onchange = function () {
    addFiles(this.files);
};

function addFiles(files) {
    mediaFiles = [...mediaFiles, ...files];
    updateFileList();
}

function removeFile(index) {
    mediaFiles.splice(index,1);
    updateFileList();
}

function playMedia(index) {
    const file = mediaFiles[index];
    const url = URL.createObjectURL(file);
    mediaControl.innerHTML = "";

    if (currentPlayer) {
    currentPlayer.pause();
    currentPlayer.remove();
    URL.revokeObjectURL(currentPlayer.src);
    }

    if (file.type.startsWith("audio/")) {
    currentPlayer = new Audio(url);
    } else if (file.type.startsWith("video/")) {
    currentPlayer = document.createElement("video");
    currentPlayer.src = url;
    }

    if (currentPlayer) {
    currentPlayer.controls = true; // 컨트롤 속성 추가
    mediaControl.appendChild(currentPlayer); // 현재 플레이어를 문서에 추가
    currentPlayer.play();
    }
}    


function updateFileList() {
    mediaList.innerHTML = "";

    mediaFiles.forEach((file, index) => {
    //console.log(file);
    const item = document.createElement("li");
    item.className = "media-item";
    item.innerHTML = `
        <section>
        <a href="javascript:;" data-index="${index}" class="btn-link danger">[삭제]</a>
        <label>${file.name}</label>
        </section>        
        <button data-index="${index}" class="btn">Play</button>
    `;
    item.querySelector("a.btn-link").onclick = function () {
        removeFile(index);
    };

    item.querySelector("button").onclick = function () {

        document.querySelectorAll(".media-item").forEach((element) => {
        element.classList.remove("selected");
        });
        item.classList.add("selected");
        playMedia(index);
    };
    mediaList.appendChild(item);
    });
}

addFilesBtn.onclick = function () {
    mediaFilesInput.click();
};



document.body.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(mediaList.childElementCount < 1) mediaFilesInput.click();
});    

document.body.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.add("dragover");
});

document.body.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.remove("dragover");
    const files = Array.from(e.dataTransfer.files);
        const acceptedFiles = files.filter(
        (file) => file.type.startsWith("audio") || file.type.startsWith("video")
        );
        addFiles(acceptedFiles);
});