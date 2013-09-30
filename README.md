# mongoose-auto-increment
This plugin allows you to auto-increment any field on any mongoose schema that you wish.

## Getting Started

> npm install mongoose-auto-increment

Once you have the plugin installed it is very simple to use. Just get reference to it and call the `plugin()` function on your schema.

    var mongoose = require('mongoose'),
        autoIncrement = require('mongoose-auto-increment');

    var bookSchema = new mongoose.Schema({
        author: { type: Schema.Types.ObjectId, ref: 'Author' },
        title: String,
        genre: String,
        publishDate: Date
    });

    bookSchema.plugin(autoIncrement, 'Book');
    mongoose.model('Book', bookSchema);

That's it. Now you can create book entities at will and the `_id` field will automatically increment with each new document.

### Want a field other than `_id`?

Let's say you have a field called `sortOrder` and you'd like to increment that instead of `_id`.

    bookSchema.plugin(autoIncrement, { model: 'Book', field: 'sortOrder' });

Can't get much simpler than that!

### Want to start the field value at a different number than zero or increment by more than one?

Let's say for some reason you want to start counting from 100 and you want to increment by 100 each time as well.

    bookSchema.plugin(autoIncrement, { model: 'Book', startAt: 100, incrementBy: 100 });

Your first book document would have an `_id` equal to `100`. Your second book document would have an `_id` equal to `200`, and so on.