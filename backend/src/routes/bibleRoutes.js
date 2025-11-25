import express from 'express';
import { getPassage, getChapter } from '../controllers/bibleController.js';
import { biblePassageValidator, bibleChapterValidator } from '../utils/validators.js';

const router = express.Router();

router.get('/passage', biblePassageValidator, getPassage);
router.get('/chapter', bibleChapterValidator, getChapter);

export default router;