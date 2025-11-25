import axios from 'axios';
import { validationResult } from 'express-validator';
import asyncHandler from '../middleware/asyncHandler.js';

// Bible API base configuration
const BIBLE_API_BASE = process.env.BIBLE_API_BASE_URL || 'https://api.scripture.api.bible/v1';
const BIBLE_API_KEY = process.env.BIBLE_API_KEY;

// Default Bible version (can be customized)
const DEFAULT_BIBLE_ID = 'de4e12af7f28f599-02'; // KJV

// Helper function to make Bible API requests
const makeBibleRequest = async (endpoint) => {
  try {
    const response = await axios.get(`${BIBLE_API_BASE}${endpoint}`, {
      headers: {
        'api-key': BIBLE_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Bible API request failed');
  }
};

// @desc    Get Bible passage
// @route   GET /api/bible/passage?ref=John+3:16
// @access  Public
export const getPassage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { ref, version } = req.query;
  const bibleId = version || DEFAULT_BIBLE_ID;

  if (!BIBLE_API_KEY) {
    return res.status(500).json({
      success: false,
      message: 'Bible API key not configured'
    });
  }

  try {
    // Search for the passage
    const searchData = await makeBibleRequest(
      `/bibles/${bibleId}/search?query=${encodeURIComponent(ref)}`
    );

    if (!searchData.data || !searchData.data.verses || searchData.data.verses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Passage not found'
      });
    }

    // Get the first verse reference
    const verseId = searchData.data.verses[0].id;
    
    // Fetch the full passage
    const passageData = await makeBibleRequest(
      `/bibles/${bibleId}/passages/${verseId}`
    );

    res.json({
      success: true,
      data: {
        reference: passageData.data.reference,
        content: passageData.data.content,
        copyright: passageData.data.copyright
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching Bible passage'
    });
  }
});

// @desc    Get Bible chapter
// @route   GET /api/bible/chapter?book=John&chapter=1
// @access  Public
export const getChapter = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { book, chapter, version } = req.query;
  const bibleId = version || DEFAULT_BIBLE_ID;

  if (!BIBLE_API_KEY) {
    return res.status(500).json({
      success: false,
      message: 'Bible API key not configured'
    });
  }

  try {
    // Search for the chapter
    const searchQuery = `${book} ${chapter}`;
    const searchData = await makeBibleRequest(
      `/bibles/${bibleId}/search?query=${encodeURIComponent(searchQuery)}`
    );

    if (!searchData.data || !searchData.data.verses || searchData.data.verses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    // Extract chapter ID from the first verse
    const verseId = searchData.data.verses[0].id;
    const chapterId = verseId.split('.')[0]; // Get chapter part before the verse

    // Fetch the full chapter
    const chapterData = await makeBibleRequest(
      `/bibles/${bibleId}/chapters/${chapterId}`
    );

    res.json({
      success: true,
      data: {
        reference: chapterData.data.reference,
        content: chapterData.data.content,
        copyright: chapterData.data.copyright
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching Bible chapter'
    });
  }
});