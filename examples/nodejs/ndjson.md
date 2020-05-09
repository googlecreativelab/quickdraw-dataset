# Quick, Draw! ndjson data

The [Quick, Draw! dataset](https://github.com/googlecreativelab/quickdraw-dataset) uses
[ndjson](https://github.com/maxogden/ndjson) as one of the formats to store its millions of drawings.

We can use the [ndjson-cli](https://github.com/mbostock/ndjson-cli) utility to quickly create interesting subsets of this dataset.

The drawings (stroke data and associated metadata) are stored as one JSON object per line. e.g.:
```js
{
  "key_id":"5891796615823360",
  "word":"nose",
  "countrycode":"AE",
  "timestamp":"2017-03-01 20:41:36.70725 UTC",
  "recognized":true,
  "drawing":[[[129,128,129,129,130,130,131,132,132,133,133,133,133,...]]]
}
```

Each file represents all of the drawings for a given word. So, you can download the one you want.
For this exploration we will focus on the [simplified drawings](https://pantheon.corp.google.com/storage/browser/quickdraw_dataset/full/simplified)
because the files are about 10x smaller and the drawings look just as good.
We do lose timing information available in the raw data, so feel free to explore that when you are comfortable navigating the data (the format is pretty much exactly the same besides the added timing array and more points in the stroke data.)

# Let's explore the `face` collection!

One nice thing that you can do with `.ndjson` files are to quickly peek at the data using some simple Unix commands:

```bash
# look at the first 5 lines
cat face.ndjson | head -n 5
# look at the last 5 lines
cat face.ndjson | tail -n 5
```

## Filtering

Now let's take our first subset of the data by filtering:
```bash
# let's filter down to only the recognized drawings
cat face.ndjson | ndjson-filter 'd.recognized == true' | head -n 5
# How many recognized drawings are there?
cat face.ndjson | ndjson-filter 'd.recognized == true' | wc -l
# How about unrecognized?
cat face.ndjson | ndjson-filter 'd.recognized == false' | wc -l

# We can also filter down to a country we are interested in
cat face.ndjson | ndjson-filter 'd.recognized == true && d.countrycode == "CA"' | wc -l
```

## Sorting

For sorting, you can make things easier by including d3. This means you'll need to `npm install d3` in the directory from which you are calling these commands.
```bash
# sort by when the drawing was created
cat face.ndjson | ndjson-sort -r d3 'd3.ascending(a.timestamp, b.timestamp)' | head -n 5

# sort from the most complex drawings to the simplest (judged by how many strokes they use to draw)
cat face.ndjson | ndjson-sort -r d3 'd3.descending(a.drawing.length, b.drawing.length)' | head -n 5
```

## Saving to JSON
If you want to save out a subset as a regular JSON file, you can use `ndjson-reduce`:
```bash
# save to the file "canadian-faces.json"
cat face.ndjson | ndjson-filter 'd.recognized == true && d.countrycode == "CA"' | ndjson-reduce > canadian-faces.json

# You can combine these utilities to further filter down your data
cat face.ndjson | ndjson-filter 'd.recognized == true && d.countrycode == "CA"' | head -n 1000 | ndjson-reduce > canadian-faces.json

cat face.ndjson | ndjson-filter 'd.recognized == true && d.countrycode == "CA"' | ndjson-sort -r d3 'd3.descending(a.drawing.length, b.drawing.length)' | head -n 100 | ndjson-reduce > complex-faces.json
```
