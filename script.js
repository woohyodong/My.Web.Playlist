$(function() {
    $("#media-list").sortable();
    $("#media-list").disableSelection();
});

const mediaFilesInput = document.getElementById("media-files");
const mediaList = document.getElementById("media-list");
const mediaControl = document.getElementById("media-control");
const addFilesBtn = document.getElementById("add-files");
let currentPlayer = null;
let mediaFiles = [];

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
    mediaControl.appendChild(currentPlayer); // 현재 플레이어 추가
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
        <section>
        <button data-index="${index}" class="btn pup ${file.type.startsWith("audio/") ? "none" : ""}">Pop</button>
        <button data-index="${index}" class="btn play">Play</button>
        </section>
    `;
    item.querySelector("a.btn-link").onclick = function () {
        removeFile(index);
    };

    item.querySelector("button.pup").onclick = function () {
        openFullscreen(index);
    };    

    item.querySelector("button.play").onclick = function () {

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


let popupWindow = null;
function openFullscreen(index) {

    let file = mediaFiles[index];
    let url = URL.createObjectURL(file);
    let width = 400;
    let height = 300;
    let left = (screen.width/2)-(width/2);
    let top = (screen.height/2)-(height/2);
    
    if (popupWindow != null && !popupWindow.closed) popupWindow.window.close();

    popupWindow = window.open("", "newWindow", `width=${width},height=${height},top=${top},left=${left}`);    
    popupWindow.document.write(`<video controls autoplay src="${url}" style="width: 100%; height: 100%; object-fit: cover;"></video>`);
    popupWindow.focus();
}