import { body, param, query } from 'express-validator';

// Auth validators
export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

// Announcement validators
export const announcementValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required')
];

// Prayer validators
export const prayerValidator = [
  body('content').trim().notEmpty().withMessage('Prayer content is required'),
  body('visibility').isIn(['public', 'anonymous', 'private']).withMessage('Invalid visibility option')
];

// Photo validators
export const photoValidator = [
  body('title').trim().notEmpty().withMessage('Title is required')
];

// Sermon validators
export const sermonValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('speaker').trim().notEmpty().withMessage('Speaker name is required')
];

// Event validators
export const eventValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    })
];

// MongoDB ObjectId validator
export const objectIdValidator = (paramName = 'id') => [
  param(paramName).isMongoId().withMessage('Invalid ID format')
];

// Bible query validators
export const biblePassageValidator = [
  query('ref').notEmpty().withMessage('Bible reference is required')
];

export const bibleChapterValidator = [
  query('book').notEmpty().withMessage('Book name is required'),
  query('chapter').isInt({ min: 1 }).withMessage('Valid chapter number is required')
];