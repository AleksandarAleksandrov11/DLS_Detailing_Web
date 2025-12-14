async function uploadImages(files) {
    const uploadedUrls = [];

    for (let file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "dls_upload");

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/dxdrcjwgl/image/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();
        uploadedUrls.push(data.secure_url);
    }

    return uploadedUrls;
}
