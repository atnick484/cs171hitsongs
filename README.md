# "Can you write a hit song" Documentation
##### By Andrew Nickerson, Xavier Evans, and Chris Barber

**Note**: Since our code and data is rather space-heavy, we have kept it in GitHub for TF grading. If needed, we can resubmit our code in the .zip format.

[_Live Demo on GitHub Pages_](https://atnick484.github.io/cs171hitsongs/)
[_LVideo Demo (Google Drive)_](https://drive.google.com/drive/folders/18FLDJjwq9kbPjtrooZVVE90h0iyRZSCE?usp=sharing)

## Running Locally
To run the code, create a local server to run `index.html` after downloading a copy of the entire repository. All JavaScript and other files are included in tags within this HTML file.

## File Structure
- `index.html` contains the main HTML code used to power the web application
- `main.js` contains the main JavaScript code used
- Other JavaScript files within `/js` contain separate class code for each visualization, as well as some auxillary script code for other functions (such as searching)
- `/audio` contains 15 audio files used in the sentiment analysis visualization
- Our data is contained in two directories: `/data` and `/data_scrape`. `/data_scrape` contains data that was scraped using APIs such as the Genius Lyrics API and Spotify API, while `/data` contains mainly CSV files aggregating the scraped data used in our final website
- CSS is contained in the `/css` directory
-  `/song_data` contains JSON versions of the data, with some additional fields used in some visualizations
-  Other `.ipynb` notebooks were used for data scraping and cleaning. These files have been included in the repository.

## Data

Although there are many variations of our data for organization's sake, the following data fields are held for each song/data point:
- `song`: the title of the song
- `artist`: the name(s) of artist(s) in the song
- `url`: the Genius Lyric URL (used for scraping lyrics)
- `lyrics`: a dictionary-like structure of lyrics for the song, with keys being the part of the song (such as Verse 1 or Chorus)
- `lyrics_text`: a raw version of the lyrics (just words)
- `rank`: a dictionary where keys are dates of hitting the Billboard charts and keys are the rank of the song at that time
- `peak_rank`: a dictionary where keys are dates of hitting the Billboard charts and keys are peak rank of the song up to that time
- `weeks_on_board`: a dictionary where keys are dates of hitting the Billboard charts and keys are the number of weeks the song had been on the Billboard up to that time
- `last_week`: a dictionary where keys are dates of hitting the Billboard charts and keys are where the song was ranked during the previous week
- `genre`: a list of genres that describe the song/artist, according to Spotify's API
- `decade`: the decade of release for the song
- `release_date`: the date of release for the song
- `song_features`: a dictionary of various song features tracked by Spotify, such as "danceability" and "acousticness"
- `duration_ms`: the duration of the song in milliseconds
- `tempo`: the tempo of the song in beats per minute
- `time_signature`: the (average) number of beats per measure in the song
- `positivity`: (only tracked for a subset of songs) positivity scores for partitioned segments of the song's lyrics (between $1$ and $-1$)
