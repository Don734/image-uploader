document.addEventListener('DOMContentLoaded', Init());

function Init() {
    let droparea = document.querySelector('.card-start__dropArea'),
        inputElement = document.querySelector('.card-start__choose');

    droparea.addEventListener('dragenter', dragEnter);
    droparea.addEventListener('dragover', dragOver);
    droparea.addEventListener('drop', drop);
    inputElement.addEventListener('change', imageShow);
    inputElement.addEventListener('change', handleFiles);
}

function dragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
}

function dragOver(e) {
    e.preventDefault();
    e.stopPropagation();
}

function drop(e) {
    e.preventDefault();
    e.stopPropagation();

    let files = e.dataTransfer.files;
    imageDropShow(files);
    handleFilesDrop(files);
}

function imageShow() {
    let copyBtn = document.querySelector('.card-successfully__copy-btn');
    let reader = new FileReader()

    if (this.files[0]) {
        let link = document.querySelector('.card-successfully__link');
        link.textContent = window.origin + `/user_img/${this.files[0].name}`;
        copyBtn.addEventListener('click', function () {

            copyToClipboard(link.textContent);
        });
        reader.onload = function (e) {
            document.querySelector('.user-img').setAttribute('src', e.target.result);
        }
        reader.readAsDataURL(this.files[0])
    }
}

function imageDropShow(files) {
    let copyBtn = document.querySelector('.card-successfully__copy-btn');
    let reader = new FileReader()

    if (files[0]) {
        let link = document.querySelector('.card-successfully__link');
        link.textContent = window.origin + `/user_img/${files[0].name}`;
        copyBtn.addEventListener('click', function () {
            copyToClipboard(link.textContent);
        })
        reader.onload = function (e) {
            document.querySelector('.user-img').setAttribute('src', e.target.result);
        }
        reader.readAsDataURL(files[0])
    }
}

function handleFiles() {
    let fileList = this.files,
        fileType = fileList[0].type;

    if (fileType == 'image/jpeg' || fileType == 'image/png') {
        startProgress();
        uploadFile(fileList[0])
    }
}

function handleFilesDrop(files) {
    let fileList = files,
        fileType = fileList[0].type;

    if (fileType == 'image/jpeg' || fileType == 'image/png') {
        startProgress();
        uploadFile(files[0])
    }
}

function startProgress() {
    let startPopup = document.querySelector('.card-start'),
        uploadPopup = document.querySelector('.card-upload');

    startPopup.classList.add('hide');
    uploadPopup.classList.add('active')
}

function progressSuccessfully() {
    let uploadPopup = document.querySelector('.card-upload'),
        successfullyPopup = document.querySelector('.card-successfully');

    uploadPopup.classList.remove('active');
    successfullyPopup.classList.add('active');
}

function uploadFile(file) {
    let formData = new FormData();

    formData.append('file', file);

    let formReq = new XMLHttpRequest();
    formReq.open("POST", "processForm.php", true);
    formReq.onload = function (e) {
        if (formReq.status == 200) {
            progressSuccessfully();
        } else {
            alert('Ошибка!');
        }
    }

    formReq.send(formData);
}

function copyToClipboard(text) {
    document.querySelector('.card-successfully__block').classList.add('copy');
    
    if (window.ClipboardData && window.ClipboardData.setData) {
        return ClipboardData.setData("Text", text);
    } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        let textarea = document.createElement('textarea');
        textarea.textContent = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();

        try {
            return document.execCommand("copy");
        } catch (ex) {
            console.warn('Ошибка в копировании.', ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}