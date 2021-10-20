import cors from 'cors';

// Origin must not have a slash / at the end or else it won't work
export const allowedOrigins = ['http://localhost:3001', 'http://localhost:3002']

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowedOrigins.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      origin: allowedOrigins,
      exposedHeaders: 'access_token',
    }
  } else {
    corsOptions = {
      origin: true
    } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

export default cors(corsOptionsDelegate);
