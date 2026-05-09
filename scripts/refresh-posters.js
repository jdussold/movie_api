/**
 * Refresh each movie's ImagePath from TMDB.
 *
 * Usage:
 *   node scripts/refresh-posters.js [--dry-run]
 *
 * Env:
 *   CONNECTION_URI  MongoDB connection string (same as the running app)
 *   TMDB_API_KEY    TMDB v3 API key (https://www.themoviedb.org/settings/api)
 *
 * --dry-run prints proposed changes without writing to MongoDB.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Models = require("../models");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_SEARCH = "https://api.themoviedb.org/3/search/movie";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const DRY_RUN = process.argv.includes("--dry-run");

if (!TMDB_API_KEY) {
  console.error(
    "TMDB_API_KEY not set. Get one at https://www.themoviedb.org/settings/api"
  );
  process.exit(1);
}
if (!process.env.CONNECTION_URI) {
  console.error("CONNECTION_URI not set in .env");
  process.exit(1);
}

async function fetchPoster(title) {
  const url = `${TMDB_SEARCH}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
    title
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  const data = await res.json();
  const first = data.results?.[0];
  return first?.poster_path ? `${POSTER_BASE}${first.poster_path}` : null;
}

async function main() {
  await mongoose.connect(process.env.CONNECTION_URI);

  const Movies = Models.Movie;
  const movies = await Movies.find({}).lean();
  console.log(`Found ${movies.length} movies${DRY_RUN ? " (DRY RUN)" : ""}\n`);

  let updated = 0;
  let unchanged = 0;
  let missed = 0;
  let errored = 0;

  for (const movie of movies) {
    try {
      const newUrl = await fetchPoster(movie.Title);
      if (!newUrl) {
        console.warn(`! No TMDB result: ${movie.Title}`);
        missed++;
      } else if (newUrl === movie.ImagePath) {
        unchanged++;
      } else {
        console.log(`✓ ${movie.Title}`);
        console.log(`    old: ${movie.ImagePath}`);
        console.log(`    new: ${newUrl}`);
        if (!DRY_RUN) {
          await Movies.updateOne(
            { _id: movie._id },
            { $set: { ImagePath: newUrl } }
          );
        }
        updated++;
      }
    } catch (err) {
      console.error(`✗ ${movie.Title}: ${err.message}`);
      errored++;
    }
    // Be polite to TMDB rate limits
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(
    `\nDone. Updated: ${updated}, Unchanged: ${unchanged}, No match: ${missed}, Errors: ${errored}`
  );
  if (DRY_RUN) console.log("(dry run — no changes were written)");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
