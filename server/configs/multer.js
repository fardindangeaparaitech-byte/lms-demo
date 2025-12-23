import multer from "multer";

// ✅ File storage configure karo
const storage = multer.diskStorage({})

// ✅ Multer instance create karo
const upload = multer({ storage })

export default upload