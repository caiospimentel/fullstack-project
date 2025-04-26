require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');

async function connectRabbitMQ() {
    const maxRetries = 10;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            console.log('🟢 Connected to RabbitMQ');
            return connection;
        } catch (error) {
            console.error(`🔴 RabbitMQ connection failed (attempt ${retries + 1}/${maxRetries}), retrying in 5s...`);
            retries++;
            await new Promise(res => setTimeout(res, 5000)); // wait 5 seconds
        }
    }

    throw new Error('❌ Could not connect to RabbitMQ after several retries');
}

async function start() {
    try {
        console.log('Inside worker, starting to process message...');
        console.log('SMTP_USER:', process.env.SMTP_USER);

        const connection = await connectRabbitMQ(); // Use the retryable connection
        const channel = await connection.createChannel();
        const queue = 'send-email';

        await channel.assertQueue(queue, { durable: true });

        console.log('Waiting for messages in %s', queue);

        channel.consume(queue, async (msg) => {
            try {
                if (msg !== null) {
                    const emailData = JSON.parse(msg.content.toString());
                    console.log('Received email job:', emailData);

                    let transporter = nodemailer.createTransport({
                        host: process.env.SMTP_HOST,
                        port: process.env.SMTP_PORT,
                        secure: false,
                    });

                    await transporter.sendMail({
                        from: '"Evently" <noreply@example.com>',
                        to: emailData.to,
                        subject: emailData.subject,
                        text: emailData.text,
                    });

                    console.log('Email sent to:', emailData.to);
                    channel.ack(msg);
                }
            } catch (err) {
                console.error('Error while processing email job:', err);
                channel.ack(msg);
            }
        }, { noAck: false });

        await new Promise(() => { });

    } catch (error) {
        console.error('Worker fatal error:', error);
        process.exit(1); // crash hard if unrecoverable
    }
}


start();