const formatOptions = {
    images: ['jpeg', 'jpg', 'png', 'webp', 'gif', 'tiff', 'tif', 'heic', 'heif', 'svg', 'jxl'],
    documents: ['pdf', 'docx', 'txt', 'svg'],
    audio: ['mp3', 'wav', 'flac'],
    video: ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'gif', '3gp', 'mpeg'],
    archives: ['zip', 'rar', 'tar'],
    spreadsheets: ['xlsx', 'csv'],
    presentations: ['pptx', 'pdf'],
};

const getFileCategory = (fileFormat, targetFormat = null) => {
    if (fileFormat === 'gif' && targetFormat && formatOptions.video.includes(targetFormat)) {
        return 'video';
    }

    if (formatOptions.images.includes(fileFormat)) {
        return 'images';
    } else if (formatOptions.documents.includes(fileFormat)) {
        return 'documents';
    } else if (formatOptions.audio.includes(fileFormat)) {
        return 'audio';
    } else if (formatOptions.video.includes(fileFormat)) {
        return 'video';
    } else if (formatOptions.archives.includes(fileFormat)) {
        return 'archives';
    } else if (formatOptions.spreadsheets.includes(fileFormat)) {
        return 'spreadsheets';
    } else if (formatOptions.presentations.includes(fileFormat)) {
        return 'presentations';
    }
    return 'unknown';
};

const getAvailableOutputFormats = (fileCategory, excludeFormat) => {
    const availableFormats = formatOptions[fileCategory] || [];
    return availableFormats.filter(format => format.toLowerCase() !== excludeFormat.toLowerCase());
};

export {getFileCategory, getAvailableOutputFormats};