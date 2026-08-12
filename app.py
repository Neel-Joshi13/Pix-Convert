from flask import Flask, render_template, request, send_file, jsonify
from PIL import Image
from pathlib import Path
import uuid
import zipfile


app = Flask(__name__)


BASE_DIR = Path(__file__).resolve().parent

OUTPUT_FOLDER = BASE_DIR / "converted"

OUTPUT_FOLDER.mkdir(exist_ok=True)


ALLOWED_FORMATS = {
    "JPEG": "jpg",
    "PNG": "png",
    "WEBP": "webp",
    "BMP": "bmp",
    "GIF": "gif",
    "TIFF": "tiff",
}


@app.route("/")
def home():

    return render_template("index.html")


@app.route("/convert", methods=["POST"])
def convert():

    files = request.files.getlist("images")

    output_format = request.form.get(
        "format",
        "JPEG"
    ).upper()

    quality = request.form.get(
        "quality",
        "80"
    )


    if output_format not in ALLOWED_FORMATS:

        return jsonify({
            "error": "Unsupported image format."
        }), 400


    try:

        quality = int(quality)

    except ValueError:

        quality = 80


    quality = max(
        10,
        min(100, quality)
    )


    files = [
        file
        for file in files
        if file and file.filename
    ]


    if not files:

        return jsonify({
            "error": "Please select at least one image."
        }), 400


    conversion_id = uuid.uuid4().hex

    conversion_folder = (
        OUTPUT_FOLDER / conversion_id
    )

    conversion_folder.mkdir(
        parents=True,
        exist_ok=True
    )


    converted_files = []


    for file in files:

        try:

            image = Image.open(file)

            image.load()

            original_name = Path(
                file.filename
            ).stem

            safe_name = "".join(
                character
                for character in original_name
                if character.isalnum()
                or character in (
                    " ",
                    "-",
                    "_"
                )
            ).strip()


            if not safe_name:

                safe_name = "converted-image"


            extension = ALLOWED_FORMATS[
                output_format
            ]


            output_filename = (
                f"{safe_name}.{extension}"
            )


            output_path = (
                conversion_folder /
                output_filename
            )


            if output_format == "JPEG":

                image = image.convert("RGB")

                image.save(
                    output_path,
                    "JPEG",
                    quality=quality,
                    optimize=True
                )


            elif output_format == "WEBP":

                image.save(
                    output_path,
                    "WEBP",
                    quality=quality,
                    method=6
                )


            elif output_format == "PNG":

                image.save(
                    output_path,
                    "PNG",
                    optimize=True
                )


            elif output_format == "GIF":

                if image.mode not in (
                    "P",
                    "L"
                ):

                    image = image.convert(
                        "P",
                        palette=Image.Palette.ADAPTIVE
                    )


                image.save(
                    output_path,
                    "GIF"
                )


            elif output_format == "BMP":

                if image.mode not in (
                    "RGB",
                    "RGBA"
                ):

                    image = image.convert(
                        "RGB"
                    )


                image.save(
                    output_path,
                    "BMP"
                )


            elif output_format == "TIFF":

                image.save(
                    output_path,
                    "TIFF"
                )


            converted_files.append(
                output_path
            )


        except Exception as error:

            return jsonify({
                "error":
                    f"Could not convert "
                    f"{file.filename}: {error}"
            }), 400


    if not converted_files:

        return jsonify({
            "error": "No images were converted."
        }), 400


    if len(converted_files) == 1:

        output_file = converted_files[0]

        return send_file(
            output_file,
            as_attachment=True,
            download_name=output_file.name
        )


    zip_path = (
        OUTPUT_FOLDER /
        f"{conversion_id}.zip"
    )


    with zipfile.ZipFile(
        zip_path,
        "w",
        compression=zipfile.ZIP_DEFLATED
    ) as zip_file:

        for file_path in converted_files:

            zip_file.write(
                file_path,
                arcname=file_path.name
            )


    return send_file(
        zip_path,
        as_attachment=True,
        download_name="converted-images.zip"
    )


if __name__ == "__main__":

    app.run(
        debug=True
    )