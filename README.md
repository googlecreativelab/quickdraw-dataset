# The Quick, Draw! Dataset
![preview](preview.jpg)

The Quick Draw Dataset is a collection of 50 million drawings across [345 categories](categories.md), contributed by players of the game [Quick, Draw!](https://quickdraw.withgoogle.com). The drawings were captured as timestamped vectors, tagged with metadata including what the player was asked to draw and in which country the player was located. You can browse the recognized drawings on [quickdraw.withgoogle.com/data](https://quickdraw.withgoogle.com/data).

We're sharing them here for developers, researchers, and artists to explore, study, and learn from. If you create something with this dataset, please let us know [by e-mail](mailto:quickdraw-support@google.com) or at [A.I. Experiments](https://aiexperiments.withgoogle.com/submit).

Please keep in mind that while this collection of drawings was individually moderated, it may still contain inappropriate content.

## The raw moderated dataset
The raw data is available as [`ndjson`](http://ndjson.org/) files seperated by category, in the following format: 

| Key          | Type                   | Description                                  |
| ------------ | -----------------------| -------------------------------------------- |
| key_id       | 64-bit unsigned integer| A unique identifier across all drawings.     |
| word         | string                 | Category the player was prompted to draw.    |
| recognized   | boolean                | Whether the word was recognized by the game. |
| timestamp    | datetime               | When the drawing was created.                |
| countrycode  | string                 | A two letter country code ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)) of where the player was located. |
| drawing      | string                 | A JSON array representing the vector drawing |  


Each line contains one drawing. Here's an example of a single drawing:

```javascript
  { 
    "key_id":"5891796615823360",
    "word":"nose",
    "countrycode":"AE",
    "timestamp":"2017-03-01 20:41:36.70725 UTC",
    "recognized":true,
    "drawing":[[[129,128,129,129,130,130,131,132,132,133,133,133,133,...]]]
  }
```

The format of the drawing array is as following:
 
```javascript
[ 
  [  // First stroke 
    [x0, x1, x2, x3, ...],
    [y0, y1, y2, y3, ...],
    [t0, t1, t2, t3, ...]
  ],
  [  // Second stroke
    [x0, x1, x2, x3, ...],
    [y0, y1, y2, y3, ...],
    [t0, t1, t2, t3, ...]
  ],
  ... // Additional strokes
]
```

Where `x` and `y` are the pixel coordinates, and `t` is the time in milliseconds since the first point. `x` and `y` are real-valued while `t` is an integer. The raw drawings can have vastly different bounding boxes and number of points due to the different devices used for display and input.

## Preprocessed dataset
We've preprocessed and split the dataset into different files and formats to make it faster and easier to download and explore.

#### Simplified Drawing files (`.ndjson`)
We've simplified the vectors, removed the timing information, and positioned and scaled the data into a 256x256 region. The data is exported in [`ndjson`](http://ndjson.org/) format with the same metadata as the raw format. The simplification process was:

1. Align the drawing to the top-left corner, to have minimum values of 0.
2. Uniformly scale the drawing, to have a maximum value of 255. 
3. Resample all strokes with a 1 pixel spacing.
4. Simplify all strokes using the [Ramer–Douglas–Peucker algorithm](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm) with an epsilon value of 2.0.

#### Binary files (`.bin`)
The simplified drawings and metadata are also available in a custom binary format for efficient compression and loading.

There is in example in [examples/binary_file_parser.py](examples/binary_file_parser.py) showing how to load the binary file in Python.

#### Numpy bitmaps (`.npy`)
All the simplified drawings have been rendered into a 28x28 grayscale bitmap in numpy `.npy` format. The files can be loaded with [`np.load()`](https://docs.scipy.org/doc/numpy-1.12.0/reference/generated/numpy.load.html). These images were generated from the simplified data, but are aligned to the center of the drawing's bounding box rather than the top-left corner.

## Get the data
The dataset is available on Google Cloud Storage as [`ndjson`](http://ndjson.org/) files seperated by category. See the list of files in [Cloud Console](https://console.cloud.google.com/storage/quickdraw_dataset/), or read more about [accessing public datasets](https://cloud.google.com/storage/docs/access-public-data) using other methods. 

#### Full dataset seperated by categories
- [Raw files](https://console.cloud.google.com/storage/quickdraw_dataset/full/raw) (`.ndjson`)
- [Simplified drawings files](https://console.cloud.google.com/storage/quickdraw_dataset/full/simplified) (`.ndjson`)
- [Binary files](https://console.cloud.google.com/storage/quickdraw_dataset/full/binary) (`.bin`)
- [Numpy bitmap files](https://console.cloud.google.com/storage/quickdraw_dataset/full/numpy_bitmap) (`.npy`)

#### Sketch-RNN QuickDraw Dataset

This data is also used for training the [Sketch-RNN](https://arxiv.org/abs/1704.03477) model.  An open source, TensorFlow implementation of this model will be released shortly in the [Magenta Project](https://magenta.tensorflow.org/).  You can also read more about this model in this Google Research [blog post](https://research.googleblog.com/2017/04/teaching-machines-to-draw.html).  The data is stored in compressed `.npz` files, in a format suitable for inputs into a recurrent neural network.  In this dataset, 75K samples (70K Training, 2.5K Validation, 2.5K Test) has been randomly selected from each category, processed with [RDP](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm) line simplification with an `epsilon` parameter of 2.0.

- [Numpy .npz files](https://console.cloud.google.com/storage/quickdraw_dataset/sketchrnn)

## License
This data made available by Google, Inc. under the [Creative Commons Attribution 4.0 International license.](https://creativecommons.org/licenses/by/4.0/)
