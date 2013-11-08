var async = require('async'),
    should = require('chai').should(),
    mongoose = require('mongoose'),
    autoIncrement = require('..'),
    db;

before(function (done) {
    db = mongoose.createConnection('mongodb://127.0.0.1/mongoose-auto-increment-test');
    db.on('error', console.error.bind(console));
    db.once('open', function () {
        autoIncrement.initialize(db);
        done();
    });
});

after(function (done) {
    db.db.executeDbCommand({ ropDatabase: 1 }, function () {
        db.close(done);
    });
});

afterEach(function (done) {
    db.model('User').collection.drop(function () {
        delete db.models.User;
        return db.model('Mongoose-Auto-Increment').collection.drop(done);
    });
});

describe('mongoose-auto-increment', function () {

//    it('should increment the _id field on save', function (done) {
//
//        var userSchema = new mongoose.Schema({
//            name: String,
//            dept: String
//        });
//        userSchema.plugin(autoIncrement.plugin, 'User');
//        var User = db.model('User', userSchema);
//
//        var user = new User({ name: 'Charlie', dept: 'Support' });
//        user.save(function (err) {
//            should.not.exists(err);
//            user._id.should.eql(0);
//
//            var user2 = new User({ name: 'Charlene', dept: 'Marketing' });
//            user2.save(function (err) {
//                should.not.exists(err);
//                user2._id.should.eql(1);
//                done();
//            });
//        });
//
//    });
//
//    it('should increment the specified field instead (Test 2)', function(done) {
//
//        var userSchema = new mongoose.Schema({
//            name: String,
//            dept: String
//        });
//        userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'userId' });
//        var User = db.model('User', userSchema);
//
//        var user = new User({ name: 'Charlie', dept: 'Support' });
//        user.save(function(err) {
//            should.not.exists(err);
//            user.userId.should.eql(0);
//
//            var user2 = new User({ name: 'Charlene', dept: 'Marketing' });
//            user2.save(function (err) {
//                should.not.exists(err);
//                user2.userId.should.eql(1);
//                done();
//            });
//        });
//
//    });
//
//
//    it('should start counting at specified number (Test 3)', function (done) {
//
//        var userSchema = new mongoose.Schema({
//            name: String,
//            dept: String
//        });
//        userSchema.plugin(autoIncrement.plugin, { model: 'User', startAt: 3 });
//        var User = db.model('User', userSchema);
//
//        var user = new User({ name: 'Charlie', dept: 'Support' });
//        user.save(function (err) {
//            should.not.exists(err);
//            user._id.should.eql(3);
//
//            var user2 = new User({ name: 'Charlene', dept: 'Marketing' });
//            user2.save(function (err) {
//                should.not.exists(err);
//                user2._id.should.eql(4);
//                done();
//            });
//        });
//
//    });
//
//    it('should increment by the specified amount (Test 4)', function (done) {
//
//        var userSchema = new mongoose.Schema({
//            name: String,
//            dept: String
//        });
//        userSchema.plugin(autoIncrement.plugin, { model: 'User', incrementBy: 5 });
//        var User = db.model('User', userSchema);
//
//        var user = new User({ name: 'Charlie', dept: 'Support' });
//        // Save user and verify ID.
//        return q.nmcall(user, 'save').then(function (user) {
//            user._id.should.eql(0);
//
//            // Create and save a second user, verifying the ID incremented by 5.
//            var user2 = new User({ name: 'Charlene', dept: 'Marketing' });
//            return q.nmcall(user2, 'save');
//        }).done(function (user2) {
//                user2._id.should.eql(5);
//                done();
//            });
//
//    });

    describe('helper function', function () {

        it('nextCount should return the next count for the model and field (Test 5)', function (done) {

            // Arrange
            var userSchema = new mongoose.Schema({
                name: String,
                dept: String
            });
            userSchema.plugin(autoIncrement.plugin, 'User');
            var User = db.model('User', userSchema),
                user1 = new User({ name: 'Charlie', dept: 'Support' }),
                user2 = new User({ name: 'Charlene', dept: 'Marketing' });;

            // Act
            async.series({
                count1: function (cb) {
                    user1.nextCount(cb);
                },
                user1: function (cb) {
                    user1.save(cb);
                },
                count2: function (cb) {
                    user1.nextCount(cb);
                },
                user2: function (cb) {
                    user2.save(cb);
                },
                count3: function (cb) {
                    user2.nextCount(cb);
                }
            }, assert);

            // Assert
            function assert(err, results) {
                should.not.exist(err);
                results.count1.should.equal(0);
                results.user1[0].should.have.property('_id', 0);
                results.count2.should.equal(1);
                results.user2[0].should.have.property('_id', 1);
                results.count3.should.equal(2);
                done();
            }

        });

//        it('resetCount should cause the count to reset as if there were no documents yet.', function (done) {
//
//            var userSchema = new mongoose.Schema({
//                name: String,
//                dept: String
//            });
//            userSchema.plugin(autoIncrement.plugin, 'User');
//            var User = db.model('User', userSchema);
//
//            // Create user and save it.
//            var user = new User({name: 'Charlie', dept: 'Support'});
//            // Now save user and check if its _id is what nextCount said.
//            return q.nmcall(user, 'save').should.become(0).then(function (user) {
//                user._id.should.eql(0);
//                // Call nextCount to ensure it returns one.
//                return q.nmcall(user, 'nextCount');
//            }).then(function (count) {
//                    count.should.eql(1);
//                    // Now call resetCount, then nextCount again to verify the count was reset.
//                    return q.nmcall(user, 'resetCount');
//                }).then(q.nmcall(user, 'nextCount')).then(function (count) {
//                    count.should.eql(0);
//                });
//
//        });

    });
});
