var amqp = require('amqplib/callback_api');

var url = process.env.RABBIT_AMQP_URL || 'amqp://loclhost';

module.exports = createQueueChannel;

function createQueueChannel(queue, cb) {
    amqp.connect(url, onceConnected);

    function onceConnected(err, conn) {
        if (err) {
            console.error('Error connecting:', err.stack);
        } else {
            console.log('connected');
            conn.createChannel(onceChannelCreated);
        }

        function onceChannelCreated(err, channel) {
            if (err) {
                cb(err);
            } else {
                channel.assertQueue(queue, {
                    durable: true
                }, onceQueueCreated);
            }

            function onceQueueCreated(err) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, channel, conn);
                }
            }
        }
    }
}
