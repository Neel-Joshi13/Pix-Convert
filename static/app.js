const uploadArea =
    document.getElementById("uploadArea");

const imageInput =
    document.getElementById("imageInput");

const chooseButton =
    document.getElementById("chooseButton");

const previewContainer =
    document.getElementById("previewContainer");

const convertButton =
    document.getElementById("convertButton");

const format =
    document.getElementById("format");

const quality =
    document.getElementById("quality");

const qualityValue =
    document.getElementById("qualityValue");

const status =
    document.getElementById("status");


const clearButton =
    document.getElementById("clearButton");

const fileSection =
    document.getElementById("fileSection");

const fileCount =
    document.getElementById("fileCount");

const progressBox =
    document.getElementById("progressBox");

const progressBar =
    document.getElementById("progressBar");

const progressPercent =
    document.getElementById("progressPercent");

const successBox =
    document.getElementById("successBox");


let selectedFiles = [];


chooseButton.addEventListener(
    "click",
    function () {

        imageInput.click();

    }
);


imageInput.addEventListener(
    "change",
    function () {

        addFiles(imageInput.files);

        imageInput.value = "";

    }
);


uploadArea.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        uploadArea.classList.add(
            "dragging"
        );

    }
);


uploadArea.addEventListener(
    "dragleave",
    function () {

        uploadArea.classList.remove(
            "dragging"
        );

    }
);


uploadArea.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        uploadArea.classList.remove(
            "dragging"
        );


        addFiles(
            event.dataTransfer.files
        );

    }
);


function addFiles(files) {

    for (const file of files) {

        if (!file.type.startsWith("image/")) {

            continue;

        }

        const alreadyAdded =
            selectedFiles.some(
                existingFile =>
                    existingFile.name === file.name &&
                    existingFile.size === file.size
            );


        if (!alreadyAdded) {

            selectedFiles.push(file);

        }

    }


    showPreviews();

}


function showPreviews() {

    previewContainer.innerHTML = "";

    fileSection.classList.toggle(
        "has-files",
        selectedFiles.length > 0
    );

    fileCount.textContent =
        `${selectedFiles.length} ${
            selectedFiles.length === 1
                ? "file"
                : "files"
        }`;


    selectedFiles.forEach(
        function (file, index) {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "preview-card";


                    card.innerHTML = `

                        <div class="image-wrapper">

                            <img
                                src="${event.target.result}"
                                alt="${escapeHtml(file.name)}"
                            >

                            <button
                                type="button"
                                class="remove-button"
                                onclick="removeFile(${index})"
                                title="Remove image"
                            >
                                ×
                            </button>

                        </div>


                        <div class="preview-info">

                            <strong>
                                ${escapeHtml(file.name)}
                            </strong>

                            <span>
                                ${formatFileSize(file.size)}
                            </span>

                        </div>

                    `;


                    previewContainer.appendChild(
                        card
                    );

                };


            reader.readAsDataURL(file);

        }
    );


    updateStatus();

}


function removeFile(index) {

    selectedFiles.splice(
        index,
        1
    );


    successBox.classList.remove(
        "show"
    );


    progressBox.classList.remove(
        "show"
    );


    showPreviews();

}


clearButton.addEventListener(
    "click",
    function () {

        selectedFiles = [];


        previewContainer.innerHTML = "";


        fileSection.classList.remove(
            "has-files"
        );


        fileCount.textContent =
            "0 files";


        successBox.classList.remove(
            "show"
        );


        progressBox.classList.remove(
            "show"
        );


        progressBar.style.width =
            "0%";


        progressPercent.textContent =
            "0%";


        updateStatus();

    }
);


function formatFileSize(bytes) {

    if (bytes < 1024) {

        return `${bytes} B`;

    }


    if (bytes < 1024 * 1024) {

        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;

    }


    return `${(
        bytes / (1024 * 1024)
    ).toFixed(1)} MB`;

}


