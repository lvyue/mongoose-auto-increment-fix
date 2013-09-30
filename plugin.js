var Counter,
    mongoose,
    counterName;

this.plugin = function (schema, options) {

    var settings = {
            model: null,
            field: '_id',
            start: 0
        },
        fields = {},
        ready = false;

    switch (typeof(options)) {
        case 'String':
            settings.model = options;
            break;
        case 'Object':
            extend(settings, options);
            break;
    }

    fields[settings.field] = {
        type: Number,
        unique: true,
        require: true
    };
    schema.add(fields);

    Counter.findOne(
        { model: settings.model, field: settings.field },
        function (err, res) {
            if (!res) {
                var counter = new Counter({ model: settings.model, field: settings.field, c: options.start });
                counter.save(function () {
                    ready = true;
                });
            }
            else
                ready = true;
        }
    );

    schema.pre('save', function (next) {
        var doc = this;
        (function save() {
            if (ready) {
                Counter.collection.findAndModify(
                    { model: settings.model, field: settings.field },
                    null,
                    { $inc: { c: 1 } },
                    { new: true, upsert: true },
                    function (err, res) {
                        if (err) return next(err);
                        if (typeof(doc[settings.field]) !== 'number')
                            doc[settings.field] = res.c - 1;
                        next();
                    }
                );
            }
            else
                setTimeout(save, 5);
        })();
    });

};

this.init = function (database, counter) {
    mongoose = require('mongoose');
    counterName = counter || 'counter';

    var counterSchema = new mongoose.Schema({
        model: {
            type: String,
            require: true
        },
        field: {
            type: String,
            require: true
        },
        c: {
            type: Number,
            default: 0
        }
    });
    counterSchema.index({ field: 1, model: 1 }, { unique: true, required: true, index: -1 });
    Counter = database.model(counterName, counterSchema);
};