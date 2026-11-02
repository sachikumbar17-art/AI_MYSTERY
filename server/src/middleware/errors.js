export function notFound(_req, res) { res.status(404).json({ success: false, message: 'The requested case file was not found.', code: 'NOT_FOUND' }); }
export function errorHandler(error, _req, res, _next) {
  if (error?.name === 'CastError') return res.status(404).json({ success: false, message: 'The requested case file was not found.', code: 'NOT_FOUND' });
  if (error?.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Some case details were invalid.', code: 'VALIDATION_ERROR' });
  const status = error.status || 500;
  if (status >= 500) console.error(error.message);
  return res.status(status).json({ success: false, message: status >= 500 && !error.status ? 'Unable to process request. Please try again.' : error.message, code: error.code || 'REQUEST_ERROR' });
}