function escapeHtml(value) {

    return value.replace(
        /[&<>"']/g,
        function (character) {

            const entities = {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            };


            return entities[
                character
            ];

        }
    );

}


function updateStatus() {

    if (selectedFiles.length === 0) {

        status.innerHTML = `
            <span class="status-icon">
                ●
            </span>
            No images selected.
        `;


        convertButton.disabled =
            true;

        return;

    }


    status.innerHTML = `
        <span class="status-icon">
            ●
        </span>
        ${selectedFiles.length}
        ${
            selectedFiles.length === 1
                ? "image"
                : "images"
        }
        selected.
    `;


    convertButton.disabled =
        false;

}

quality.addEventListener(
    "input",
    function () {

        qualityValue.textContent =
            `${quality.value}%`;

    }
);


format.addEventListener(
    "change",
    function () {

        successBox.classList.remove(
            "show"
        );

        status.innerHTML = `
            <span class="status-icon">
                ●
            </span>
            Ready to convert to
            ${format.value}.
        `;

    }
);


convertButton.addEventListener(
    "click",
    async function () {

        if (selectedFiles.length === 0) {

            return;

        }


        const formData =
            new FormData();


        selectedFiles.forEach(
            function (file) {

                formData.append(
                    "images",
                    file
                );

            }
        );


        formData.append(
            "format",
            format.value
        );


        formData.append(
            "quality",
            quality.value
        );


        convertButton.disabled =
            true;


        successBox.classList.remove(
            "show"
        );


        progressBox.classList.add(
            "show"
        );


        progressBar.style.width =
            "0%";


        progressPercent.textContent =
            "0%";


        status.innerHTML = `
            <span class="status-icon">
                ●
            </span>
            Preparing images...
        `;


        let progress = 0;


        const progressTimer =
            setInterval(
                function () {

                    progress += 5;


                    if (progress >= 90) {

                        progress = 90;

                        clearInterval(
                            progressTimer
                        );

                    }


                    progressBar.style.width =
                        progress + "%";


                    progressPercent.textContent =
                        progress + "%";


                    if (progress < 40) {

                        status.innerHTML = `
                            <span class="status-icon">
                                ●
                            </span>
                            Preparing images...
                        `;

                    }
                    else if (progress < 75) {

                        status.innerHTML = `
                            <span class="status-icon">
                                ●
                            </span>
                            Converting images...
                        `;

                    }
                    else {

                        status.innerHTML = `
                            <span class="status-icon">
                                ●
                            </span>
                            Finalizing conversion...
                        `;

                    }

                },
                80
            );


        try {

            const response =
                await fetch(
                    "/convert",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            if (!response.ok) {

                let message =
                    "Conversion failed.";


                try {

                    const data =
                        await response.json();


                    if (data.error) {

                        message =
                            data.error;

                    }

                }
                catch {

                }


                throw new Error(
                    message
                );

            }
            

            const blob =
                await response.blob();


            const url =
                window.URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;


            if (selectedFiles.length === 1) {

                link.download =
                    `converted-image.${getExtension(
                        format.value
                    )}`;

            }
            else {

                link.download =
                    "converted-images.zip";

            }


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


            window.URL.revokeObjectURL(
                url
            );


            clearInterval(
                progressTimer
            );


            progressBar.style.width =
                "100%";


            progressPercent.textContent =
                "100%";


            status.innerHTML = `
                <span class="status-icon">
                    ✓
                </span>
                Conversion completed successfully.
            `;


            setTimeout(
                function () {

                    progressBox.classList.remove(
                        "show"
                    );


                    successBox.classList.add(
                        "show"
                    );

                },
                400
            );

        }


        catch (error) {

            clearInterval(
                progressTimer
            );


            progressBox.classList.remove(
                "show"
            );


            successBox.classList.remove(
                "show"
            );


            status.innerHTML = `
                <span class="status-icon">
                    ✕
                </span>
                Error: ${escapeHtml(
                    error.message
                )}
            `;

        }


        finally {

            convertButton.disabled =
                selectedFiles.length === 0;

        }

    }
);


function getExtension(
    format
) {

    const extensions = {

        JPEG: "jpg",

        PNG: "png",

        WEBP: "webp",

        BMP: "bmp",

        GIF: "gif",

        TIFF: "tiff"

    };


    return extensions[
        format
    ] || "jpg";

}